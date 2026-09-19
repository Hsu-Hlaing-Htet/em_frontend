<template>
    <div class="relative">
        <div v-if="!isLoading" class="admin-panel relative mx-auto max-w-6xl">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div class="field">
                    <label class="mb-2 block text-md">Building</label>
                    <InputText
                        :model-value="buildingLabel"
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
                    <label for="contract_type" class="mb-2 block text-md">Contract Type</label>
                    <Dropdown
                        id="contract_type"
                        v-model="contractType"
                        :options="contractTypeOptions"
                        option-label="label"
                        option-value="value"
                        placeholder="Select Sale or Rent"
                        class="w-full"
                        :disabled="!Array.isArray(contractTypeOptions) || contractTypeOptions.length <= 1"
                    />
                </div>
            </div>

            <SaleDraftForm
                v-if="contractType === 'sale'"
                class="mt-4"
                :state="saleForm.state"
                :customer-options="saleCustomerOptions"
                :building-options="saleBuildingOptions"
                :room-options="saleRoomOptions"
                :payment-type-options="salePaymentTypeOptions"
                :duration-month-options="saleDurationMonthOptions"
                :errors="errors"
                :cancel-route="cancelRoute"
                :lock-property="true"
                :embedded="true"
                submit-label="Submit"
                @submit="handleSubmit"
            />

            <RentDraftForm
                v-else-if="contractType === 'rent'"
                class="mt-4"
                :state="rentForm.state"
                :customer-options="rentCustomerOptions"
                :building-options="rentBuildingOptions"
                :room-options="rentRoomOptions"
                :payment-type-options="rentPaymentTypeOptions"
                :duration-month-options="rentDurationMonthOptions"
                :errors="errors"
                :cancel-route="cancelRoute"
                :lock-property="true"
                :embedded="true"
                submit-label="Submit"
                @submit="handleSubmit"
            />
        </div>

        <Loading v-if="isLoading || isSaving" />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import InputText from 'primevue/inputtext';
import Dropdown from '@/components/global/AppDropdown.vue';
import Loading from '@/components/global/Loading.vue';
import SaleDraftForm from '@/modules/admin/sale-contracts/draft/SaleDraftForm.vue';
import RentDraftForm from '@/modules/admin/rent-contracts/draft/RentDraftForm.vue';
import useCreateRoomContract from './useCreateRoomContract';

export default defineComponent({
    name: 'CreateRoomContract',
    components: {
        InputText,
        Dropdown,
        Loading,
        SaleDraftForm,
        RentDraftForm,
    },
    setup() {
        return useCreateRoomContract();
    },
});
</script>
