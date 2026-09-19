<template>
    <div class="admin-panel relative mx-auto max-w-3xl">
        <form class="grid grid-cols-1 gap-4 md:grid-cols-2" @submit.prevent="handleSubmit">
            <div class="field">
                <label class="mb-2 block text-md">Customer</label>
                <InputText
                    :model-value="invoiceContext.customer_name || '—'"
                    class="w-full"
                    readonly
                    disabled
                />
            </div>
            <div class="field">
                <label class="mb-2 block text-md">Room</label>
                <InputText
                    :model-value="roomLabel"
                    class="w-full"
                    readonly
                    disabled
                />
            </div>
            <div class="field">
                <label class="mb-2 block text-md">Amount Due (MMK)</label>
                <InputText
                    :model-value="formatCurrencyAmount(amountDue)"
                    class="w-full"
                    readonly
                    disabled
                />
            </div>
            <div class="field">
                <label for="amount_received" class="mb-2 block text-md">Received Amount (MMK)</label>
                <InputNumber
                    id="amount_received"
                    v-model="state.amount_received"
                    class="w-full"
                    input-class="w-full"
                    :min="0"
                    :step="1"
                    :min-fraction-digits="0"
                    :max-fraction-digits="0"
                    :use-grouping="true"
                    :disabled="!canRecord"
                />
                <small v-if="errors.has('amount_received')" class="p-error">
                    <div v-for="error in errors.get('amount_received')" :key="error">{{ error }}</div>
                </small>
            </div>
            <div class="field">
                <label class="mb-2 block text-md">Change (MMK)</label>
                <InputText
                    :model-value="formatCurrencyAmount(refundAmount)"
                    class="w-full"
                    readonly
                    disabled
                />
            </div>
            <div class="field">
                <label for="payment_method_id" class="mb-2 block text-md">Payment Method</label>
                <Dropdown
                    id="payment_method_id"
                    v-model="state.payment_method_id"
                    :options="paymentMethodOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Select method"
                    class="w-full"
                    :disabled="!canRecord"
                />
                <small v-if="errors.has('payment_method_id')" class="p-error">
                    <div v-for="error in errors.get('payment_method_id')" :key="error">{{ error }}</div>
                </small>
            </div>
            <div class="field">
                <label for="payment_date" class="mb-2 block text-md">Payment Date</label>
                <Calendar
                    id="payment_date"
                    v-model="state.payment_date"
                    placeholder="DD/MM/YYYY"
                    date-format="dd/mm/yy"
                    class="w-full"
                    show-icon
                    :disabled="!canRecord"
                />
                <small v-if="errors.has('payment_date')" class="p-error">
                    <div v-for="error in errors.get('payment_date')" :key="error">{{ error }}</div>
                </small>
            </div>
            <div class="field md:col-span-2">
                <label for="note" class="mb-2 block text-md">Note</label>
                <Textarea
                    id="note"
                    v-model="state.note"
                    rows="3"
                    class="w-full"
                    :disabled="!canRecord"
                />
                <small v-if="errors.has('note')" class="p-error">
                    <div v-for="error in errors.get('note')" :key="error">{{ error }}</div>
                </small>
            </div>
            <div class="flex justify-end gap-2 md:col-span-2">
                <Button
                    type="submit"
                    label="Pay"
                    :loading="isSaving"
                    :disabled="!canRecord || isSaving"
                />
                <router-link
                    :to="invoiceContext.id
                        ? { name: 'invoiceDocument', params: { id: invoiceContext.id } }
                        : { name: 'paymentList' }"
                >
                    <Button type="button" label="Cancel" severity="secondary" />
                </router-link>
            </div>
        </form>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Dropdown from '@/components/global/AppDropdown.vue';
import Calendar from 'primevue/calendar';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import useNewPayment from './useNewPayment';

export default defineComponent({
    name: 'NewPayment',
    components: { Dropdown, Calendar, Textarea, InputText, InputNumber, Button, Loading },
    setup() {
        return useNewPayment();
    },
});
</script>
