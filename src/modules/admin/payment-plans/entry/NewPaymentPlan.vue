<template>
    <div class="admin-panel relative mx-auto max-w-6xl">
        <form
            class="grid grid-cols-1 gap-4 md:grid-cols-2"
            @submit.prevent="handleSubmit"
        >
            <div class="field">
                <label for="name" class="mb-2 block text-md">Name</label>
                <InputText
                    id="name"
                    v-model="state.name"
                    class="w-full"
                    placeholder="e.g. 12-Month Installment"
                />
                <small v-if="errors.has('name')" class="p-error">
                    <div v-for="error in errors.get('name')" :key="error">{{ error }}</div>
                </small>
            </div>

            <div class="field">
                <label for="payment_type" class="mb-2 block text-md">Payment Type</label>
                <Dropdown
                    id="payment_type"
                    v-model="state.payment_type"
                    :options="paymentTypeOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Select payment type"
                    class="w-full"
                />
                <small v-if="errors.has('payment_type')" class="p-error">
                    <div v-for="error in errors.get('payment_type')" :key="error">{{ error }}</div>
                </small>
            </div>

            <div class="field">
                <label for="duration_months" class="mb-2 block text-md">Duration (Months)</label>
                <InputNumber
                    id="duration_months"
                    v-model="state.duration_months"
                    class="w-full"
                    :min="1"
                />
                <small v-if="errors.has('duration_months')" class="p-error">
                    <div v-for="error in errors.get('duration_months')" :key="error">{{ error }}</div>
                </small>
            </div>

            <div class="field">
                <label for="interest_percentage" class="mb-2 block text-md">Interest (%)</label>
                <InputNumber
                    id="interest_percentage"
                    v-model="state.interest_percentage"
                    class="w-full"
                    :min="0"
                    :min-fraction-digits="2"
                />
                <small v-if="errors.has('interest_percentage')" class="p-error">
                    <div v-for="error in errors.get('interest_percentage')" :key="error">{{ error }}</div>
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
                <router-link :to="{ name: 'paymentPlanList' }">
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
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import useNewPaymentPlan from './useNewPaymentPlan';

export default defineComponent({
    name: 'NewPaymentPlan',
    components: { Dropdown, InputText, InputNumber, Button, Loading },
    setup() {
        return useNewPaymentPlan();
    },
});
</script>
