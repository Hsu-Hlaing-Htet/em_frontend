import {
    reactive,
    ref,
    onMounted,
} from 'vue';
import { formatCurrency } from '@/utils/formatter';
import { getPublicProperties } from '@/modules/public/service';

export function useSearchBox() {
    const search = reactive({
        offer_type: null,
        township: '',
        price_range: null,
    });

    const properties = ref([]);
    const allResults = ref([]);
    const loading = ref(false);
    const hasMoreResults = ref(false);
    const page = ref(1);
    const perPage = 3;

    const offerTypeOptions = [
        { label: 'Any', value: null },
        { label: 'For Sale', value: 'sale' },
        { label: 'For Rent', value: 'rent' },
    ];

    const priceRangeOptions = [
        { label: 'Any', value: null },
        { label: `Under ${formatCurrency(1000)}`, value: '1000' },
        { label: `${formatCurrency(1000)} - ${formatCurrency(3000)}`, value: '3000' },
        { label: `${formatCurrency(3000)}+`, value: '5000' },
    ];

    function applyPagination() {
        const end = page.value * perPage;

        properties.value = allResults.value.slice(0, end);
        hasMoreResults.value = allResults.value.length > end;
    }

    function priceOf(property) {
        if (property.purpose === 'sale') {
            return Number(property.sale_price || 0);
        }
        return Number(property.monthly_rent ?? property.rent_price ?? 0);
    }

    function matchesFilters(property) {
        if (search.offer_type && property.purpose !== search.offer_type) {
            return false;
        }

        if (
            search.township &&
            !String(property.township || property.address || '')
                .toLowerCase()
                .includes(String(search.township).toLowerCase())
        ) {
            return false;
        }

        if (search.price_range) {
            const price = priceOf(property);
            const max = Number(search.price_range);
            if (max === 1000 && price >= 1000) return false;
            if (max === 3000 && (price < 1000 || price > 3000)) return false;
            if (max === 5000 && price < 3000) return false;
        }

        return true;
    }

    async function fetchListings() {
        const purposes = search.offer_type
            ? [search.offer_type]
            : ['sale', 'rent'];

        const responses = await Promise.all(
            purposes.map((purpose) =>
                getPublicProperties({
                    purpose,
                    per_page: 48,
                    search: search.township || undefined,
                })
            )
        );

        return responses.flatMap((response) => {
            const body = response?.data;
            return Array.isArray(body?.data) ? body.data : [];
        });
    }

    async function searchProperties() {
        loading.value = true;

        try {
            const listings = await fetchListings();
            allResults.value = listings.filter(matchesFilters);
            page.value = 1;
            applyPagination();
        } catch {
            allResults.value = [];
            properties.value = [];
            hasMoreResults.value = false;
        } finally {
            loading.value = false;
        }
    }

    function loadMoreProperties() {
        page.value++;
        applyPagination();
    }

    async function clearSearch() {
        search.offer_type = null;
        search.township = '';
        search.price_range = null;

        await searchProperties();
    }

    function onCompare(property) {
        console.log('Compare Property:', property);
    }

    onMounted(() => {
        searchProperties();
    });

    return {
        allResults,
        search,
        properties,
        loading,
        hasMoreResults,
        offerTypeOptions,
        priceRangeOptions,
        searchProperties,
        loadMoreProperties,
        clearSearch,
        onCompare,
    };
}
