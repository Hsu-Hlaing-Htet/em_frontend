<template>
    <div v-if="isApprovalView" class="min-h-full px-4 pb-8">
        <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
                <h1 class="m-0 text-xl font-semibold">{{ pageTitle }}</h1>
                <p class="mt-1 mb-0 text-sm text-[var(--admin-text-muted)]">{{ pageSubtitle }}</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <router-link
                    v-if="documentRoute"
                    :to="documentRoute"
                >
                    <Button label="View" icon="pi pi-eye" severity="secondary" />
                </router-link>
                <Button
                    v-if="canApprove()"
                    label="Approve"
                    icon="pi pi-check"
                    severity="success"
                    :loading="workflowLoading.approve"
                    :disabled="workflowLoading.approve || workflowLoading.reject"
                    @click="showApproveDialog = true"
                />
                <Button
                    v-if="canReject()"
                    label="Reject"
                    icon="pi pi-times"
                    severity="danger"
                    outlined
                    :loading="workflowLoading.reject"
                    :disabled="workflowLoading.approve || workflowLoading.reject"
                    @click="showRejectDialog = true"
                />
                <router-link :to="backRoute">
                    <Button label="Back" severity="secondary" />
                </router-link>
            </div>
        </div>

        <div v-if="!isLoading" class="mx-auto max-w-6xl">
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

        <ApproveRecordDialog
            v-model="showApproveDialog"
            entity="utility"
            :submitting="workflowLoading.approve"
            @confirm="runWorkflow('approve')"
        />
        <RejectContractDialog
            v-model="showRejectDialog"
            entity="utility"
            :submitting="workflowLoading.reject"
            :close-on-confirm="false"
            @confirm="runWorkflow('reject', { rejection_reason: $event })"
        />

        <Loading v-if="isLoading" />
    </div>

    <div v-else class="min-h-full">
        <div class="mb-10 flex flex-wrap items-end justify-end gap-2">
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
            <Button
                v-if="canSendUtility"
                icon="pi pi-envelope"
                label="Send"
                @click="sendEmail"
            />
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
import ApproveRecordDialog from '@/components/admin/ApproveRecordDialog.vue';
import RejectContractDialog from '@/components/admin/contracts/RejectContractDialog.vue';
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
        ApproveRecordDialog,
        RejectContractDialog,
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
