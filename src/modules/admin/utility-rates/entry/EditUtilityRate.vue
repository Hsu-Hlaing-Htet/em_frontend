<template>
    <div class="admin-panel relative mx-auto max-w-6xl">
        <form
            class="grid grid-cols-1 gap-4 md:grid-cols-2"
            @submit.prevent="handleSubmit"
        >
            <div class="field">
                <label for="utility_type_id" class="mb-2 block text-md">Utility Type</label>
                <Dropdown
                    id="utility_type_id"
                    v-model="state.utility_type_id"
                    :options="utilityTypeOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Select utility type"
                    class="w-full"
                />
                <small v-if="errors.has('utility_type_id')" class="p-error">
                    <div v-for="error in errors.get('utility_type_id')" :key="error">{{ error }}</div>
                </small>
            </div>

            <div class="field">
                <label for="unit_price" class="mb-2 block text-md">Unit Price</label>
                <InputNumber
                    id="unit_price"
                    v-model="state.unit_price"
                    class="w-full"
                    :min="0"
                    :min-fraction-digits="2"
                />
                <small v-if="errors.has('unit_price')" class="p-error">
                    <div v-for="error in errors.get('unit_price')" :key="error">{{ error }}</div>
                </small>
            </div>

            <div class="field">
                <label for="effective_date" class="mb-2 block text-md">Effective Date</label>
                <Calendar
                    id="effective_date"
                    v-model="state.effective_date"
                    placeholder="DD/MM/YYYY"
                    date-format="dd/mm/yy"
                    class="w-full"
                    show-icon
                />
                <small v-if="errors.has('effective_date')" class="p-error">
                    <div v-for="error in errors.get('effective_date')" :key="error">{{ error }}</div>
                </small>
            </div>

            <div class="field">
                <label for="status" class="mb-2 block text-md">Status</label>
                <Dropdown
                    id="status"
                    v-model="state.status"
                    :options="statusOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Select status"
                    class="w-full"
                />
                <small v-if="errors.has('status')" class="p-error">
                    <div v-for="error in errors.get('status')" :key="error">{{ error }}</div>
                </small>
            </div>

            <div class="flex justify-end gap-2 md:col-span-2">
                <Button type="submit" label="Save" />
                <router-link :to="{ name: 'utilityRateList' }">
                    <Button type="button" label="Cancel" />
                </router-link>
            </div>
        </form>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import useEditUtilityRate from './useEditUtilityRate';

export default defineComponent({
    name: 'EditUtilityRate',
    components: { Dropdown, InputNumber, Calendar, Button, Loading },
    setup() {
        return useEditUtilityRate();
    },
});
</script>
