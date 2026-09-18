import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPublicProperties } from '@/modules/public/service';

function unwrapList(response) {
    const body = response?.data;
    if (Array.isArray(body?.data)) return body.data;
    if (Array.isArray(body)) return body;
    return [];
}

function priceOf(property) {
    if (property.purpose === 'sale') {
        return Number(property.sale_price || 0);
    }
    return Number(property.monthly_rent ?? property.rent_price ?? 0);
}

export function usePropertyListing(options = {}) {
    const route = useRoute();
    const router = useRouter();
    const fixedPurpose = options.fixedPurpose ?? null;

    const loading = ref(false);
    const error = ref(false);
    const page = ref(1);
    const perPage = ref(12);
    const sort = ref('newest');
    const filtersOpen = ref(false);
    const allProperties = ref([]);
    const resultMeta = reactive({
        total: 0,
    });

    const filters = reactive({
        purpose: fixedPurpose || route.query.purpose || 'all',
        search: route.query.q || route.query.search || '',
        township: route.query.township || '',
        price_min: route.query.budget_min || route.query.price_min || '',
        price_max: route.query.budget_max || route.query.price_max || '',
        area_min: route.query.area_min || '',
        area_max: route.query.area_max || '',
    });

    const filtered = computed(() => {
        let list = [...allProperties.value];

        if (filters.township) {
            const needle = String(filters.township).toLowerCase();
            list = list.filter((item) =>
                String(item.township || item.address || '').toLowerCase().includes(needle)
            );
        }

        if (filters.price_min) {
            list = list.filter((item) => priceOf(item) >= Number(filters.price_min));
        }

        if (filters.price_max) {
            list = list.filter((item) => {
                const price = priceOf(item);
                return !price || price <= Number(filters.price_max);
            });
        }

        if (filters.area_min) {
            list = list.filter((item) => Number(item.area_sqft || 0) >= Number(filters.area_min));
        }

        if (filters.area_max) {
            list = list.filter((item) => {
                if (!item.area_sqft) return false;
                return Number(item.area_sqft) <= Number(filters.area_max);
            });
        }

        if (filters.search) {
            const needle = String(filters.search).toLowerCase();
            list = list.filter((item) =>
                [
                    item.property_name,
                    item.township,
                    item.city,
                    item.address,
                    item.description,
                ]
                    .filter(Boolean)
                    .some((value) => String(value).toLowerCase().includes(needle))
            );
        }

        if (sort.value === 'price_asc') {
            list.sort((a, b) => priceOf(a) - priceOf(b));
        } else if (sort.value === 'price_desc') {
            list.sort((a, b) => priceOf(b) - priceOf(a));
        } else {
            list.sort((a, b) => Number(b.id) - Number(a.id));
        }

        return list;
    });

    const totalPages = computed(() =>
        Math.max(1, Math.ceil((filtered.value.length || 0) / perPage.value) || 1)
    );

    const properties = computed(() => {
        const start = (page.value - 1) * perPage.value;
        return filtered.value.slice(start, start + perPage.value);
    });

    const activeFilterChips = computed(() => {
        const chips = [];

        if (!fixedPurpose && filters.purpose && filters.purpose !== 'all') {
            chips.push({
                key: 'purpose',
                label: filters.purpose === 'rent' ? 'Rent' : 'Sale',
            });
        }

        if (filters.search) {
            chips.push({ key: 'search', label: filters.search });
        }

        if (filters.township) {
            chips.push({ key: 'township', label: filters.township });
        }

        if (filters.price_min) {
            chips.push({ key: 'price_min', label: `Min ${filters.price_min}` });
        }

        if (filters.price_max) {
            chips.push({ key: 'price_max', label: `Max ${filters.price_max}` });
        }

        if (filters.area_min) {
            chips.push({ key: 'area_min', label: `Min ${filters.area_min} sqft` });
        }

        if (filters.area_max) {
            chips.push({ key: 'area_max', label: `Max ${filters.area_max} sqft` });
        }

        return chips;
    });

    async function fetchProperties({ resetPage = true } = {}) {
        loading.value = true;
        error.value = false;

        try {
            const purpose = fixedPurpose || (filters.purpose === 'all' ? null : filters.purpose);
            const purposes = purpose ? [purpose] : ['rent', 'sale'];

            const responses = await Promise.all(
                purposes.map((item) =>
                    getPublicProperties({
                        purpose: item,
                        per_page: 48,
                        search: filters.search || filters.township || undefined,
                    })
                )
            );

            allProperties.value = responses.flatMap(unwrapList);
            resultMeta.total = filtered.value.length;
            if (resetPage) {
                page.value = 1;
            }
        } catch {
            allProperties.value = [];
            resultMeta.total = 0;
            error.value = true;
        } finally {
            loading.value = false;
        }
    }

    function syncQuery() {
        const query = {};
        if (!fixedPurpose && filters.purpose && filters.purpose !== 'all') {
            query.purpose = filters.purpose;
        }
        if (filters.search) query.q = filters.search;
        if (filters.township) query.township = filters.township;
        if (filters.price_min) query.price_min = filters.price_min;
        if (filters.price_max) query.price_max = filters.price_max;
        if (filters.area_min) query.area_min = filters.area_min;
        if (filters.area_max) query.area_max = filters.area_max;

        router.replace({ query });
    }

    async function applyFilters(next = {}) {
        Object.assign(filters, next);
        if (fixedPurpose) {
            filters.purpose = fixedPurpose;
        }
        syncQuery();
        await fetchProperties({ resetPage: true });
        filtersOpen.value = false;
    }

    async function clearFilters() {
        Object.assign(filters, {
            purpose: fixedPurpose || 'all',
            search: '',
            township: '',
            price_min: '',
            price_max: '',
            area_min: '',
            area_max: '',
        });
        syncQuery();
        await fetchProperties({ resetPage: true });
        filtersOpen.value = false;
    }

    async function removeFilterChip(key) {
        if (key === 'purpose') {
            filters.purpose = fixedPurpose || 'all';
        } else if (Object.prototype.hasOwnProperty.call(filters, key)) {
            filters[key] = '';
        }
        syncQuery();
        await fetchProperties({ resetPage: true });
    }

    async function setPurpose(purpose) {
        if (fixedPurpose) return;
        filters.purpose = purpose;
        syncQuery();
        await fetchProperties({ resetPage: true });
    }

    function goToPage(nextPage) {
        const target = Math.min(Math.max(1, nextPage), totalPages.value);
        page.value = target;
    }

    watch(filtered, () => {
        resultMeta.total = filtered.value.length;
        if (page.value > totalPages.value) {
            page.value = totalPages.value;
        }
    });

    return {
        loading,
        error,
        page,
        perPage,
        sort,
        filters,
        filtersOpen,
        properties,
        filtered,
        totalPages,
        resultMeta,
        activeFilterChips,
        fetchProperties,
        applyFilters,
        clearFilters,
        removeFilterChip,
        setPurpose,
        goToPage,
        syncQuery,
    };
}
