<template>
    <div class="min-h-full">
        <div class="mb-10 flex flex-wrap items-end justify-end gap-2">
            <router-link
                v-if="canEdit && editRoute"
                :to="editRoute"
            >
                <Button
                    icon="pi pi-pencil"
                    label="Edit Utility"
                    severity="secondary"
                />
            </router-link>
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
                    :columns="utilityReadingColumns"
                    :rows="utilityRows"
                    empty-message="No utility readings recorded."
                    :total-value="formatCurrency(state.total_amount)"
                />

                <p
                    v-if="utilitySummaryNote"
                    :class="billingDetailTableClasses.summary"
                >
                    {{ utilitySummaryNote }}
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
import { utilityReadingColumns } from '@/helpers/billing/billingDetailColumns';
import useShowUtility from './useShowUtility';

export default defineComponent({
    name: 'ShowUtility',
    components: {
        Button,
        Loading,
        BillingDetailCustomerSection,
        BillingDetailTable,
    },
    setup() {
        const utility = useShowUtility();
        const utilityRows = computed(() => (utility.state.items || []).map((item) => ({
            id: item.id,
            utility_type_name: item.utility_type_name,
            previous_reading: utility.formatUnitValue(item.previous_reading),
            current_reading: utility.formatUnitValue(item.current_reading),
            usage: utility.formatUnitValue(item.usage),
            unit_price: utility.formatUnitValue(item.unit_price),
            amount: utility.formatCurrency(item.amount),
        })));

        return {
            ...utility,
            utilityReadingColumns,
            utilityRows,
            billingDetailTableClasses,
        };
    },
});
</script>
