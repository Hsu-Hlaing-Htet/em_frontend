<template>
    <SaleDraftForm
        v-if="!isLoading"
        :state="state"
        :customer-options="customerOptions"
        :building-options="buildingOptions"
        :room-options="roomOptions"
        :payment-type-options="paymentTypeOptions"
        :duration-month-options="durationMonthOptions"
        :billing-day-options="billingDayOptions"
        :errors="errors"
        :cancel-route="{ name: 'saleContractDraftList' }"
        @submit="handleSubmit"
    />
    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Loading from '@/components/global/Loading.vue';
import SaleDraftForm from './SaleDraftForm.vue';
import useEditSaleDraft from './useEditSaleDraft';

export default defineComponent({
    name: 'EditSaleDraft',
    components: { SaleDraftForm, Loading },
    setup() {
        return useEditSaleDraft();
    },
});
</script>
