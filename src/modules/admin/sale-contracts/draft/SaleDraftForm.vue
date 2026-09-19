<template>
    <form class="draft-form" :class="{ 'draft-form--embedded': embedded }" @submit.prevent="$emit('submit')">
        <div :class="embedded ? 'draft-form__body' : 'admin-panel draft-form__body mx-auto max-w-6xl'">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div class="field">
                    <label class="mb-2 block text-md">Customer Name</label>
                    <Dropdown
                        v-model="state.customer_id"
                        :options="safeCustomerOptions"
                        option-label="label"
                        option-value="value"
                        placeholder="Select Customer"
                        filter
                        filter-placeholder="Search customer"
                        class="w-full"
                        empty-message="No customers found."
                    />
                    <small v-if="errors.has('user_id')" class="p-error">
                        <div v-for="error in errors.get('user_id')" :key="error">{{ error }}</div>
                    </small>
                </div>
                <div class="field">
                    <NrcInput v-model="state.customer_nrc" field-class="md:col-span-2" />
                </div>

                <div class="field">
                    <PhoneInput v-model="state.customer_phone" />
                </div>

                <div class="field">
                    <EmailInput v-model="state.customer_email" />
                </div>

                <template v-if="!lockProperty">
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
                        <small v-if="errors.has('building_id')" class="p-error">
                            <div v-for="error in errors.get('building_id')" :key="error">{{ error }}</div>
                        </small>
                    </div>

                    <div class="field">
                        <label class="mb-2 block text-md">Room</label>
                        <Dropdown
                            :key="`sale-room-${state.building_id || 'none'}`"
                            v-model="state.room_id"
                            :options="roomOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="Select room"
                            empty-message="No available rooms for this building."
                            class="w-full"
                            :disabled="!state.building_id"
                        />
                        <small v-if="errors.has('room_id')" class="p-error">
                            <div v-for="error in errors.get('room_id')" :key="error">{{ error }}</div>
                        </small>
                    </div>
                </template>

                <div class="field">
                    <label class="mb-2 block text-md">Room Price</label>
                    <InputNumber v-model="state.room_price" class="w-full" mode="currency" currency="MMK" locale="en-MM"
                        :min="0" />
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Payment Type</label>
                    <Dropdown v-model="state.payment_type" :options="paymentTypeOptions" option-label="label"
                        option-value="value" placeholder="Select payment type" class="w-full" />
                    <small v-if="errors.has('payment_type')" class="p-error">
                        <div v-for="error in errors.get('payment_type')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <Transition name="draft-field">
                    <div v-if="isInstallment" class="field">
                        <label class="mb-2 block text-md">Duration Months</label>
                        <Dropdown v-model="state.duration_months" :options="durationMonthOptions" option-label="label"
                            option-value="value" placeholder="Select duration" class="w-full" />
                        <small v-if="errors.has('duration_months')" class="p-error">
                            <div v-for="error in errors.get('duration_months')" :key="error">{{ error }}</div>
                        </small>
                    </div>
                </Transition>

                <div class="field">
                    <label class="mb-2 block text-md">Contract Total</label>
                    <InputNumber v-model="state.contract_total" class="w-full" mode="currency" currency="MMK"
                        locale="en-MM" :min="0" />
                    <small v-if="errors.has('contract_total')" class="p-error">
                        <div v-for="error in errors.get('contract_total')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Deposit</label>
                    <InputNumber v-model="state.deposit" class="w-full" mode="currency" currency="MMK" locale="en-MM"
                        :min="0" />
                </div>

                <Transition name="draft-field">
                    <div v-if="showCalculatedPayments" class="field">
                        <label class="mb-2 block text-md">Remaining Balance</label>
                        <InputNumber :model-value="remainingBalance" class="w-full" mode="currency" currency="MMK"
                            locale="en-MM" readonly />
                    </div>
                </Transition>

                <Transition name="draft-field">
                    <div v-if="showCalculatedPayments" class="field">
                        <label class="mb-2 block text-md">Estimated Monthly Payment</label>
                        <InputNumber :model-value="estimatedMonthlyPayment" class="w-full" mode="currency"
                            currency="MMK" locale="en-MM" readonly />
                    </div>
                </Transition>

                <div class="field">
                    <label class="mb-2 block text-md">Start Date</label>
                    <Calendar
                        v-model="state.start_date"
                        class="w-full"
                        placeholder="DD/MM/YYYY"
                        date-format="dd/mm/yy"
                        show-icon
                    />
                    <small v-if="errors.has('start_date')" class="p-error">
                        <div v-for="error in errors.get('start_date')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field md:col-span-2">
                    <label class="mb-2 block text-md">Remarks</label>
                    <Textarea v-model="state.remarks" rows="4" class="w-full" placeholder="Optional remarks..." />
                    <small v-if="errors.has('remark')" class="p-error">
                        <div v-for="error in errors.get('remark')" :key="error">{{ error }}</div>
                    </small>
                </div>
            </div>
            <div class="mt-4 flex justify-end gap-2">
                <router-link :to="cancelRoute">
                    <Button type="button" label="Cancel" severity="secondary" />
                </router-link>
                <Button type="submit" :label="submitLabel" />
            </div>
        </div>
    </form>
</template>

<script>
import { computed, defineComponent } from 'vue';
import Dropdown from '@/components/global/AppDropdown.vue';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import NrcInput from '@/components/admin/NrcInput.vue';
import PhoneInput from '@/components/admin/PhoneInput.vue';
import EmailInput from '@/components/admin/EmailInput.vue';
import {
    estimateMonthlyPayment,
    remainingAfterDeposit,
} from '@/helpers/contracts/contractDocument';

export default defineComponent({
    name: 'SaleDraftForm',
    components: {
        Dropdown,
        InputNumber,
        Calendar,
        Textarea,
        Button,
        NrcInput,
        PhoneInput,
        EmailInput,
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
        errors: {
            type: Object,
            default: () => ({
                has: () => false,
                get: () => [],
            }),
        },
        cancelRoute: {
            type: Object,
            required: true,
        },
        lockProperty: {
            type: Boolean,
            default: false,
        },
        embedded: {
            type: Boolean,
            default: false,
        },
        submitLabel: {
            type: String,
            default: 'Save',
        },
    },
    emits: ['submit'],
    setup(props) {
        const safeCustomerOptions = computed(() => (
            Array.isArray(props.customerOptions) ? props.customerOptions : []
        ));

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
            safeCustomerOptions,
            isInstallment,
            showCalculatedPayments,
            remainingBalance,
            estimatedMonthlyPayment,
        };
    },
});
</script>
