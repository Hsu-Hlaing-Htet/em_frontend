import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
} from 'vue';
import { getPublicProperties } from '@/modules/public/service';

export const sampleSaleProperties = [
    {
        id: 1,
        property_name: 'Luxury Condo in Yankin',
        property_code: 'RR-S-0001',
        property_type: 'condo',
        township: 'Yankin',
        address: 'Golden Valley Avenue, Yankin Township, Yangon',
        status: 'available',
        bedrooms: 3,
        bathrooms: 3,
        area_sqft: 1800,
        purpose: 'sale',
        sale_price: 350000,
        featured_image:
            'https://images.unsplash.com/photo-1560185007-cde436f6a4d0',
        gallery_images: [
            'https://images.unsplash.com/photo-1560185127-6ed189bf02f4',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
        ],
        description:
            'A bright high-floor condo with generous living space, polished finishes, and quick access to Yankin shopping, dining, and schools.',
    },
    {
        id: 2,
        property_name: 'Family House in Mayangone',
        property_code: 'RR-S-0002',
        property_type: 'house',
        township: 'Mayangone',
        address: 'Parami Road, Mayangone Township, Yangon',
        status: 'available',
        bedrooms: 4,
        bathrooms: 4,
        area_sqft: 2400,
        purpose: 'sale',
        sale_price: 480000,
        featured_image:
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be',
        gallery_images: [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
            'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b',
        ],
        description:
            'A practical detached home with a private driveway, comfortable family rooms, and a calm residential setting near Parami Road.',
    },
    {
        id: 3,
        property_name: 'Bahan Garden Villa',
        property_code: 'RR-S-0003',
        property_type: 'villa',
        township: 'Bahan',
        address: 'Kaba Aye Pagoda Road, Bahan Township, Yangon',
        status: 'available',
        bedrooms: 5,
        bathrooms: 5,
        area_sqft: 4000,
        purpose: 'sale',
        sale_price: 1200000,
        featured_image:
            'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
        gallery_images: [
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3',
            'https://images.unsplash.com/photo-1600210492493-0946911123ea',
        ],
        description:
            'A substantial villa with a landscaped garden, formal entertaining areas, and a prestigious Bahan address close to major city routes.',
    },
    {
        id: 4,
        property_name: 'Downtown Penthouse Suite',
        property_code: 'RR-S-0004',
        property_type: 'penthouse',
        township: 'Downtown',
        address: 'Sule Pagoda Road, Kyauktada Township, Yangon',
        status: 'available',
        bedrooms: 3,
        bathrooms: 3,
        area_sqft: 2800,
        purpose: 'sale',
        sale_price: 850000,
        featured_image:
            'https://images.unsplash.com/photo-1494526585095-c41746248156',
        gallery_images: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
            'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',
            'https://images.unsplash.com/photo-1600607687644-c7171b42498b',
        ],
        description:
            'A city-view penthouse with open-plan living, refined bedrooms, and walkable access to offices, hotels, and restaurants downtown.',
    },
    {
        id: 5,
        property_name: 'Ahlone River View Condo',
        property_code: 'RR-S-0005',
        property_type: 'condo',
        township: 'Ahlone',
        address: 'Strand Road, Ahlone Township, Yangon',
        status: 'available',
        bedrooms: 3,
        bathrooms: 2,
        area_sqft: 1650,
        purpose: 'sale',
        sale_price: 410000,
        featured_image:
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        gallery_images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858',
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
        ],
        description:
            'A modern river-facing condo with efficient room planning, warm interior finishes, and convenient access to the Strand corridor.',
    },
    {
        id: 6,
        property_name: 'Kamayut Modern Residence',
        property_code: 'RR-S-0006',
        property_type: 'apartment',
        township: 'Kamayut',
        address: 'Hledan Road, Kamayut Township, Yangon',
        status: 'available',
        bedrooms: 2,
        bathrooms: 2,
        area_sqft: 1250,
        purpose: 'sale',
        sale_price: 265000,
        featured_image:
            'https://images.unsplash.com/photo-1484154218962-a197022b5858',
        gallery_images: [
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
            'https://images.unsplash.com/photo-1560448204-603b3fc33ddc',
        ],
        description:
            'A compact modern home near Hledan with practical storage, clean interiors, and strong appeal for first-time buyers or investors.',
    },
];

export function useSale() {
    const loading = ref(false);
    const properties = ref([...sampleSaleProperties]);
    const activeHeroImageIndex = ref(0);
    const showHelpQuestion = ref(false);

    let heroSliderTimer = null;
    let helpQuestionTimer = null;

    const heroProperty = computed(() => properties.value[0] || null);
    const heroImages = computed(() => propertyImages(heroProperty.value));
    const activeHeroImage = computed(() =>
        heroImages.value[activeHeroImageIndex.value] ||
        heroProperty.value?.featured_image ||
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be'
    );
    const heroPrice = computed(() =>
        formatPrice(heroProperty.value?.sale_price)
    );

    async function fetchSaleProperties() {
        loading.value = true;

        try {
            const { data } = await getPublicProperties({ purpose: 'sale' });
            const listings = Array.isArray(data?.data) ? data.data : [];

            properties.value = listings.length
                ? listings
                : [...sampleSaleProperties];
        } catch {
            properties.value = [...sampleSaleProperties];
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

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(Number(value));
}

function formatArea(value) {
    if (!value) {
        return '-';
    }

    return new Intl.NumberFormat('en-US').format(Number(value));
}
