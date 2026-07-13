<template>
    <form class="draft-form" @submit.prevent="$emit('submit')">
        <div class="admin-panel draft-form__body mx-auto max-w-6xl">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="field">
                    <label class="mb-2 block text-md">Customer Name</label>
                    <Dropdown
                        v-model="state.customer_id"
                        :options="customerOptions"
                        option-label="label"
                        option-value="value"
                        placeholder="Select Customer"
                        class="w-full"
                    />
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">NRC</label>
                    <InputText v-model="state.customer_nrc" class="w-full" readonly />
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Phone</label>
                    <InputText v-model="state.customer_phone" class="w-full" readonly />
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Email</label>
                    <InputText v-model="state.customer_email" class="w-full" readonly />
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Building</label>
                    <Dropdown
                        v-model="state.building_id"
                        :options="buildingOptions"
                        option-label="label"
                        option-value="value"
                        placeholder="Select building"
                        class="w-full"
                    />
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Room</label>
                    <Dropdown
                        v-model="state.room_id"
                        :options="roomOptions"
                        option-label="label"
                        option-value="value"
                        placeholder="Select room"
                        class="w-full"
                        :disabled="!state.building_id"
                    />
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Room Price</label>
                    <InputNumber
                        v-model="state.room_price"
                        class="w-full"
                        mode="currency"
                        currency="MMK"
                        locale="en-MM"
                        readonly
                    />
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Payment Type</label>
                    <Dropdown
                        v-model="state.payment_type"
                        :options="paymentTypeOptions"
                        option-label="label"
                        option-value="value"
                        placeholder="Select payment type"
                        class="w-full"
                    />
                </div>

                <Transition name="draft-field">
                    <div v-if="isInstallment" class="field">
                        <label class="mb-2 block text-md">Duration Months</label>
                        <Dropdown
                            v-model="state.duration_months"
                            :options="durationMonthOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="Select duration"
                            class="w-full"
                        />
                    </div>
                </Transition>

                <div class="field">
                    <label class="mb-2 block text-md">Contract Total</label>
                    <InputNumber
                        v-model="state.contract_total"
                        class="w-full"
                        mode="currency"
                        currency="MMK"
                        locale="en-MM"
                        :min="0"
                    />
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Deposit</label>
                    <InputNumber
                        v-model="state.deposit"
                        class="w-full"
                        mode="currency"
                        currency="MMK"
                        locale="en-MM"
                        readonly
                    />
                </div>

                <Transition name="draft-field">
                    <div v-if="showCalculatedPayments" class="field">
                        <label class="mb-2 block text-md">Remaining Balance</label>
                        <InputNumber
                            :model-value="remainingBalance"
                            class="w-full"
                            mode="currency"
                            currency="MMK"
                            locale="en-MM"
                            readonly
                        />
                    </div>
                </Transition>

                <Transition name="draft-field">
                    <div v-if="showCalculatedPayments" class="field">
                        <label class="mb-2 block text-md">Estimated Monthly Payment</label>
                        <InputNumber
                            :model-value="estimatedMonthlyPayment"
                            class="w-full"
                            mode="currency"
                            currency="MMK"
                            locale="en-MM"
                            readonly
                        />
                    </div>
                </Transition>

                <div class="field">
                    <label class="mb-2 block text-md">Start Date</label>
                    <Calendar
                        v-model="state.start_date"
                        class="w-full"
                        date-format="yy-mm-dd"
                        show-icon
                    />
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Billing Day</label>
                    <Dropdown
                        v-model="state.billing_day"
                        :options="billingDayOptions"
                        option-label="label"
                        option-value="value"
                        placeholder="Select billing day"
                        class="w-full"
                    />
                </div>

                <div class="field md:col-span-2">
                    <label class="mb-2 block text-md">Remarks</label>
                    <Textarea
                        v-model="state.remarks"
                        rows="4"
                        class="w-full"
                        placeholder="Optional remarks..."
                    />
                </div>
            </div>
            <div class="flex justify-end gap-2">
                <router-link :to="cancelRoute" class="">
                    <Button
                        type="button"
                        label="Cancel"
                        severity="secondary"
                        class=""
                    />
                </router-link>
                <Button
                    type="submit"
                    label="Save"
                    class=""
                />
            </div>
        </div>



    </form>
</template>

<script>
import { computed, defineComponent } from 'vue';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import {
    estimateMonthlyPayment,
    remainingAfterDeposit,
} from '@/utils/contractDocument';

export default defineComponent({
    name: 'SaleDraftForm',
    components: {
        Dropdown,
        InputText,
        InputNumber,
        Calendar,
        Textarea,
        Button,
    },
    props: {
        state: {
            type: Object,
            required: true,
        },
        customerOptions: {
            type: Array,
            default: () => [],
        },
        buildingOptions: {
            type: Array,
            default: () => [],
        },
        roomOptions: {
            type: Array,
            default: () => [],
        },
        paymentTypeOptions: {
            type: Array,
            default: () => [],
        },
        durationMonthOptions: {
            type: Array,
            default: () => [],
        },
        billingDayOptions: {
            type: Array,
            default: () => [],
        },
        cancelRoute: {
            type: Object,
            required: true,
        },
    },
    emits: ['submit'],
    setup(props) {
        const isInstallment = computed(() => props.state.payment_type === 'installment');

        const showCalculatedPayments = computed(() => (
            isInstallment.value && Boolean(props.state.duration_months)
        ));

        const remainingBalance = computed(() => (
            remainingAfterDeposit(props.state.contract_total, props.state.deposit)
        ));

        const estimatedMonthlyPayment = computed(() => (
            estimateMonthlyPayment({
                paymentType: props.state.payment_type,
                contractTotal: props.state.contract_total,
                deposit: props.state.deposit,
                durationMonths: props.state.duration_months,
            })
        ));

        return {
            isInstallment,
            showCalculatedPayments,
            remainingBalance,
            estimatedMonthlyPayment,
        };
    },
});
</script>
