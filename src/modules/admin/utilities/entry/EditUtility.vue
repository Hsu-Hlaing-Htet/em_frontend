<template>
    <div class="flex min-w-0 flex-col gap-5">
        <div v-if="state.status" class="flex justify-end px-1">
            <StatusBadge :value="state.status" />
        </div>

        <div v-if="state.status === 'rejected'" role="alert" class="utility-rejection-alert flex items-start gap-3 rounded border p-4">
            <i class="pi pi-exclamation-circle mt-1 shrink-0" aria-hidden="true" />
            <div class="min-w-0">
                <strong class="block">Rejection reason</strong>
                <p class="m-0 mt-1 whitespace-pre-wrap break-words">{{ state.rejection_reason || 'No reason was recorded for this rejection.' }}</p>
            </div>
        </div>

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
                        searchable
                        class="w-full"
                    />
                    <small v-if="errors.has('room_id')" class="p-error">
                        <div v-for="error in errors.get('room_id')" :key="error">{{ error }}</div>
                    </small>
                </div>
                <small v-if="errors.has('contract_id')" class="p-error md:col-span-2">{{ errors.first('contract_id') }}</small>
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

                <div class="min-w-0 md:col-span-2">
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
                            <template #body="{ data, index }">
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
                                <small v-if="errors.has(`utility_items.${index}.utility_type_id`)" class="p-error mt-1 block">
                                    {{ errors.first(`utility_items.${index}.utility_type_id`) }}
                                </small>
                            </template>
                        </Column>
                        <Column header="Previous" style="min-width: 110px">
                            <template #body="{ data, index }">
                                <InputNumber
                                    v-model="data.previous_reading"
                                    :disabled="!canEdit"
                                    class="w-full"
                                    :min="0"
                                    @update:model-value="recalcItem(data)"
                                />
                                <small v-if="errors.has(`utility_items.${index}.previous_reading`)" class="p-error mt-1 block">
                                    {{ errors.first(`utility_items.${index}.previous_reading`) }}
                                </small>
                            </template>
                        </Column>
                        <Column header="Current" style="min-width: 110px">
                            <template #body="{ data, index }">
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
                                <small v-if="errors.has(`utility_items.${index}.current_reading`)" class="p-error mt-1 block">
                                    {{ errors.first(`utility_items.${index}.current_reading`) }}
                                </small>
                            </template>
                        </Column>
                        <Column header="Usage" style="min-width: 90px">
                            <template #body="{ data }">{{ data.usage }}</template>
                        </Column>
                        <Column header="Unit Price (MMK)" style="min-width: 110px">
                            <template #body="{ data, index }">
                                <InputNumber
                                    v-model="data.unit_price"
                                    :disabled="!canEdit"
                                    class="w-full"
                                    :min="0"
                                    @update:model-value="recalcItem(data)"
                                />
                                <small v-if="errors.has(`utility_items.${index}.unit_price`)" class="p-error mt-1 block">
                                    {{ errors.first(`utility_items.${index}.unit_price`) }}
                                </small>
                            </template>
                        </Column>
                        <Column header="Amount (MMK)" style="min-width: 100px">
                            <template #body="{ data }">{{ formatUtilityAmount(data.amount) }}</template>
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

                    <p class="mt-4 text-right text-md font-semibold tabular-nums">
                        Total: {{ formatUtilityAmount(totalAmount) }} MMK
                    </p>
                </div>

                <div v-if="canEdit" class="border-t border-[var(--admin-border)] pt-4 md:col-span-2">
                    <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
                        <router-link :to="backRoute" class="w-full sm:w-auto">
                            <Button type="button" label="Cancel" severity="secondary" text class="min-h-[44px] w-full" />
                        </router-link>
                        <Button type="submit" label="Save" icon="pi pi-save" class="min-h-[44px] w-full sm:w-auto"
                            :loading="isSaving" :disabled="!canSave" />
                    </div>
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
import { CURRENCY_LOCALE } from '@/utils/formatter';
import useEditUtility from './useEditUtility';

const amountFormatter = new Intl.NumberFormat(CURRENCY_LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
const formatUtilityAmount = (value) => amountFormatter.format(Number(value ?? 0));

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
    },
    setup() {
        return {
            ...useEditUtility(),
            formatUtilityAmount,
        };
    },
});
</script>

<style scoped>
.utility-rejection-alert {
    background: #fff1f2;
    border-color: #fda4af;
    color: #881337;
}

/* Keep the reason readable even when portal typography supplies a text color. */
.utility-rejection-alert :is(strong, p, i) {
    color: inherit;
}

:global([data-theme='dark'] .utility-rejection-alert) {
    background: #4c0519;
    border-color: #be123c;
    color: #fecdd3;
}
</style>
