import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
} from 'vue';
import { getPublicProperties } from '@/modules/public/service';
import { formatCurrency } from '@/utils/formatter';

export const sampleRentProperties = [
    {
        id: 101,
        property_name: 'Golden Valley Family House',
        property_code: 'RR-R-0001',
        property_type: 'house',
        township: 'Bahan',
        address: 'Golden Valley, Bahan Township, Yangon',
        status: 'available',
        bedrooms: 4,
        bathrooms: 3,
        area_sqft: 4500,
        purpose: 'rent',
        monthly_rent: 6500,
        featured_image:
            'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',
        gallery_images: [
            'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3',
            'https://images.unsplash.com/photo-1600210492493-0946911123ea',
        ],
        description:
            'A polished four-bedroom residence in Golden Valley with generous living areas, refined interiors, and a calm private setting.',
    },
    {
        id: 102,
        property_name: 'Sanchaung Executive Condo',
        property_code: 'RR-R-0002',
        property_type: 'condo',
        township: 'Sanchaung',
        address: 'Pyay Road, Sanchaung Township, Yangon',
        status: 'available',
        bedrooms: 2,
        bathrooms: 2,
        area_sqft: 1250,
        purpose: 'rent',
        monthly_rent: 1650,
        featured_image:
            'https://images.unsplash.com/photo-1460317442991-0ec209397118',
        gallery_images: [
            'https://images.unsplash.com/photo-1460317442991-0ec209397118',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
        ],
        description:
            'A high-floor city condo designed for executive rental living with bright rooms and easy access to central Yangon.',
    },
    {
        id: 103,
        property_name: 'Inya Lake Serviced Apartment',
        property_code: 'RR-R-0003',
        property_type: 'apartment',
        township: 'Kamayut',
        address: 'Inya Road, Kamayut Township, Yangon',
        status: 'available',
        bedrooms: 3,
        bathrooms: 3,
        area_sqft: 2100,
        purpose: 'rent',
        monthly_rent: 3200,
        featured_image:
            'https://images.unsplash.com/photo-1484154218962-a197022b5858',
        gallery_images: [
            'https://images.unsplash.com/photo-1484154218962-a197022b5858',
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        ],
        description:
            'A comfortable serviced apartment near Inya Lake with spacious bedrooms, warm finishes, and convenient city access.',
    },
    {
        id: 104,
        property_name: 'Yankin Modern Residence',
        property_code: 'RR-R-0004',
        property_type: 'condo',
        township: 'Yankin',
        address: 'Sayarsan Road, Yankin Township, Yangon',
        status: 'available',
        bedrooms: 3,
        bathrooms: 2,
        area_sqft: 1600,
        purpose: 'rent',
        monthly_rent: 2400,
        featured_image:
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
        gallery_images: [
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
            'https://images.unsplash.com/photo-1560185007-cde436f6a4d0',
            'https://images.unsplash.com/photo-1560448204-603b3fc33ddc',
        ],
        description:
            'A modern rental home in Yankin with practical room planning, clean interiors, and access to daily conveniences.',
    },
];

export function useRent() {
    const loading = ref(false);
    const properties = ref([...sampleRentProperties]);
    const activeHeroImageIndex = ref(0);
    const showHelpQuestion = ref(false);

    let heroSliderTimer = null;
    let helpQuestionTimer = null;

    const heroProperty = computed(() => properties.value[0] || null);
    const heroImages = computed(() => propertyImages(heroProperty.value));
    const activeHeroImage = computed(() =>
        heroImages.value[activeHeroImageIndex.value] ||
        heroProperty.value?.featured_image ||
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d'
    );
    const heroPrice = computed(() =>
        formatPrice(heroProperty.value?.monthly_rent)
    );

    async function fetchRentProperties() {
        loading.value = true;

        try {
            const { data } = await getPublicProperties({ purpose: 'rent' });
            const listings = Array.isArray(data?.data) ? data.data : [];

            properties.value = listings.length
                ? listings
                : [...sampleRentProperties];
        } catch {
            properties.value = [...sampleRentProperties];
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
        fetchRentProperties();
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

    return `${formatCurrency(Number(value))} /month`;
}

function formatArea(value) {
    if (!value) {
        return '-';
    }

    return new Intl.NumberFormat('en-US').format(Number(value));
}
