import { computed, ref, watch } from 'vue';

const FAVORITES_KEY = 'rosewood-favorite-properties';
const RECENT_KEY = 'rosewood-recently-viewed-properties';
const COMPARE_KEY = 'rosewood-compare-properties';
const MAX_COMPARE = 3;
const MAX_RECENT = 6;

function readJson(key, fallback) {
    try {
        const raw = localStorage.getItem(key);

        if (!raw) {
            return fallback;
        }

        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function usePropertyInteractions(propertiesSource) {
    const favoriteIds = ref(readJson(FAVORITES_KEY, []));
    const recentItems = ref(readJson(RECENT_KEY, []));
    const compareItems = ref(readJson(COMPARE_KEY, []));
    const compareModalOpen = ref(false);

    const favoriteProperties = computed(() => {
        const ids = new Set(favoriteIds.value);

        return propertiesSource.value.filter((property) => ids.has(property.id));
    });

    const recentlyViewedProperties = computed(() => {
        const byId = new Map(propertiesSource.value.map((property) => [property.id, property]));

        return recentItems.value
            .map((entry) => byId.get(entry.id) ?? entry)
            .filter(Boolean)
            .slice(0, MAX_RECENT);
    });

    const canAddToCompare = computed(() => compareItems.value.length < MAX_COMPARE);

    watch(favoriteIds, (value) => writeJson(FAVORITES_KEY, value), { deep: true });
    watch(recentItems, (value) => writeJson(RECENT_KEY, value), { deep: true });
    watch(compareItems, (value) => writeJson(COMPARE_KEY, value), { deep: true });

    function isFavorite(propertyId) {
        return favoriteIds.value.includes(propertyId);
    }

    function toggleFavorite(property) {
        if (!property?.id) {
            return;
        }

        if (isFavorite(property.id)) {
            favoriteIds.value = favoriteIds.value.filter((id) => id !== property.id);
            return;
        }

        favoriteIds.value = [...favoriteIds.value, property.id];
    }

    function trackRecentlyViewed(property) {
        if (!property?.id) {
            return;
        }

        const next = [
            property,
            ...recentItems.value.filter((item) => item.id !== property.id),
        ].slice(0, MAX_RECENT);

        recentItems.value = next;
    }

    function isInCompare(propertyId) {
        return compareItems.value.some((item) => item.id === propertyId);
    }

    function toggleCompare(property) {
        if (!property?.id) {
            return;
        }

        if (isInCompare(property.id)) {
            compareItems.value = compareItems.value.filter((item) => item.id !== property.id);
            return;
        }

        if (!canAddToCompare.value) {
            return;
        }

        compareItems.value = [...compareItems.value, property];
    }

    function removeFromCompare(propertyId) {
        compareItems.value = compareItems.value.filter((item) => item.id !== propertyId);
    }

    function clearCompare() {
        compareItems.value = [];
        compareModalOpen.value = false;
    }

    function openCompareModal() {
        if (compareItems.value.length >= 2) {
            compareModalOpen.value = true;
        }
    }

    return {
        favoriteIds,
        favoriteProperties,
        recentlyViewedProperties,
        compareItems,
        compareModalOpen,
        canAddToCompare,
        isFavorite,
        toggleFavorite,
        trackRecentlyViewed,
        isInCompare,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        openCompareModal,
        maxCompare: MAX_COMPARE,
    };
}
