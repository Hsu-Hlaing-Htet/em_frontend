import {
    ref,
    onMounted,
} from 'vue';
import { getFeaturedProperties } from '@/modules/public/service';

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

        try {
            const { data } = await getFeaturedProperties();
            saleProperties.value = Array.isArray(data?.data) ? data.data : [];
        } catch {
            saleProperties.value = [];
        } finally {
            loading.value = false;
        }
    }

    function onCompare(property) {
        console.log('Compare:', property);
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
