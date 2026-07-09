<template>
    <div class="admin-panel relative mx-auto max-w-4xl">
        <Steps :model="STEPS" :active-step="activeStep" class="mb-6" />

        <div v-show="activeStep === 0" class="grid grid-cols-1 gap-4">
            <div class="field">
                <label for="user_id" class="mb-2 block text-md">Customer (Resident)</label>
                <Dropdown
                    id="user_id"
                    v-model="state.user_id"
                    :options="residentOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Select resident"
                    filter
                    class="w-full"
                />
                <small v-if="errors.has('user_id')" class="p-error">
                    <div v-for="error in errors.get('user_id')" :key="error">{{ error }}</div>
                </small>
            </div>
        </div>

        <div v-show="activeStep === 1" class="grid grid-cols-1 gap-4">
            <div class="field">
                <label for="room_id" class="mb-2 block text-md">Room</label>
                <Dropdown
                    id="room_id"
                    v-model="state.room_id"
                    :options="roomOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Select room"
                    filter
                    class="w-full"
                />
                <small v-if="errors.has('room_id')" class="p-error">
                    <div v-for="error in errors.get('room_id')" :key="error">{{ error }}</div>
                </small>
            </div>
        </div>

        <div v-show="activeStep === 2" class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="field">
                <label for="type" class="mb-2 block text-md">Contract Type</label>
                <Dropdown
                    id="type"
                    v-model="state.type"
                    :options="typeOptions"
                    option-label="label"
                    option-value="value"
                    class="w-full"
                />
            </div>
            <div class="field">
                <label for="payment_plan_id" class="mb-2 block text-md">Payment Plan</label>
                <Dropdown
                    id="payment_plan_id"
                    v-model="state.payment_plan_id"
                    :options="paymentPlanOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Optional"
                    show-clear
                    class="w-full"
                    @change="onPlanChange"
                />
            </div>
            <div class="field">
                <label for="payment_type" class="mb-2 block text-md">Payment Type</label>
                <Dropdown
                    id="payment_type"
                    v-model="state.payment_type"
                    :options="paymentTypeOptions"
                    option-label="label"
                    option-value="value"
                    class="w-full"
                />
            </div>
            <div class="field">
                <label for="duration_months" class="mb-2 block text-md">Duration (months)</label>
                <InputNumber id="duration_months" v-model="state.duration_months" class="w-full" :min="1" />
            </div>
        </div>

        <div v-show="activeStep === 3" class="grid grid-cols-1 gap-4 md:grid-cols-2">
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
        </div>

        <div v-show="activeStep === 4" class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="p-2">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Customer</p>
                <p class="text-sm">{{ selectedResident?.label || '—' }}</p>
            </div>
            <div class="p-2">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Room</p>
                <p class="text-sm">{{ selectedRoom?.label || '—' }}</p>
            </div>
            <div class="p-2">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Type / Payment</p>
                <p class="text-sm">{{ state.type }} / {{ state.payment_type }}</p>
            </div>
            <div class="p-2">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Plan</p>
                <p class="text-sm">{{ selectedPlan?.label || '—' }}</p>
            </div>
            <div class="p-2">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Dates</p>
                <p class="text-sm">{{ state.start_date || '—' }} → {{ state.end_date || '—' }}</p>
            </div>
            <div class="p-2">
                <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Total</p>
                <p class="text-sm">{{ state.contract_total ?? '—' }}</p>
            </div>
        </div>

        <div class="mt-6 flex justify-between gap-2">
            <Button
                v-if="activeStep > 0"
                type="button"
                label="Back"
                severity="secondary"
                @click="prevStep"
            />
            <div class="ml-auto flex gap-2">
                <router-link :to="{ name: 'contractList' }">
                    <Button type="button" label="Cancel" severity="secondary" />
                </router-link>
                <Button
                    v-if="activeStep < STEPS.length - 1"
                    type="button"
                    label="Next"
                    :disabled="!canGoNext"
                    @click="nextStep"
                />
                <Button
                    v-else
                    type="button"
                    label="Create Contract"
                    @click="handleSubmit"
                />
            </div>
        </div>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Steps from 'primevue/steps';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import useNewContract from './useNewContract';

export default defineComponent({
    name: 'NewContract',
    components: { Steps, Dropdown, InputNumber, Calendar, Textarea, Button, Loading },
    setup() {
        return useNewContract();
    },
});
</script>
