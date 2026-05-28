import { onMounted, nextTick } from "vue";

import { useFeaturedProperties } from "./sections/featured-properties/useFeaturedProperties";

export function useHome() {

    const {
        loading,
        loadFeaturedProperties,
    } = useFeaturedProperties();

    onMounted(async () => {

        await loadFeaturedProperties();

        await nextTick();
    });

    return {
        loading,
    };
}