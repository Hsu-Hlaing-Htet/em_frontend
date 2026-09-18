import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    reactive,
    ref,
} from 'vue';

import { useRouter } from 'vue-router';
import { useAppToast } from '@/composables/global/useAppToast';

import {
    getFeaturedProperties,
    getPropertyStats,
    getPublicProperties,
} from '@/modules/public/service';
import { formatCurrency } from '@/utils/formatter';

function unwrapList(response) {
    const body = response?.data;
    if (Array.isArray(body?.data)) {
        return body.data;
    }
    if (Array.isArray(body)) {
        return body;
    }
    return [];
}

function unwrapMetaTotal(response) {
    return Number(response?.data?.meta?.total ?? 0);
}

function mapMiniListing(property) {
    const priceValue = property.purpose === 'rent'
        ? (property.monthly_rent ?? property.rent_price)
        : property.sale_price;

    return {
        id: property.id,
        purpose: property.purpose,
        title: property.property_name,
        price: priceValue
            ? (property.purpose === 'rent'
                ? `${formatCurrency(Number(priceValue))} / month`
                : formatCurrency(Number(priceValue)))
            : 'Contact for price',
        location: property.township || property.address || '',
        image: property.featured_image,
    };
}

export function useLanding() {
    const router = useRouter();
    const toast = useAppToast();

    const loading = ref(false);

    const featured = reactive({
        sale: [],
        rent: [],
    });

    const stats = reactive({
        total_properties: 0,
        available: 0,
    });

    const latestListings = ref([]);

    const search = reactive({
        offer_type: null,
        township: '',
        price_range: null,
    });

    const offerTypeOptions = [
        { label: 'Any', value: null },
        { label: 'For Sale', value: 'sale' },
        { label: 'For Rent', value: 'rent' },
    ];

    const priceRangeOptions = [
        { label: 'Any', value: null },
        { label: `Under ${formatCurrency(1000)}`, value: { min: null, max: 1000 } },
        { label: `${formatCurrency(1000)} - ${formatCurrency(2000)}`, value: { min: 1000, max: 2000 } },
        { label: `${formatCurrency(2000)} - ${formatCurrency(5000)}`, value: { min: 2000, max: 5000 } },
        { label: `${formatCurrency(5000)}+`, value: { min: 5000, max: null } },
    ];

    const serviceTiles = [
        {
            title: 'Rent Service',
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        },
        {
            title: 'Sales Service',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
        },
        {
            title: 'Visa Service',
            image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
        },
        {
            title: 'Property Management',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
        },
        {
            title: 'Concierge Services',
            image: 'https://images.unsplash.com/photo-1521783593447-5702b9bfd267',
        },
    ];

    const latestCommercialSpace = computed(() =>
        latestListings.value.slice(0, 3).map(mapMiniListing)
    );

    let revealObserver = null;

    function setupRevealObserver() {
        revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.16 }
        );

        document.querySelectorAll('.reveal, .fade-on-scroll, .reveal-stagger').forEach((element) => {
            revealObserver.observe(element);
        });
    }

    function destroyRevealObserver() {
        if (revealObserver) {
            revealObserver.disconnect();
            revealObserver = null;
        }
    }

    async function load() {
        loading.value = true;

        try {
            const [featuredRes, statsRes, saleRes, rentRes] = await Promise.all([
                getFeaturedProperties(),
                getPropertyStats(),
                getPublicProperties({ purpose: 'sale', per_page: 6 }),
                getPublicProperties({ purpose: 'rent', per_page: 6 }),
            ]);

            const featuredSale = unwrapList(featuredRes);
            const saleListings = unwrapList(saleRes);
            const rentListings = unwrapList(rentRes);

            featured.sale = featuredSale.length ? featuredSale : saleListings;
            featured.rent = rentListings;

            latestListings.value = [...featured.sale, ...featured.rent].slice(0, 6);

            const statsPayload = statsRes?.data?.data ?? {};
            const saleTotal = unwrapMetaTotal(saleRes);
            const rentTotal = unwrapMetaTotal(rentRes);

            stats.total_properties = Number(statsPayload.total ?? (saleTotal + rentTotal));
            stats.available = Number(statsPayload.available ?? rentTotal);
        } catch (error) {
            featured.sale = [];
            featured.rent = [];
            latestListings.value = [];

            toast.add({
                severity: 'warn',
                summary: 'Data Load Issue',
                detail:
                    error.response?.data?.message ||
                    'Unable to load homepage data.',
                life: 3000,
            });
        } finally {
            loading.value = false;
        }
    }

    function searchProperties() {
        const min = search.price_range?.min ?? undefined;
        const max = search.price_range?.max ?? undefined;
        const purpose = search.offer_type || 'sale';

        router.push({
            path: purpose === 'rent' ? '/rent' : '/buy',
            query: {
                purpose,
                township: search.township || undefined,
                budget_min: min,
                budget_max: max,
            },
        });
    }

    function clearSearch() {
        search.offer_type = null;
        search.township = '';
        search.price_range = null;
    }

    function onCompare(property) {
        toast.add({
            severity: 'info',
            summary: 'Compare',
            detail: `${property.property_name} added to compare list.`,
            life: 2000,
        });
    }

    onMounted(async () => {
        await load();
        await nextTick();
        setupRevealObserver();
    });

    onBeforeUnmount(() => {
        destroyRevealObserver();
    });

    return {
        router,
        loading,
        featured,
        stats,
        latestListings,
        search,

        offerTypeOptions,
        priceRangeOptions,

        serviceTiles,

        latestCommercialSpace,

        searchProperties,
        clearSearch,
        onCompare,
    };
}
