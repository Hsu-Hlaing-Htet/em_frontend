<template>
    <div
        ref="viewportEl"
        class="invoice-doc-sheet"
        :class="{ 'invoice-doc-sheet--scale': scaleToFit }"
        :style="viewportStyle"
    >
        <div
            ref="stageEl"
            class="invoice-doc-sheet__stage"
            :style="stageStyle"
        >
            <iframe
                v-if="html"
                ref="frameEl"
                class="invoice-doc-frame"
                :class="{ 'invoice-doc-frame--fixed': scaleToFit }"
                title="Invoice document"
                :srcdoc="html"
                @load="onFrameLoad"
            />
        </div>
    </div>
</template>

<script>
import {
    computed,
    defineComponent,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
} from 'vue';

/** A4 width in CSS mm — keep iframe viewport at this size so document media queries do not reflow. */
const A4_WIDTH_MM = 210;

export default defineComponent({
    name: 'InvoiceDocumentSheet',
    props: {
        html: {
            type: String,
            default: '',
        },
        /**
         * When true, keep the canonical A4 document width and scale the outer wrapper
         * to fit the available container. Used by Pay Invoice preview cards.
         */
        scaleToFit: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const frameEl = ref(null);
        const viewportEl = ref(null);
        const stageEl = ref(null);
        const scale = ref(1);
        const naturalHeightPx = ref(Math.round(297 * 3.78));
        let resizeObserver = null;

        const stageStyle = computed(() => {
            if (!props.scaleToFit) {
                return undefined;
            }

            return {
                width: `${A4_WIDTH_MM}mm`,
                transform: `scale(${scale.value})`,
                transformOrigin: 'top center',
            };
        });

        const viewportStyle = computed(() => {
            if (!props.scaleToFit) {
                return undefined;
            }

            return {
                height: `${Math.ceil(naturalHeightPx.value * scale.value)}px`,
            };
        });

        const measureNaturalWidth = () => {
            const stage = stageEl.value;
            if (!stage) {
                return 210 * 3.779527559;
            }

            return stage.offsetWidth || (210 * 3.779527559);
        };

        const updateScale = () => {
            if (!props.scaleToFit) {
                scale.value = 1;
                return;
            }

            const viewport = viewportEl.value;
            if (!viewport) {
                return;
            }

            const available = viewport.clientWidth;
            const natural = measureNaturalWidth();

            if (!available || !natural) {
                scale.value = 1;
                return;
            }

            scale.value = Math.min(1, available / natural);
        };

        /**
         * Canonical invoice HTML uses a beige page backdrop + 24px paper margin
         * for standalone browser views. Inside this embed (Admin/Customer preview),
         * that reads as a gray/beige strip above the white paper. Receipt avoids
         * it because it is inlined under .pdf-frame { margin: 0 }. Mirror that
         * for the iframe without changing PDF (@media print already zeros margin).
         */
        const applyEmbedPreviewStyles = (doc) => {
            if (!doc?.head || doc.getElementById('invoice-doc-embed-overrides')) {
                return;
            }

            const style = doc.createElement('style');
            style.id = 'invoice-doc-embed-overrides';
            style.textContent = `
                html,
                body.invoice-doc-body {
                    background: #ffffff !important;
                }

                .invoice-doc {
                    margin: 0 auto !important;
                }
            `;
            doc.head.appendChild(style);
        };

        const resizeFrame = async () => {
            await nextTick();
            const frame = frameEl.value;
            if (!frame) {
                return;
            }

            try {
                const doc = frame.contentDocument;
                applyEmbedPreviewStyles(doc);
                const height = Math.max(
                    doc?.body?.scrollHeight || 0,
                    doc?.documentElement?.scrollHeight || 0,
                    Math.round(297 * 3.78),
                );
                naturalHeightPx.value = height;
                frame.style.height = `${height}px`;
            } catch {
                naturalHeightPx.value = 1123;
                frame.style.height = '1123px';
            }

            updateScale();
        };

        const onFrameLoad = () => {
            resizeFrame();
        };

        const bindObserver = () => {
            if (!props.scaleToFit || typeof ResizeObserver === 'undefined') {
                return;
            }

            resizeObserver?.disconnect();
            resizeObserver = new ResizeObserver(() => {
                updateScale();
            });

            if (viewportEl.value) {
                resizeObserver.observe(viewportEl.value);
            }
        };

        watch(() => props.html, () => {
            nextTick(resizeFrame);
        });

        watch(() => props.scaleToFit, () => {
            nextTick(() => {
                bindObserver();
                resizeFrame();
            });
        });

        onMounted(() => {
            bindObserver();
            resizeFrame();
        });

        onBeforeUnmount(() => {
            resizeObserver?.disconnect();
            resizeObserver = null;

            if (frameEl.value) {
                frameEl.value.srcdoc = '';
            }
        });

        return {
            frameEl,
            viewportEl,
            stageEl,
            stageStyle,
            viewportStyle,
            onFrameLoad,
        };
    },
});
</script>

<style scoped>
.invoice-doc-sheet {
    width: 100%;
}

.invoice-doc-sheet--scale {
    overflow-x: auto;
    overflow-y: hidden;
}

.invoice-doc-sheet__stage {
    margin: 0 auto;
}

.invoice-doc-frame {
    display: block;
    width: min(100%, 210mm);
    min-height: 297mm;
    margin: 0 auto;
    border: 0;
    background: #ffffff;
}

/* Fixed A4 iframe viewport — prevents @media (max-width: 768px) document reflow. */
.invoice-doc-frame--fixed {
    width: 210mm;
    max-width: 210mm;
}
</style>
