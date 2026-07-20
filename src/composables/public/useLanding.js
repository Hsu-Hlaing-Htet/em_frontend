import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    reactive,
    ref,
} from 'vue';

import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

import {
    getFeaturedProperties,
    getPropertyStats,
    getPublicProperties,
} from '@/modules/public/service';

export function useLanding() {
    const router = useRouter();
    const toast = useToast();

    const loading = ref(false);

    const featured = reactive({
        sale: [],
        rent: [],
        houses: [],
        condos: [],
    });

    const stats = reactive({
        total_properties: 0,
        total_clients: 0,
        years_of_service: 0,
        available: 0,
        occupied: 0,
    });

    const latestListings = ref([]);

    const search = reactive({
        offer_type: null,
        property_type: null,
        township: '',
        price_range: null,
        bedrooms: null,
        property_id: '',
    });

    const offerTypeOptions = [
        { label: 'Any', value: null },
        { label: 'For Sale', value: 'sale' },
        { label: 'For Rent', value: 'rent' },
    ];

    const propertyTypeOptions = [
        { label: 'Any', value: null },
        { label: 'Apartment', value: 'apartment' },
        { label: 'Condo', value: 'condo' },
        { label: 'House', value: 'house' },
    ];

    const priceRangeOptions = [
        { label: 'Any', value: null },
        { label: 'Under $1,000', value: { min: null, max: 1000 } },
        { label: '$1,000 - $2,000', value: { min: 1000, max: 2000 } },
        { label: '$2,000 - $5,000', value: { min: 2000, max: 5000 } },
        { label: '$5,000+', value: { min: 5000, max: null } },
    ];

    const bedroomOptions = [
        { label: 'Any', value: null },
        { label: '1+', value: 1 },
        { label: '2+', value: 2 },
        { label: '3+', value: 3 },
        { label: '4+', value: 4 },
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

    const propertyTypes = [
        {
            title: 'Condo',
            image: 'https://images.unsplash.com/photo-1494526585095-c41746248156',
        },
        {
            title: 'House',
            image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
        },
        {
            title: 'Commercial',
            image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174',
        },
        {
            title: 'Penthouse',
            image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
        },
        {
            title: 'Apartment',
            image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858',
        },
        {
            title: 'Serviced Apartment',
            image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118',
        },
    ];

    const latestCommercialSpace = computed(() => [
        {
            title: 'Downtown Office Suite',
            price: '$4,500 / month',
            location: 'Central Business District',
            image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
        },
        {
            title: 'Retail Corner Unit',
            price: '$3,200 / month',
            location: 'Sanchaung',
            image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174',
        },
        {
            title: 'Executive Business Floor',
            price: '$8,900 / month',
            location: 'Yankin',
            image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2',
        },
    ]);

    const latestHouses = computed(() => {
        if (featured.houses.length) {
            return featured.houses.slice(0, 3).map((property) => ({
                title: property.property_name,
                price: property.sale_price
                    ? `$${Number(property.sale_price).toLocaleString()}`
                    : '$--',
                location: property.township,
                image: property.featured_image,
            }));
        }

        return [];
    });

    const latestPenthouses = computed(() => [
        {
            title: 'Skyline Penthouse One',
            price: '$6,800 / month',
            location: 'Yankin',
            image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
        },
    ]);

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
            const [featuredRes, statsRes, latestRes] = await Promise.all([
                getFeaturedProperties(),
                getPropertyStats(),
                getPublicProperties({ page: 1 }),
            ]);

            Object.assign(featured, featuredRes.data);
            Object.assign(stats, statsRes.data);

            latestListings.value = latestRes.data.data || [];
        } catch (error) {
            Object.assign(stats, {
                total_properties: 48,
                total_clients: 126,
                years_of_service: 12,
                available: 14,
            });

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

        router.push({
            path: '/properties',
            query: {
                purpose: search.offer_type || undefined,
                property_type: search.property_type || undefined,
                township: search.township || undefined,
                budget_min: min,
                budget_max: max,
                bedrooms: search.bedrooms || undefined,
                property_id: search.property_id || undefined,
                q: search.property_id || undefined,
            },
        });
    }

    function clearSearch() {
        search.offer_type = null;
        search.property_type = null;
        search.township = '';
        search.price_range = null;
        search.bedrooms = null;
        search.property_id = '';
    }

    function onCompare(property) {
        toast.add({
            severity: 'info',
            summary: 'Compare',
            detail: `${property.property_name} added to compare list (demo).`,
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
        propertyTypeOptions,
        priceRangeOptions,
        bedroomOptions,

        serviceTiles,
        propertyTypes,

        latestCommercialSpace,
        latestHouses,
        latestPenthouses,

        searchProperties,
        clearSearch,
        onCompare,
    };
}