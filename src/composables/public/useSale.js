import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
} from 'vue';
import { getPublicProperties } from '@/modules/public/service';
import { formatCurrency } from '@/utils/formatter';

export function useSale() {
    const loading = ref(false);
    const properties = ref([]);
    const activeHeroImageIndex = ref(0);
    const showHelpQuestion = ref(false);

    let heroSliderTimer = null;
    let helpQuestionTimer = null;

    const heroProperty = computed(() => properties.value[0] || null);
    const heroImages = computed(() => propertyImages(heroProperty.value));
    const activeHeroImage = computed(() =>
        heroImages.value[activeHeroImageIndex.value] ||
        heroProperty.value?.featured_image ||
        null
    );
    const heroPrice = computed(() =>
        formatPrice(heroProperty.value?.sale_price)
    );

    async function fetchSaleProperties() {
        loading.value = true;

        try {
            const { data } = await getPublicProperties({
                purpose: 'sale',
                per_page: 48,
            });
            properties.value = Array.isArray(data?.data) ? data.data : [];
        } catch {
            properties.value = [];
        } finally {
            loading.value = false;
        }
    }

    function nextHeroImage() {
        const imageCount = heroImages.value.length;

        if (imageCount <= 1) {
            return;
        }

        activeHeroImageIndex.value =
            (activeHeroImageIndex.value + 1) % imageCount;
    }

    function previousHeroImage() {
        const imageCount = heroImages.value.length;

        if (imageCount <= 1) {
            return;
        }

        activeHeroImageIndex.value =
            (activeHeroImageIndex.value - 1 + imageCount) % imageCount;
    }

    function selectHeroImage(index) {
        if (
            Number.isInteger(index) &&
            index >= 0 &&
            index < heroImages.value.length
        ) {
            activeHeroImageIndex.value = index;
        }
    }

    function startHeroSlider() {
        stopHeroSlider();

        if (heroImages.value.length <= 1) {
            return;
        }

        heroSliderTimer = window.setInterval(nextHeroImage, 4000);
    }

    function stopHeroSlider() {
        if (heroSliderTimer) {
            window.clearInterval(heroSliderTimer);
            heroSliderTimer = null;
        }
    }

    function startHelpQuestionTimer() {
        helpQuestionTimer = window.setTimeout(() => {
            showHelpQuestion.value = true;
        }, 3000);
    }

    function stopHelpQuestionTimer() {
        if (helpQuestionTimer) {
            window.clearTimeout(helpQuestionTimer);
            helpQuestionTimer = null;
        }
    }

    watch(heroImages, () => {
        activeHeroImageIndex.value = 0;
        startHeroSlider();
    });

    onMounted(() => {
        fetchSaleProperties();
        startHeroSlider();
        startHelpQuestionTimer();
    });

    onBeforeUnmount(() => {
        stopHeroSlider();
        stopHelpQuestionTimer();
    });

    return {
        properties,
        loading,
        heroProperty,
        heroImages,
        activeHeroImageIndex,
        activeHeroImage,
        heroPrice,
        showHelpQuestion,
        nextHeroImage,
        previousHeroImage,
        selectHeroImage,
        formatArea,
    };
}

function propertyImages(property) {
    const gallery = Array.isArray(property?.gallery_images)
        ? property.gallery_images
        : [];

    return [
        ...new Set([
            property?.featured_image,
            ...gallery,
        ].filter(Boolean)),
    ].slice(0, 3);
}

function formatPrice(value) {
    if (!value) {
        return 'Contact for price';
    }

    return formatCurrency(Number(value));
}

function formatArea(value) {
    if (!value) {
        return '-';
    }

    return new Intl.NumberFormat('en-US').format(Number(value));
}
