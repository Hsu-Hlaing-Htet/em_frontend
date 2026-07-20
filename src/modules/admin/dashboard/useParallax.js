import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

export function useParallax(speed = 0.22) {
    const scrollY = ref(0);

    function handleScroll() {
        scrollY.value = window.scrollY;
    }

    onMounted(() => {
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
    });

    onBeforeUnmount(() => {
        window.removeEventListener('scroll', handleScroll);
    });

    const layerBack = computed(() => ({
        transform: `translate3d(0, ${scrollY.value * speed * 0.35}px, 0)`,
    }));

    const layerMid = computed(() => ({
        transform: `translate3d(0, ${scrollY.value * speed * 0.65}px, 0)`,
    }));

    const layerFront = computed(() => ({
        transform: `translate3d(0, ${scrollY.value * speed}px, 0)`,
    }));

    return {
        scrollY,
        layerBack,
        layerMid,
        layerFront,
    };
}
