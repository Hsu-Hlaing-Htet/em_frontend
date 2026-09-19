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
        documentTitle: 'Rental/Lease Agreement',
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
        showApprovedDigitalCopyNote: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const articleHtml = computed(() => {
            const config = VARIANTS[props.variant] || VARIANTS.sale;
            const contractNo = props.document?.header?.contractNo || '';
            const approvedCopyNote = props.showApprovedDigitalCopyNote
                ? `
                    <div class="contract-doc-approved-copy-note">
                        <p class="contract-doc-approved-copy-title">Approved Digital Contract Copy</p>
                        <p>This is the approved digital copy of the contract. Signatures are completed manually on the printed copy.</p>
                    </div>
                `
                : '';

            return renderContractDocumentArticle({
                documentTitle: config.documentTitle,
                contractNo,
                issueDate: props.document?.header?.issuedDate,
                leadHtml: `${config.renderLead()}${approvedCopyNote}`,
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
