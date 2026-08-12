<template>
    <div class="flex flex-col gap-5">
        <div class="admin-panel relative">
            <form @submit.prevent="handleSubmit">
                <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <!-- Building -->
                    <div class="field">
                        <label for="building_id" class="mb-2 block text-md">
                            Building
                        </label>

                        <Dropdown id="building_id" v-model="createState.building_id" :options="buildingOptions"
                            option-label="label" option-value="value" placeholder="Select building" filter
                            class="w-full" />
                        <small v-if="errors.has('building_id')" class="p-error">
                            <div v-for="error in errors.get('building_id')" :key="error">{{ error }}</div>
                        </small>
                    </div>

                    <!-- Room -->
                    <div class="field">
                        <label for="room_id" class="mb-2 block text-md">
                            Room
                        </label>

                        <Dropdown id="room_id" v-model="createState.room_id" :options="roomOptions" option-label="label"
                            option-value="value" placeholder="Select room" :disabled="!createState.building_id" filter
                            class="w-full" />
                        <small v-if="errors.has('room_id')" class="p-error">
                            <div v-for="error in errors.get('room_id')" :key="error">{{ error }}</div>
                        </small>
                    </div>

                    <!-- Billing Month -->
                    <div class="field">
                        <label for="create_billing_month" class="mb-2 block text-md">
                            Billing Month
                        </label>

                        <Calendar id="create_billing_month" v-model="createState.billing_month" view="month"
                            date-format="yy-mm-dd" :disabled="!createState.room_id" class="w-full" />
                        <small v-if="errors.has('billing_month')" class="p-error">
                            <div v-for="error in errors.get('billing_month')" :key="error">{{ error }}</div>
                        </small>
                    </div>
                </div>

                <!-- Add Button -->
                <div class="mt-4 flex justify-end">
                    <Button type="button" label="Add" icon="pi pi-plus" :disabled="!canAddRow" @click="addReadingRow" />
                </div>
                <div class="md:col-span-2">
                    <h3 class="mb-3 mt-0 text-md font-medium">Utility Readings</h3>

                    <DataTable :value="readingRows" data-key="id" responsive-layout="scroll">
                        <Column header="Utility Type" style="min-width: 160px">
                            <template #body="{ data }">
                                <Dropdown :model-value="data.utility_type_id" :options="utilityTypeOptions"
                                    option-label="label" option-value="value" placeholder="Select type" filter
                                    class="w-full" @update:model-value="handleUtilityTypeChange(data.id, $event)" />
                                <small v-if="data.rowError" class="p-error mt-1 block">{{ data.rowError }}</small>
                            </template>
                        </Column>
                        <Column header="Previous Unit" style="min-width: 120px">
                            <template #body="{ data }">
                                <span class="font-medium">{{ formatUnitValue(data.previous_reading) }}</span>
                            </template>
                        </Column>
                        <Column header="Current Unit" style="min-width: 130px">
                            <template #body="{ data }">
                                <InputNumber :model-value="data.current_reading" class="w-full"
                                    :min="data.previous_reading" :min-fraction-digits="0" :max-fraction-digits="2"
                                    :use-grouping="false" :disabled="!data.utility_type_id || data.isRowLoading"
                                    @update:model-value="handleCurrentReadingChange(data.id, $event)" />
                            </template>
                        </Column>
                        <Column header="Usage" style="min-width: 90px">
                            <template #body="{ data }">
                                <span>{{ formatUnitValue(data.usage) }}</span>
                            </template>
                        </Column>
                        <Column header="Unit Price" style="min-width: 110px">
                            <template #body="{ data }">
                                <span>{{ formatOptionalUnitValue(data.unit_price) }}</span>
                            </template>
                        </Column>
                        <Column header="Amount" style="min-width: 100px">
                            <template #body="{ data }">
                                <span>{{ formatCurrency(data.amount) }}</span>
                            </template>
                        </Column>
                        <Column header="" style="width: 60px">
                            <template #body="{ data }">
                                <Button icon="pi pi-trash" text severity="danger" type="button"
                                    @click="removeReadingRow(data.id)" />
                            </template>
                        </Column>
                    </DataTable>
                    <small v-if="errors.has('utility_type_id')" class="p-error mt-2 block">
                        <div v-for="error in errors.get('utility_type_id')" :key="error">{{ error }}</div>
                    </small>
                    <small v-if="errors.has('entries')" class="p-error mt-2 block">
                        <div v-for="error in errors.get('entries')" :key="error">{{ error }}</div>
                    </small>

                    <p class="mt-3 text-right text-md font-medium">
                        Total: {{ formatCurrency(totalAmount) }}
                    </p>
                </div>

                <div class="flex justify-end gap-2 md:col-span-2 mt-4">
                    <Button type="submit" label="Save" :disabled="!canCreate" />
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
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import useNewUtility from './useNewUtility';

export default defineComponent({
    name: 'NewUtility',
    components: {
        DataTable,
        Column,
        Dropdown,
        Calendar,
        InputNumber,
        Button,
        Loading,
    },
    setup() {
        return useNewUtility();
    },
});
</script>
