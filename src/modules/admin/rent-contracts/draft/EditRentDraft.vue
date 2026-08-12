<template>
    <RentDraftForm
        v-if="!isLoading"
        :state="state"
        :customer-options="customerOptions"
        :building-options="buildingOptions"
        :room-options="roomOptions"
        :payment-type-options="paymentTypeOptions"
        :duration-month-options="durationMonthOptions"
        :billing-day-options="billingDayOptions"
        :errors="errors"
        :cancel-route="{ name: 'rentContractDraftList' }"
        @submit="handleSubmit"
    />
    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Loading from '@/components/global/Loading.vue';
import RentDraftForm from './RentDraftForm.vue';
import useEditRentDraft from './useEditRentDraft';

export default defineComponent({
    name: 'EditRentDraft',
    components: { RentDraftForm, Loading },
    setup() {
        return useEditRentDraft();
    },
});
</script>
