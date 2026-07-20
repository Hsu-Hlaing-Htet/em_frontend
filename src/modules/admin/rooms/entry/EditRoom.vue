<template>

<div class="flex justify-end p-5">
            <Button
                type="button"
                icon="pi pi-trash"
                @click="showConfirmDialog(state.id)"
            />
        </div>


        <div class="admin-panel relative mx-auto max-w-6xl">
        <form
            class="grid grid-cols-1 gap-4 md:grid-cols-2"
            @submit.prevent="handleSubmit"
        >
                <div class="field">
                    <label class="mb-2 block text-md">Building</label>
                    <Dropdown v-model="state.building_id" :options="buildingOptions" option-label="label" option-value="value" placeholder="Select building" class="w-full" />
                    <small v-if="errors.has('building_id')" class="p-error">
                        <div v-for="error in errors.get('building_id')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Room Number</label>
                    <InputText v-model="state.room_number" class="w-full" />
                </div>
                <div class="field">
                    <label class="mb-2 block text-md">Floor Number</label>
                    <InputNumber v-model="state.floor_number" class="w-full" :min="0" />
                </div>
                <div class="field">
                    <label class="mb-2 block text-md">Area (sqft)</label>
                    <InputNumber v-model="state.area_sqft" class="w-full" :min="0" :min-fraction-digits="2" />
                </div>
                <div class="field">
                    <label class="mb-2 block text-md">Type</label>
                    <Dropdown v-model="state.type" :options="typeOptions" option-label="label" option-value="value" class="w-full" />
                </div>
                <div class="field">
                    <label class="mb-2 block text-md">Status</label>
                    <Dropdown v-model="state.status" :options="statusOptions" option-label="label" option-value="value" class="w-full" />
                </div>

                <div class="field md:col-span-2">
                    <label class="mb-2 block text-md">Description</label>
                    <Textarea v-model="state.description" class="w-full" rows="3" />
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Sale Price</label>
                    <InputNumber v-model="state.sale_price" class="w-full" :min="0" mode="currency" currency="USD" />
                </div>
                <div class="field">
                    <label class="mb-2 block text-md">Rent Price</label>
                    <InputNumber v-model="state.rent_price" class="w-full" :min="0" mode="currency" currency="USD" />
                </div>
                <div class="field">
                    <label class="mb-2 block text-md">Rent Deposit</label>
                    <InputNumber v-model="state.rent_deposit_price" class="w-full" :min="0" mode="currency" currency="USD" />
                </div>
                <div class="field">
                    <label class="mb-2 block text-md">Booking Deposit</label>
                    <InputNumber v-model="state.booking_deposit_price" class="w-full" :min="0" mode="currency" currency="USD" />
                </div>

                <RoomImageManager
                    :staged-images="stagedImages"
                    :persisted-images="persistedImages"
                    :room-id="state.id"
                    :add-staged-files="addStagedFiles"
                    :remove-staged="removeStaged"
                    :set-primary="setPrimary"
                    :replace-persisted-image="replacePersistedImage"
                    @delete-persisted="confirmDeleteImage"
                />

                <div class="flex gap-2">
                    <Button type="submit" label="Save" />
                    <router-link :to="{ name: 'roomList' }">
                        <Button type="button" label="Cancel" />
                    </router-link>
                </div>
            </form>
        </div>

        <Loading v-if="isLoading" />

</template>

<script>
import { defineComponent } from 'vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import RoomImageManager from './RoomImageManager.vue';
import useEditRoom from './useEditRoom';

export default defineComponent({
    name: 'EditRoom',
    components: { InputText, InputNumber, Textarea, Dropdown, Button, Loading, RoomImageManager },
    setup() {
        return useEditRoom();
    },
});
</script>
