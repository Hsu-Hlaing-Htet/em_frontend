<template>
    <div v-html="articleHtml" />
</template>

<script>
import { computed, defineComponent } from 'vue';
import { renderDocumentArticle } from '@/helpers/documents/documentLayout';
import {
    getContractDocumentMeta,
    renderContractDocumentBody,
    renderContractDocumentLead,
} from '@/helpers/documents/renderContractDocument';
import {
    getRentContractDocumentMeta,
    renderRentContractDocumentBody,
    renderRentContractDocumentLead,
} from '@/helpers/documents/renderRentContractDocument';
import { DOCUMENT_LOGO_URL } from '@/helpers/documents/documentOutput';
import '@/assets/css/documents/document-styles.css';

const VARIANTS = {
    sale: {
        documentTitle: 'Property Sale Agreement',
        getMeta: getContractDocumentMeta,
        renderLead: renderContractDocumentLead,
        renderBody: renderContractDocumentBody,
    },
    rent: {
        documentTitle: 'Property Rent Agreement',
        getMeta: getRentContractDocumentMeta,
        renderLead: renderRentContractDocumentLead,
        renderBody: renderRentContractDocumentBody,
    },
};

export default defineComponent({
    name: 'ContractPdfSheet',
    props: {
        document: {
            type: Object,
            required: true,
        },
        variant: {
            type: String,
            default: 'sale',
            validator: (value) => ['sale', 'rent'].includes(value),
        },
        fieldSections: {
            type: Array,
            default: () => [],
        },
        showApprovalSection: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const articleHtml = computed(() => {
            const config = VARIANTS[props.variant] || VARIANTS.sale;

            return renderDocumentArticle({
                documentTitle: config.documentTitle,
                meta: config.getMeta(props.document),
                leadHtml: config.renderLead(),
                bodyHtml: config.renderBody(props.document),
                logoSrc: DOCUMENT_LOGO_URL,
            });
        });

        return {
            articleHtml,
        };
    },
});
</script>
