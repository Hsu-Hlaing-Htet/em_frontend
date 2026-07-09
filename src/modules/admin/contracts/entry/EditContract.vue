<template>
    <div class="admin-panel relative mx-auto max-w-4xl">
        <form
            v-if="!isLoading && state.status === 'draft'"
            class="grid grid-cols-1 gap-4 md:grid-cols-2"
            @submit.prevent="handleSubmit"
        >
            <div class="field">
                <label for="user_id" class="mb-2 block text-md">Customer</label>
                <Dropdown
                    id="user_id"
                    v-model="state.user_id"
                    :options="residentOptions"
                    option-label="label"
                    option-value="value"
                    filter
                    class="w-full"
                />
            </div>
            <div class="field">
                <label for="room_id" class="mb-2 block text-md">Room</label>
                <Dropdown
                    id="room_id"
                    v-model="state.room_id"
                    :options="roomOptions"
                    option-label="label"
                    option-value="value"
                    filter
                    class="w-full"
                />
            </div>
            <div class="field">
                <label for="type" class="mb-2 block text-md">Type</label>
                <Dropdown id="type" v-model="state.type" :options="typeOptions" option-label="label" option-value="value" class="w-full" />
            </div>
            <div class="field">
                <label for="payment_plan_id" class="mb-2 block text-md">Payment Plan</label>
                <Dropdown
                    id="payment_plan_id"
                    v-model="state.payment_plan_id"
                    :options="paymentPlanOptions"
                    option-label="label"
                    option-value="value"
                    show-clear
                    class="w-full"
                />
            </div>
            <div class="field">
                <label for="payment_type" class="mb-2 block text-md">Payment Type</label>
                <Dropdown id="payment_type" v-model="state.payment_type" :options="paymentTypeOptions" option-label="label" option-value="value" class="w-full" />
            </div>
            <div class="field">
                <label for="duration_months" class="mb-2 block text-md">Duration (months)</label>
                <InputNumber id="duration_months" v-model="state.duration_months" class="w-full" :min="1" />
            </div>
            <div class="field">
                <label for="start_date" class="mb-2 block text-md">Start Date</label>
                <Calendar id="start_date" v-model="state.start_date" date-format="yy-mm-dd" class="w-full" />
            </div>
            <div class="field">
                <label for="end_date" class="mb-2 block text-md">End Date</label>
                <Calendar id="end_date" v-model="state.end_date" date-format="yy-mm-dd" class="w-full" />
            </div>
            <div class="field">
                <label for="billing_day" class="mb-2 block text-md">Billing Day</label>
                <InputNumber id="billing_day" v-model="state.billing_day" class="w-full" :min="1" :max="31" />
            </div>
            <div class="field">
                <label for="contract_total" class="mb-2 block text-md">Contract Total</label>
                <InputNumber id="contract_total" v-model="state.contract_total" class="w-full" mode="currency" currency="USD" />
            </div>
            <div class="field md:col-span-2">
                <label for="remark" class="mb-2 block text-md">Remark</label>
                <Textarea id="remark" v-model="state.remark" rows="3" class="w-full" />
            </div>
            <div class="flex justify-end gap-2 md:col-span-2">
                <Button type="submit" label="Save" />
                <router-link :to="{ name: 'showContract', params: { id: state.id } }">
                    <Button type="button" label="Cancel" />
                </router-link>
            </div>
        </form>

        <div v-else-if="!isLoading" class="p-4 text-center text-[var(--admin-text-muted)]">
            Only draft contracts can be edited.
            <router-link :to="{ name: 'showContract', params: { id: state.id } }" class="ml-2 text-[var(--admin-primary)]">
                View contract
            </router-link>
        </div>
    </div>

    <Loading v-if="isLoading || isSaving" />
</template>

<script>
import { defineComponent } from 'vue';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import useEditContract from './useEditContract';

export default defineComponent({
    name: 'EditContract',
    components: { Dropdown, InputNumber, Calendar, Textarea, Button, Loading },
    setup() {
        return useEditContract();
    },
});
</script>
