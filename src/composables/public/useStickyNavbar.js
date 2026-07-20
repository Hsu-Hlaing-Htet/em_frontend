import { onBeforeUnmount, onMounted, ref } from 'vue';

export function useStickyNavbar(threshold = 24) {
    const isScrolled = ref(false);

    function handleScroll() {
        isScrolled.value = window.scrollY > threshold;
    }

    onMounted(() => {
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
    });

    onBeforeUnmount(() => {
        window.removeEventListener('scroll', handleScroll);
    });

    return {
        isScrolled,
    };
}
