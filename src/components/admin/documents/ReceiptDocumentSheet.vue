<template>
    <div v-html="articleHtml" />
</template>

<script>
import { computed, defineComponent } from 'vue';
import { renderReceiptDocumentArticle } from '@/helpers/documents/renderReceiptDocument';
import { DOCUMENT_LOGO_URL } from '@/helpers/documents/documentOutput';
import '@/assets/css/documents/document-font.css';
import '@/assets/css/documents/receipt-document.css';

export default defineComponent({
    name: 'ReceiptDocumentSheet',
    props: {
        document: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const articleHtml = computed(() => renderReceiptDocumentArticle(
            props.document,
            DOCUMENT_LOGO_URL,
        ));

        return { articleHtml };
    },
});
</script>
