<template>
    <div class="min-h-full">
        <div class="mb-10 flex flex-wrap items-end justify-end gap-2">
            <Button
                v-if="canApprove()"
                label="Approve"
                icon="pi pi-check"
                :loading="isApproving"
                @click="handleApprove"
            />
            <router-link
                v-if="canEdit && editRoute"
                :to="editRoute"
            >
                <Button
                    icon="pi pi-pencil"
                    label="Edit"
                    severity="secondary"
                />
            </router-link>
            <Button
                icon="pi pi-download"
                label="Download"
                severity="secondary"
                @click="downloadPdf"
            />
            <Button
                icon="pi pi-envelope"
                label="Send"
                @click="sendEmail"
            />
            <router-link
                v-if="documentRoute"
                :to="documentRoute"
            >
                <Button
                    icon="pi pi-file"
                    label="View"
                    severity="secondary"
                />
            </router-link>
            <router-link :to="backRoute">
                <Button label="Back" />
            </router-link>
        </div>

        <div v-if="!isLoading" class="mx-auto flex max-w-4xl flex-col px-4 pb-8">
            <section class="admin-panel p-5">
                <BillingDetailCustomerSection
                    :name="state.customer_name"
                    :lines="customerLines"
                    :date="formattedCreatedAt"
                />

                <BillingDetailTable
                    :columns="invoiceLineItemColumns"
                    :rows="lineItemRows"
                    empty-message="No line items recorded."
                    :total-value="totalDue"
                    min-width="44rem"
                />

                <p
                    v-if="invoiceSummaryNote"
                    :class="billingDetailTableClasses.summary"
                >
                    {{ invoiceSummaryNote }}
                </p>
            </section>
        </div>

        <Loading v-if="isLoading" />
    </div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import BillingDetailCustomerSection from '@/components/billing/BillingDetailCustomerSection.vue';
import BillingDetailTable from '@/components/billing/BillingDetailTable.vue';
import { billingDetailTableClasses } from '@/helpers/billing/billingDetailHelpers';
import { invoiceLineItemColumns } from '@/helpers/billing/billingDetailColumns';
import { mapInvoiceLineItemRow } from '@/helpers/invoices/invoiceDetailHelpers';
import useShowInvoice from './useShowInvoice';

export default defineComponent({
    name: 'ShowInvoice',
    components: {
        Button,
        Loading,
        BillingDetailCustomerSection,
        BillingDetailTable,
    },
    setup() {
        const invoice = useShowInvoice();

        const lineItemRows = computed(() => (invoice.state.items || []).map((item) => (
            mapInvoiceLineItemRow(item, invoice.formatCurrency)
        )));

        return {
            ...invoice,
            invoiceLineItemColumns,
            lineItemRows,
            billingDetailTableClasses,
        };
    },
});
</script>
