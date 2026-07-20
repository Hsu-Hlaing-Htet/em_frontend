<template>
    <div v-if="!isLoading" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
            <template #title>Active Contracts</template>
            <template #content>
                <p class="text-3xl font-semibold">{{ summary.active_contracts }}</p>
            </template>
        </Card>
        <Card>
            <template #title>Unpaid Invoices</template>
            <template #content>
                <p class="text-3xl font-semibold">{{ summary.unpaid_invoices }}</p>
            </template>
        </Card>
        <Card>
            <template #title>Paid Invoices</template>
            <template #content>
                <p class="text-3xl font-semibold">{{ summary.paid_invoices }}</p>
            </template>
        </Card>
        <Card class="md:col-span-2 xl:col-span-4">
            <template #title>Recent Payments</template>
            <template #content>
                <DataTable
                    :value="recentPayments"
                    data-key="id"
                    responsive-layout="scroll"
                >
                    <Column field="payment_date" header="Date" />
                    <Column field="invoice_number" header="Invoice" />
                    <Column field="amount" header="Amount" />
                    <Column field="payment_method_name" header="Method" />
                    <Column field="status" header="Status">
                        <template #body="{ data }">
                            <StatusBadge :value="data.status" />
                        </template>
                    </Column>
                </DataTable>
            </template>
        </Card>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Card from 'primevue/card';
import StatusBadge from '@/components/global/StatusBadge.vue';
import Loading from '@/components/global/Loading.vue';
import useCustomerDashboard from '@/composables/customer/useCustomerDashboard';

export default defineComponent({
    name: 'CustomerDashboard',
    components: { Card, StatusBadge, Loading },
    setup() {
        return useCustomerDashboard();
    },
});
</script>
