<template>
    <div class="admin-panel relative mx-auto max-w-3xl">
        <form class="grid grid-cols-1 gap-4 md:grid-cols-2" @submit.prevent="handleSubmit">
            <div class="field md:col-span-2">
                <label for="invoice_id" class="mb-2 block text-md">Invoice</label>
                <Dropdown
                    id="invoice_id"
                    v-model="state.invoice_id"
                    :options="invoiceOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Select invoice"
                    filter
                    class="w-full"
                />
                <small v-if="errors.has('invoice_id')" class="p-error">
                    <div v-for="error in errors.get('invoice_id')" :key="error">{{ error }}</div>
                </small>
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
                />
                <small v-if="errors.has('payment_method_id')" class="p-error">
                    <div v-for="error in errors.get('payment_method_id')" :key="error">{{ error }}</div>
                </small>
            </div>
            <div class="field">
                <label for="amount" class="mb-2 block text-md">Amount</label>
                <InputNumber id="amount" v-model="state.amount" class="w-full" mode="currency" currency="MMK" :min="1" />
                <small v-if="errors.has('amount')" class="p-error">
                    <div v-for="error in errors.get('amount')" :key="error">{{ error }}</div>
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
                />
                <small v-if="errors.has('payment_date')" class="p-error">
                    <div v-for="error in errors.get('payment_date')" :key="error">{{ error }}</div>
                </small>
            </div>
            <div class="field md:col-span-2">
                <label for="note" class="mb-2 block text-md">Note</label>
                <Textarea id="note" v-model="state.note" rows="3" class="w-full" />
                <small v-if="errors.has('note')" class="p-error">
                    <div v-for="error in errors.get('note')" :key="error">{{ error }}</div>
                </small>
            </div>
            <div class="flex justify-end gap-2 md:col-span-2">
                <Button type="submit" label="Save" />
                <router-link :to="{ name: 'paymentList' }">
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
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import useNewPayment from './useNewPayment';

export default defineComponent({
    name: 'NewPayment',
    components: { Dropdown, InputNumber, Calendar, Textarea, Button, Loading },
    setup() {
        return useNewPayment();
    },
});
</script>
