<template>
    <iframe
        v-if="html"
        ref="frameEl"
        class="invoice-doc-frame"
        title="Invoice document"
        :srcdoc="html"
        @load="resizeFrame"
    />
</template>

<script>
import { defineComponent, nextTick, onBeforeUnmount, ref, watch } from 'vue';

export default defineComponent({
    name: 'InvoiceDocumentSheet',
    props: {
        html: {
            type: String,
            default: '',
        },
    },
    setup(props) {
        const frameEl = ref(null);

        const resizeFrame = async () => {
            await nextTick();
            const frame = frameEl.value;
            if (!frame) {
                return;
            }

            try {
                const doc = frame.contentDocument;
                const height = Math.max(
                    doc?.body?.scrollHeight || 0,
                    doc?.documentElement?.scrollHeight || 0,
                    Math.round(297 * 3.78),
                );
                frame.style.height = `${height + 8}px`;
            } catch {
                frame.style.height = '1123px';
            }
        };

        watch(() => props.html, () => {
            nextTick(resizeFrame);
        });

        onBeforeUnmount(() => {
            if (frameEl.value) {
                frameEl.value.srcdoc = '';
            }
        });

        return {
            frameEl,
            resizeFrame,
        };
    },
});
</script>

<style scoped>
.invoice-doc-frame {
    display: block;
    width: min(100%, 210mm);
    min-height: 297mm;
    margin: 0 auto;
    border: 0;
    background: transparent;
}
</style>
