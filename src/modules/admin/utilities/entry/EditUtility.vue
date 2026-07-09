<template>
    <div class="flex flex-col gap-5">
        <div v-if="!isCreate" class="flex flex-wrap items-center justify-between gap-3 px-1">
            <WorkflowActionBar
                :can-submit="canSubmit()"
                :can-approve="canApprove()"
                :can-reject="canReject()"
                :submitting="workflowLoading.submit"
                :approving="workflowLoading.approve"
                :rejecting="workflowLoading.reject"
                @submit="runWorkflow('submit')"
                @approve="runWorkflow('approve')"
                @reject="runWorkflow('reject')"
            />
            <StatusBadge v-if="state.status" :value="state.status" />
        </div>

        <div class="admin-panel relative">
            <form class="grid grid-cols-1 gap-4 md:grid-cols-2" @submit.prevent="handleSubmit">
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
                </div>
                <div class="field">
                    <label for="billing_month" class="mb-2 block text-md">Billing Month</label>
                    <Calendar
                        id="billing_month"
                        v-model="state.billing_month"
                        view="month"
                        date-format="yy-mm-dd"
                        :disabled="!canEdit"
                        class="w-full"
                    />
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
                                    :min="0"
                                    @update:model-value="recalcItem(data)"
                                />
                            </template>
                        </Column>
                        <Column header="Usage" style="min-width: 90px">
                            <template #body="{ data }">{{ data.usage }}</template>
                        </Column>
                        <Column header="Unit Price" style="min-width: 110px">
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
                        <Column header="Amount" style="min-width: 100px">
                            <template #body="{ data }">{{ data.amount }}</template>
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

                    <p class="mt-3 text-right text-md font-medium">
                        Total: {{ totalAmount.toFixed(2) }}
                    </p>
                </div>

                <div v-if="canEdit" class="flex justify-end gap-2 md:col-span-2">
                    <Button type="submit" label="Save" />
                    <router-link :to="{ name: 'utilityList' }">
                        <Button type="button" label="Cancel" />
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
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import WorkflowActionBar from '@/components/admin/WorkflowActionBar.vue';
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
    },
    setup() {
        return useEditUtility();
    },
});
</script>
