<template>
    <div v-if="!isLoading" class="min-h-screen">
        <header class="pdf-bar no-print">
            <div class="pdf-actions">
                <Button
                    v-if="isApprovalView && documentHtml"
                    icon="pi pi-eye"
                    label="View"
                    severity="secondary"
                    @click="viewPdf"
                />
                <DocumentDownloadActions
                    v-else-if="canDownloadInvoice"
                    :has-document-export="false"
                    @download-pdf="downloadPdf"
                    @print="printPdf"
                />
                <Button
                    v-if="canSendInvoice"
                    icon="pi pi-envelope"
                    label="Send"
                    :loading="isSendingEmail"
                    :disabled="isSendingEmail"
                    @click="openSendEmailDialog"
                />
                <Button
                    v-if="canRecordPayment"
                    icon="pi pi-wallet"
                    label="Pay"
                    @click="goRecordPayment"
                />
                <router-link :to="backRoute">
                    <Button label="Back" severity="secondary" />
                </router-link>
            </div>
        </header>

        <div class="pdf-canvas">
            <div class="pdf-frame">
                <InvoiceDocumentSheet :html="documentHtml" />
            </div>
        </div>

        <section
            v-if="canApproveInvoice"
            class="invoice-approval-panel no-print admin-panel"
            aria-label="Invoice approval"
        >
            <div class="invoice-approval-panel__grid">
                <div class="invoice-approval-panel__field invoice-approval-panel__field--late-fee">
                    <label
                        class="invoice-approval-panel__label"
                        for="invoice-late-fee-rule"
                    >
                        Late Fee Rule
                    </label>
                    <Dropdown
                        id="invoice-late-fee-rule"
                        :model-value="lateFeeSelection"
                        :options="lateFeeRuleOptions"
                        option-label="label"
                        option-value="value"
                        placeholder="Select Late Fee Rule"
                        class="invoice-approval-panel__dropdown w-full"
                        :disabled="isSavingLateFee || isApproving || isRejecting"
                        @update:model-value="onLateFeeSelectionChange"
                    />
                </div>

                <div class="invoice-approval-panel__field invoice-approval-panel__field--remark">
                    <label
                        class="invoice-approval-panel__label"
                        for="invoice-approval-remark"
                    >
                        Remark
                    </label>
                    <Textarea
                        id="invoice-approval-remark"
                        v-model="approvalRemark"
                        rows="2"
                        class="invoice-approval-panel__textarea w-full"
                        placeholder="Enter admin remark..."
                        :disabled="isApproving || isRejecting"
                        :invalid="Boolean(remarkError)"
                        aria-describedby="invoice-approval-remark-error"
                    />
                    <small
                        v-if="remarkError"
                        id="invoice-approval-remark-error"
                        class="p-error"
                    >
                        {{ remarkError }}
                    </small>
                </div>
            </div>

            <div class="invoice-approval-panel__actions">
                <Button
                    icon="pi pi-check"
                    label="Approve"
                    :loading="isApproving"
                    :disabled="isApproving || isRejecting || isSavingLateFee"
                    @click="requestApprove"
                />
                <Button
                    icon="pi pi-times"
                    label="Reject"
                    severity="danger"
                    :loading="isRejecting"
                    :disabled="isApproving || isRejecting"
                    @click="requestReject"
                />
            </div>
        </section>
    </div>

    <Loading v-if="isLoading" />

    <ApproveRecordDialog
        v-model="showApproveDialog"
        entity="invoice"
        :submitting="isApproving"
        @confirm="approveInvoice"
    />
    <SendDocumentEmailDialog
        v-model="showSendEmailDialog"
        document-kind="invoice"
        :document-number="state.invoice_number"
        :recipients="emailRecipients"
        :submitting="isSendingEmail"
        @confirm="confirmSendEmail"
    />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import Dropdown from '@/components/global/AppDropdown.vue';
import Loading from '@/components/global/Loading.vue';
import InvoiceDocumentSheet from '@/components/admin/documents/InvoiceDocumentSheet.vue';
import DocumentDownloadActions from '@/components/admin/DocumentDownloadActions.vue';
import ApproveRecordDialog from '@/components/admin/ApproveRecordDialog.vue';
import SendDocumentEmailDialog from '@/components/admin/SendDocumentEmailDialog.vue';
import useInvoiceDocumentPage from './useInvoiceDocumentPage';

