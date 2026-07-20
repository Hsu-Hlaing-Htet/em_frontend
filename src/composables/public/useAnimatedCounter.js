import { onBeforeUnmount, ref, watch } from 'vue';

export function useAnimatedCounter(source, options = {}) {
    const {
        duration = 1400,
        decimals = 0,
        suffix = '',
    } = options;

    const displayValue = ref(0);
    const hasAnimated = ref(false);

    let frameId = null;
    let observer = null;

    function formatValue(value) {
        const rounded = decimals > 0
            ? Number(value).toFixed(decimals)
            : Math.round(value).toLocaleString();

        return `${rounded}${suffix}`;
    }

    function animateTo(target) {
        if (frameId) {
            cancelAnimationFrame(frameId);
        }

        const safeTarget = Number(target) || 0;
        const startValue = displayValue.value;
        const startTime = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - (1 - progress) ** 3;
            displayValue.value = startValue + (safeTarget - startValue) * eased;

            if (progress < 1) {
                frameId = requestAnimationFrame(tick);
                return;
            }

            displayValue.value = safeTarget;
        };

        frameId = requestAnimationFrame(tick);
    }

    function observeElement(element) {
        if (!element || hasAnimated.value) {
            return;
        }

        if (!('IntersectionObserver' in window)) {
            hasAnimated.value = true;
            animateTo(source.value ?? source);
            return;
        }

        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting || hasAnimated.value) {
                        return;
                    }

                    hasAnimated.value = true;
                    animateTo(source.value ?? source);
                    observer?.disconnect();
                });
            },
            { threshold: 0.35 },
        );

        observer.observe(element);
    }

    watch(
        () => source.value ?? source,
        (value) => {
            if (hasAnimated.value) {
                animateTo(value);
            }
        },
    );

    onBeforeUnmount(() => {
        if (frameId) {
            cancelAnimationFrame(frameId);
        }

        observer?.disconnect();
    });

    return {
        displayValue,
        formattedValue: () => formatValue(displayValue.value),
        observeElement,
    };
}
