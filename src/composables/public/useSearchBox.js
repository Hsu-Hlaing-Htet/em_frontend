import {
    reactive,
    ref,
    onMounted,
} from 'vue';
import { formatCurrency } from '@/utils/formatter';

export function useSearchBox() {

    const search = reactive({
        offer_type: null,
        property_type: null,
        township: '',
        price_range: null,
        bedrooms: null,
        property_id: '',
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

    const propertyTypeOptions = [
        { label: 'Any', value: null },
        { label: 'Apartment', value: 'apartment' },
        { label: 'Condo', value: 'condo' },
        { label: 'House', value: 'house' },
    ];

    const priceRangeOptions = [
        { label: 'Any', value: null },
        { label: `Under ${formatCurrency(1000)}`, value: '1000' },
        { label: `${formatCurrency(1000)} - ${formatCurrency(3000)}`, value: '3000' },
        { label: `${formatCurrency(3000)}+`, value: '5000' },
    ];

    const bedroomOptions = [
        { label: 'Any', value: null },
        { label: '1+', value: 1 },
        { label: '2+', value: 2 },
        { label: '3+', value: 3 },
        { label: '4+', value: 4 },
    ];

    const dummyProperties = [

        {
            id: 1,
            property_name: 'Luxury Condo in Yankin',
            property_code: 'RR-S-0001',
            township: 'Yankin',
            bedrooms: 3,
            area_sqft: 1800,
            purpose: 'sale',
            sale_price: 350000,
            featured_image:
                'https://images.unsplash.com/photo-1560185007-cde436f6a4d0',
            gallery_images: [
                'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
            ],
        },

        {
            id: 2,
            property_name: 'Modern Apartment',
            property_code: 'RR-R-0002',
            township: 'Sanchaung',
            bedrooms: 2,
            area_sqft: 1200,
            purpose: 'rent',
            monthly_rent: 1200,
            featured_image:
                'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
            gallery_images: [
                'https://images.unsplash.com/photo-1560185007-cde436f6a4d0',
            ],
        },

        {
            id: 3,
            property_name: 'Family House in Mayangone',
            property_code: 'RR-S-0003',
            township: 'Mayangone',
            bedrooms: 4,
            area_sqft: 2400,
            purpose: 'sale',
            sale_price: 480000,
            featured_image:
                'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
        },

        {
            id: 4,
            property_name: 'Penthouse Suite',
            property_code: 'RR-S-0004',
            township: 'Downtown',
            bedrooms: 3,
            area_sqft: 2800,
            purpose: 'sale',
            sale_price: 850000,
            featured_image:
                'https://images.unsplash.com/photo-1494526585095-c41746248156',
        },

        {
            id: 5,
            property_name: 'Luxury Villa',
            property_code: 'RR-S-0005',
            township: 'Bahan',
            bedrooms: 5,
            area_sqft: 4000,
            purpose: 'sale',
            sale_price: 1200000,
            featured_image:
                'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
        },

        {
            id: 6,
            property_name: 'Studio Apartment',
            property_code: 'RR-R-0006',
            township: 'Kamayut',
            bedrooms: 1,
            area_sqft: 700,
            purpose: 'rent',
            monthly_rent: 700,
            featured_image:
                'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
        },

    ];

    function applyPagination() {

        const end =
            page.value * perPage;

        properties.value =
            allResults.value.slice(0, end);

        hasMoreResults.value =
            allResults.value.length > end;
    }

    async function searchProperties() {

        loading.value = true;

        await new Promise((resolve) =>
            setTimeout(resolve, 500)
        );

        allResults.value =
            dummyProperties.filter((property) => {

                let match = true;

                if (
                    search.offer_type &&
                    property.purpose !== search.offer_type
                ) {
                    match = false;
                }

                if (
                    search.property_type &&
                    !property.property_name
                        .toLowerCase()
                        .includes(
                            search.property_type.toLowerCase()
                        )
                ) {
                    match = false;
                }

                if (
                    search.township &&
                    !property.township
                        .toLowerCase()
                        .includes(
                            search.township.toLowerCase()
                        )
                ) {
                    match = false;
                }

                if (
                    search.bedrooms &&
                    property.bedrooms < search.bedrooms
                ) {
                    match = false;
                }

                if (
                    search.property_id &&
                    !property.property_code
                        .toLowerCase()
                        .includes(
                            search.property_id.toLowerCase()
                        )
                ) {
                    match = false;
                }

                return match;
            });

        page.value = 1;

        applyPagination();

        loading.value = false;
    }

    function loadMoreProperties() {

        page.value++;

        applyPagination();
    }

    function clearSearch() {

        search.offer_type = null;
        search.property_type = null;
        search.township = '';
        search.price_range = null;
        search.bedrooms = null;
        search.property_id = '';

        allResults.value =
            dummyProperties;

        page.value = 1;

        applyPagination();
    }

    function onCompare(property) {

        console.log(
            'Compare Property:',
            property
        );
    }

    onMounted(() => {

        allResults.value =
            dummyProperties;

        applyPagination();
    });

    return {

        allResults,
        search,

        properties,
        loading,
        hasMoreResults,

        offerTypeOptions,
        propertyTypeOptions,
        priceRangeOptions,
        bedroomOptions,

        searchProperties,
        loadMoreProperties,
        clearSearch,

        onCompare,
    };
}