export default defineComponent({
    name: 'InvoiceDocument',
    components: {
        Button,
        Textarea,
        Dropdown,
        Loading,
        InvoiceDocumentSheet,
        DocumentDownloadActions,
        ApproveRecordDialog,
        SendDocumentEmailDialog,
    },
    setup() {
        return useInvoiceDocumentPage();
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
<style scoped>
.invoice-approval-panel {
    width: min(100% - 2rem, 56rem);
    margin: 0 auto 1.25rem;
    padding: 0.75rem 0.95rem 0.85rem;
    box-shadow: var(--admin-shadow-soft, 0 1px 2px rgba(28, 25, 23, 0.04));
    font-family: var(--font-family, 'Inter var', Inter, sans-serif);
}

.invoice-approval-panel__grid {
    display: grid;
    grid-template-columns: minmax(0, 0.4fr) minmax(0, 0.6fr);
    gap: 0.6rem 1rem;
    align-items: start;
}

.invoice-approval-panel__field {
    min-width: 0;
}

.invoice-approval-panel__label {
    display: block;
    margin-bottom: 0.3rem;
    font-family: inherit;
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1.3;
    color: var(--admin-text, #1f2937);
}

.invoice-approval-panel__dropdown {
    width: 100%;
}

.invoice-approval-panel__dropdown :deep(.p-dropdown),
.invoice-approval-panel__dropdown :deep(.p-dropdown-label),
.invoice-approval-panel__dropdown :deep(.p-dropdown-label.p-placeholder) {
    font-family: var(--font-family, 'Inter var', Inter, sans-serif);
    font-weight: 400;
}

.invoice-approval-panel__dropdown :deep(.p-dropdown-label.p-placeholder) {
    color: var(--admin-text-muted, var(--rw-text-muted, #6b6560));
}

/* Compact 2-row Remark — same Admin input chrome, not a large comment box. */
.invoice-approval-panel__textarea,
.invoice-approval-panel__textarea.p-inputtextarea,
.invoice-approval-panel__textarea.p-inputtext {
    width: 100%;
    min-height: 3.4rem;
    max-height: 4.25rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--admin-border, var(--rw-border, #e4ddd4));
    border-radius: 6px;
    background: var(--admin-surface-solid, var(--rw-surface-solid, #fffcf8)) !important;
    color: var(--admin-text, var(--rw-text, #1c1917)) !important;
    font-family: var(--font-family, 'Inter var', Inter, sans-serif);
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.35;
    box-shadow: 0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05);
    resize: vertical;
    transition:
        background-color 0.2s,
        color 0.2s,
        border-color 0.2s,
        box-shadow 0.2s,
        outline-color 0.2s;
}

.invoice-approval-panel__textarea::placeholder {
    color: var(--admin-text-muted, var(--rw-text-muted, #6b6560));
    font-weight: 400;
    opacity: 0.85;
}

.invoice-approval-panel__textarea:enabled:focus,
.invoice-approval-panel__textarea.p-inputtext:enabled:focus {
    border-color: var(--admin-primary, var(--rw-primary, #8f2338)) !important;
    box-shadow:
        0 0 0 1px var(--rw-focus-ring, rgba(143, 35, 56, 0.22)),
        0 0 12px var(--rw-focus-ring, rgba(143, 35, 56, 0.22));
    outline: none !important;
}

.invoice-approval-panel__textarea:disabled {
    opacity: 0.72;
    cursor: not-allowed;
}

.invoice-approval-panel__actions {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.7rem;
}

.invoice-approval-panel__actions :deep(.p-button),
.invoice-approval-panel__actions :deep(.p-button .p-button-label) {
    font-family: var(--font-family, 'Inter var', Inter, sans-serif);
    font-weight: 500;
}

@media (max-width: 768px) {
    .invoice-approval-panel {
        width: calc(100% - 1.5rem);
        margin-bottom: 1.1rem;
        padding: 0.7rem 0.85rem 0.8rem;
    }

    .invoice-approval-panel__grid {
        grid-template-columns: 1fr;
        gap: 0.55rem;
    }

    .invoice-approval-panel__textarea,
    .invoice-approval-panel__textarea.p-inputtextarea,
    .invoice-approval-panel__textarea.p-inputtext {
        min-height: 3.25rem;
        max-height: 4rem;
    }

    .invoice-approval-panel__actions {
        justify-content: stretch;
    }

    .invoice-approval-panel__actions :deep(.p-button) {
        flex: 1 1 auto;
    }
}
</style>
