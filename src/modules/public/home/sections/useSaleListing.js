import {
    ref,
    onMounted,
} from 'vue';

export function useSaleListing() {

    const loading = ref(false);

    const saleProperties = ref([]);

    const responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 3,
            numScroll: 1,
        },
        {
            breakpoint: '1024px',
            numVisible: 2,
            numScroll: 1,
        },
        {
            breakpoint: '768px',
            numVisible: 1,
            numScroll: 1,
        },
    ];

    async function fetchSaleProperties() {

        loading.value = true;

        await new Promise((resolve) =>
            setTimeout(resolve, 500)
        );

        saleProperties.value = [

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
            },

            {
                id: 2,
                property_name: 'Family House in Mayangone',
                property_code: 'RR-S-0002',
                township: 'Mayangone',
                bedrooms: 4,
                area_sqft: 2400,
                purpose: 'sale',
                sale_price: 480000,
                featured_image:
                    'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
            },

            {
                id: 3,
                property_name: 'Luxury Villa',
                property_code: 'RR-S-0003',
                township: 'Bahan',
                bedrooms: 5,
                area_sqft: 4000,
                purpose: 'sale',
                sale_price: 1200000,
                featured_image:
                    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
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

        ];

        loading.value = false;
    }

    function onCompare(property) {

        console.log(
            'Compare:',
            property
        );
    }

    onMounted(() => {

        fetchSaleProperties();
    });

    return {
        saleProperties,
        loading,
        onCompare,
        responsiveOptions,
    };
}