<template>
    <div v-html="articleHtml" />
</template>

<script>
import { computed, defineComponent } from 'vue';
import { renderInvoiceDocumentArticle } from '@/helpers/documents/renderInvoiceDocument';
import { DOCUMENT_LOGO_URL } from '@/helpers/documents/documentOutput';
import '@/assets/css/documents/document-font.css';
import '@/assets/css/documents/invoice-document.css';

export default defineComponent({
    name: 'InvoiceDocumentSheet',
    props: {
        document: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const articleHtml = computed(() => renderInvoiceDocumentArticle(
            props.document,
            DOCUMENT_LOGO_URL,
        ));

        return { articleHtml };
    },
});
</script>
