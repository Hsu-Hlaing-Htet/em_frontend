import {
    ref,
    onMounted,
} from 'vue';
import { getPublicProperties } from '@/modules/public/service';

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

        try {
            const { data } = await getPublicProperties({
                purpose: 'rent',
                per_page: 6,
            });
            rentProperties.value = Array.isArray(data?.data) ? data.data : [];
        } catch {
            rentProperties.value = [];
        } finally {
            loading.value = false;
        }
    }

    function onCompare(property) {
        console.log('Compare:', property);
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
