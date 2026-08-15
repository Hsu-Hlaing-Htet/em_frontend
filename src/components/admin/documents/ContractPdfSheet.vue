<template>
    <div v-html="articleHtml" />
</template>

<script>
import { computed, defineComponent } from 'vue';
import {
    renderContractDocumentArticle,
    renderContractSaleFooter,
    renderContractRentFooter,
} from '@/helpers/documents/renderContractDocumentLayout';
import {
    renderContractDocumentBody,
    renderContractDocumentLead,
} from '@/helpers/documents/renderContractDocument';
import {
    renderRentContractDocumentBody,
    renderRentContractDocumentLead,
} from '@/helpers/documents/renderRentContractDocument';
import { DOCUMENT_LOGO_URL } from '@/helpers/documents/documentOutput';
import '@/assets/css/documents/document-font.css';
import '@/assets/css/documents/document-styles.css';

const VARIANTS = {
    sale: {
        documentTitle: 'Property Sale Agreement',
        renderLead: renderContractDocumentLead,
        renderBody: renderContractDocumentBody,
        renderFooter: renderContractSaleFooter,
    },
    rent: {
        documentTitle: 'Property Rent Agreement',
        renderLead: renderRentContractDocumentLead,
        renderBody: renderRentContractDocumentBody,
        renderFooter: renderContractRentFooter,
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
            const contractNo = props.document?.header?.contractNo || '';

            return renderContractDocumentArticle({
                documentTitle: config.documentTitle,
                contractNo,
                issueDate: props.document?.header?.issuedDate,
                leadHtml: config.renderLead(),
                bodyHtml: config.renderBody(props.document),
                logoSrc: DOCUMENT_LOGO_URL,
                footerHtml: config.renderFooter({ contractNo }),
            });
        });

        return {
            articleHtml,
        };
    },
});
</script>
