<template>
    <div class="flex flex-col gap-5">
        <div class="flex flex-wrap items-center justify-between gap-3 px-1">
            <WorkflowActionBar
                v-if="!isApprovalView"
                :can-submit="canSubmit() || canResubmit()"
                :submit-label="submitLabel"
                :submitting="workflowLoading.submit"
                @submit="runWorkflow('submit')"
            />
            <div class="ml-auto flex flex-wrap items-center gap-2">
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
                    v-if="isApprovalView && canApprove()"
                    type="button"
                    icon="pi pi-check"
                    label="Approve"
                    severity="success"
                    :loading="workflowLoading.approve"
                    :disabled="workflowLoading.approve || workflowLoading.reject"
                    @click="showApproveDialog = true"
                />
                <Button
                    v-if="isApprovalView && canReject()"
                    type="button"
                    icon="pi pi-times"
                    label="Reject"
                    severity="danger"
                    outlined
                    :loading="workflowLoading.reject"
                    :disabled="workflowLoading.approve || workflowLoading.reject"
                    @click="showRejectDialog = true"
                />
                <StatusBadge v-if="state.status && !isApprovalView" :value="state.status" />
                <router-link v-if="isApprovalView" :to="backRoute">
                    <Button type="button" label="Back" severity="secondary" />
                </router-link>
            </div>
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

        <div class="admin-panel relative">
            <form
                class="grid grid-cols-1 gap-4 md:grid-cols-2"
                @submit.prevent="handleSubmit"
            >
                <div class="field">
                    <label for="room_id" class="mb-2 block text-md">Room</label>
                    <Dropdown
                        id="room_id"
                        v-model="state.room_id"
                        :options="roomOptions"
                        option-label="label"
                        option-value="value"
                        :disabled="!canEdit"
                        filter
                        class="w-full"
                    />
                    <small v-if="errors.has('room_id')" class="p-error">
                        <div v-for="error in errors.get('room_id')" :key="error">{{ error }}</div>
                    </small>
                </div>
                <div class="field">
                    <label for="billing_month" class="mb-2 block text-md">Billing Month</label>
                    <Calendar
                        id="billing_month"
                        v-model="state.billing_month"
                        view="month"
                        placeholder="DD/MM/YYYY"
                        date-format="dd/mm/yy"
                        :disabled="!canEdit"
                        class="w-full"
                        show-icon
                    />
                    <small v-if="errors.has('billing_month')" class="p-error">
                        <div v-for="error in errors.get('billing_month')" :key="error">{{ error }}</div>
                    </small>
                </div>
                <div class="field">
                    <label for="reading_date" class="mb-2 block text-md">Reading Date</label>
                    <Calendar
                        id="reading_date"
                        v-model="state.reading_date"
                        placeholder="DD/MM/YYYY"
                        date-format="dd/mm/yy"
                        :disabled="!canEdit"
                        class="w-full"
                        show-icon
                    />
                    <small v-if="errors.has('reading_date')" class="p-error">
                        <div v-for="error in errors.get('reading_date')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="md:col-span-2">
                    <div class="mb-3 flex items-center justify-between">
                        <h3 class="m-0 text-md font-medium">Utility Items</h3>
                        <Button
                            v-if="canEdit"
                            type="button"
                            label="Add Line"
                            icon="pi pi-plus"
                            size="small"
                            @click="addItem"
                        />
                    </div>

                    <DataTable :value="items" data-key="id" responsive-layout="scroll">
                        <Column header="Type" style="min-width: 160px">
                            <template #body="{ data }">
                                <Dropdown
                                    v-model="data.utility_type_id"
                                    :options="utilityTypeOptions"
                                    option-label="label"
                                    option-value="value"
                                    :disabled="!canEdit"
                                    placeholder="Type"
                                    class="w-full"
                                />
                                <small v-if="data.rowError" class="p-error mt-1 block">{{ data.rowError }}</small>
                            </template>
                        </Column>
                        <Column header="Previous" style="min-width: 110px">
                            <template #body="{ data }">
                                <InputNumber
                                    v-model="data.previous_reading"
                                    :disabled="!canEdit"
                                    class="w-full"
                                    :min="0"
                                    @update:model-value="recalcItem(data)"
                                />
                            </template>
                        </Column>
                        <Column header="Current" style="min-width: 110px">
                            <template #body="{ data }">
                                <InputNumber
                                    v-model="data.current_reading"
                                    :disabled="!canEdit"
                                    class="w-full"
                                    :invalid="Boolean(data.currentReadingError)"
                                    @update:model-value="recalcItem(data)"
                                />
                                <small v-if="data.currentReadingError" class="p-error mt-1 block">
                                    {{ data.currentReadingError }}
                                </small>
                            </template>
                        </Column>
                        <Column header="Usage" style="min-width: 90px">
                            <template #body="{ data }">{{ data.usage }}</template>
                        </Column>
                        <Column header="Unit Price (MMK)" style="min-width: 110px">
                            <template #body="{ data }">
                                <InputNumber
                                    v-model="data.unit_price"
                                    :disabled="!canEdit"
                                    class="w-full"
                                    :min="0"
                                    @update:model-value="recalcItem(data)"
                                />
                            </template>
                        </Column>
                        <Column header="Amount (MMK)" style="min-width: 100px">
                            <template #body="{ data }">{{ formatCurrencyAmount(data.amount) }}</template>
                        </Column>
                        <Column v-if="canEdit" header="" style="width: 60px">
                            <template #body="{ index }">
                                <Button
                                    icon="pi pi-trash"
                                    text
                                    severity="danger"
                                    type="button"
                                    @click="removeItem(index)"
                                />
                            </template>
                        </Column>
                    </DataTable>
                    <small v-if="errors.has('utility_items')" class="p-error mt-2 block">
                        <div v-for="error in errors.get('utility_items')" :key="error">{{ error }}</div>
                    </small>
                    <small v-if="errors.has('utility_type_id')" class="p-error mt-2 block">
                        <div v-for="error in errors.get('utility_type_id')" :key="error">{{ error }}</div>
                    </small>
                    <small v-if="errors.has('unit_price')" class="p-error mt-2 block">
                        <div v-for="error in errors.get('unit_price')" :key="error">{{ error }}</div>
                    </small>

                    <p class="mt-3 text-right text-md font-medium">
                        Total: {{ totalAmount.toFixed(2) }}
                    </p>
                </div>

                <div v-if="canEdit" class="flex justify-end gap-2 md:col-span-2">
                    <Button type="submit" label="Save" :disabled="isSaving || !canSave" />
                    <router-link :to="backRoute">
                        <Button type="button" label="Cancel" severity="secondary" />
                    </router-link>
                </div>
            </form>

            <Loading v-if="isLoading || isSaving" />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from '@/components/global/AppDropdown.vue';
import Calendar from 'primevue/calendar';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import WorkflowActionBar from '@/components/admin/WorkflowActionBar.vue';
import ApproveRecordDialog from '@/components/admin/ApproveRecordDialog.vue';
import RejectContractDialog from '@/components/admin/contracts/RejectContractDialog.vue';
import { formatCurrencyAmount } from '@/utils/formatter';
import useEditUtility from './useEditUtility';

export default defineComponent({
    name: 'EditUtility',
    components: {
        DataTable,
        Column,
        Dropdown,
        Calendar,
        InputNumber,
        Button,
        Loading,
        StatusBadge,
        WorkflowActionBar,
        ApproveRecordDialog,
        RejectContractDialog,
    },
    setup() {
        return {
            ...useEditUtility(),
            formatCurrencyAmount,
        };
    },
});
</script>
