<template>
    <div class="min-h-full">
        <div class="mb-10 flex flex-wrap items-end justify-end gap-2">
            <Button
                v-if="canApprove()"
                label="Approve Invoice"
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
                    label="Edit Invoice"
                    severity="secondary"
                />
            </router-link>
            <Button
                icon="pi pi-download"
                label="Download Invoice"
                severity="secondary"
                @click="downloadPdf"
            />
            <Button
                icon="pi pi-envelope"
                label="Send Invoice"
                @click="sendEmail"
            />
            <router-link
                v-if="documentRoute"
                :to="documentRoute"
            >
                <Button
                    icon="pi pi-file"
                    label="View Document"
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
                    min-width="32rem"
                />

                <template v-if="!isApprovalView">
                    <BillingDetailTable
                        class="mt-8"
                        :columns="invoicePaymentHistoryColumns"
                        :rows="paymentRows"
                        empty-message="No payments recorded yet."
                        min-width="36rem"
                    >
                        <template #cell-id="{ row }">
                            <router-link
                                :to="{ name: 'showPayment', params: { id: row.id } }"
                                :class="billingDetailTableClasses.link"
                            >
                                #{{ row.id }}
                            </router-link>
                        </template>
                        <template #cell-status="{ value }">
                            <StatusBadge :value="value" />
                        </template>
                    </BillingDetailTable>
                </template>

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
import StatusBadge from '@/components/global/StatusBadge.vue';
import BillingDetailCustomerSection from '@/components/billing/BillingDetailCustomerSection.vue';
import BillingDetailTable from '@/components/billing/BillingDetailTable.vue';
import { billingDetailTableClasses } from '@/helpers/billing/billingDetailHelpers';
import {
    invoiceLineItemColumns,
    invoicePaymentHistoryColumns,
} from '@/helpers/billing/billingDetailColumns';
import useShowInvoice from './useShowInvoice';

export default defineComponent({
    name: 'ShowInvoice',
    components: {
        Button,
        Loading,
        StatusBadge,
        BillingDetailCustomerSection,
        BillingDetailTable,
    },
    setup() {
        const invoice = useShowInvoice();

        const lineItemRows = computed(() => (invoice.state.items || []).map((item) => ({
            id: item.id,
            description: item.description,
            charge_type_name: item.charge_type_name,
            amount: invoice.formatCurrency(item.amount),
        })));

        const paymentRows = computed(() => invoice.payments.map((payment) => ({
            id: payment.id,
            payment_date: payment.payment_date,
            amount: invoice.formatCurrency(payment.amount),
            payment_method_name: payment.payment_method_name,
            status: payment.display_status || payment.status,
        })));

        return {
            ...invoice,
            invoiceLineItemColumns,
            invoicePaymentHistoryColumns,
            lineItemRows,
            paymentRows,
            billingDetailTableClasses,
        };
    },
});
</script>
