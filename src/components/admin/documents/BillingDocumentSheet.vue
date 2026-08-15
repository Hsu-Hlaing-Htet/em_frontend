<template>
    <div v-html="articleHtml" />
</template>

<script>
import { computed, defineComponent } from 'vue';
import { renderDocumentArticle } from '@/helpers/documents/documentLayout';
import { DOCUMENT_LOGO_URL } from '@/helpers/documents/documentOutput';
import '@/assets/css/documents/document-font.css';
import '@/assets/css/documents/document-styles.css';

export default defineComponent({
    name: 'BillingDocumentSheet',
    props: {
        document: {
            type: Object,
            required: true,
        },
        documentTitle: {
            type: String,
            required: true,
        },
        referenceLabel: {
            type: String,
            required: true,
        },
        renderLead: {
            type: Function,
            required: true,
        },
        renderBody: {
            type: Function,
            required: true,
        },
        getMeta: {
            type: Function,
            required: true,
        },
    },
    setup(props) {
        const articleHtml = computed(() => renderDocumentArticle({
            documentTitle: props.documentTitle,
            meta: props.getMeta(props.document, props.referenceLabel),
            leadHtml: props.renderLead(),
            bodyHtml: props.renderBody(props.document),
            logoSrc: DOCUMENT_LOGO_URL,
        }));

        return {
            articleHtml,
        };
    },
});
</script>
