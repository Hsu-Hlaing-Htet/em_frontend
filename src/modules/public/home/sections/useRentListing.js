import {
    ref,
    onMounted,
} from 'vue';

export function useRentListing() {

    const loading = ref(false);

    const rentProperties = ref([]);

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

    async function fetchRentProperties() {

        loading.value = true;

        await new Promise((resolve) =>
            setTimeout(resolve, 500)
        );

        rentProperties.value = [

            {
                id: 1,
                property_name: 'Modern Apartment',
                property_code: 'RR-R-0001',
                township: 'Sanchaung',
                bedrooms: 2,
                area_sqft: 1200,
                purpose: 'rent',
                monthly_rent: 1200,
                featured_image:
                    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
            },

            {
                id: 2,
                property_name: 'Luxury River View Condo',
                property_code: 'RR-R-0002',
                township: 'Ahlone',
                bedrooms: 3,
                area_sqft: 1600,
                purpose: 'rent',
                monthly_rent: 2200,
                featured_image:
                    'https://images.unsplash.com/photo-1494526585095-c41746248156',
            },

            {
                id: 3,
                property_name: 'Studio Apartment',
                property_code: 'RR-R-0003',
                township: 'Kamayut',
                bedrooms: 1,
                area_sqft: 700,
                purpose: 'rent',
                monthly_rent: 700,
                featured_image:
                    'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
            },

            {
                id: 4,
                property_name: 'Luxury Penthouse',
                property_code: 'RR-R-0004',
                township: 'Downtown',
                bedrooms: 4,
                area_sqft: 3200,
                purpose: 'rent',
                monthly_rent: 4500,
                featured_image:
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
            },

            {
                id: 5,
                property_name: 'Cozy Family Apartment',
                property_code: 'RR-R-0005',
                township: 'Hledan',
                bedrooms: 2,
                area_sqft: 1100,
                purpose: 'rent',
                monthly_rent: 950,
                featured_image:
                    'https://images.unsplash.com/photo-1484154218962-a197022b5858',
            },

            {
                id: 6,
                property_name: 'City View Condo',
                property_code: 'RR-R-0006',
                township: 'Botahtaung',
                bedrooms: 3,
                area_sqft: 1500,
                purpose: 'rent',
                monthly_rent: 1800,
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

        fetchRentProperties();
    });

    return {

        rentProperties,
        loading,
        onCompare,
        responsiveOptions,

    };
}