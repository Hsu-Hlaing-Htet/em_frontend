<template>
<div class="admin-panel">
    <div class="relative mx-auto max-w-4xl">
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
                    <small v-if="errors.has('room_number')" class="p-error">
                        <div v-for="error in errors.get('room_number')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Floor Number</label>
                    <InputNumber v-model="state.floor_number" class="w-full" :min="0" />
                    <small v-if="errors.has('floor_number')" class="p-error">
                        <div v-for="error in errors.get('floor_number')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Area (sqft)</label>
                    <InputNumber v-model="state.area_sqft" class="w-full" :min="0" :min-fraction-digits="2" />
                    <small v-if="errors.has('area_sqft')" class="p-error">
                        <div v-for="error in errors.get('area_sqft')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Type</label>
                    <Dropdown v-model="state.type" :options="typeOptions" option-label="label" option-value="value" class="w-full" />
                    <small v-if="errors.has('type')" class="p-error">
                        <div v-for="error in errors.get('type')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Status</label>
                    <Dropdown v-model="state.status" :options="statusOptions" option-label="label" option-value="value" class="w-full" />
                    <small v-if="errors.has('status')" class="p-error">
                        <div v-for="error in errors.get('status')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field md:col-span-2">
                    <label class="mb-2 block text-md">Description</label>
                    <Textarea v-model="state.description" class="w-full" rows="2" />
                    <small v-if="errors.has('description')" class="p-error">
                        <div v-for="error in errors.get('description')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field">
    <label class="mb-2 block text-md">
        Rent Price (MMK)
    </label>

    <InputNumber
        v-model="state.rent_price"
        class="w-full"
        :min="0"
        :useGrouping="true"
        placeholder="1,500,000"
    />
</div>
                <div class="field">
                    <label class="mb-2 block text-md">Rent Price</label>
                    <InputNumber v-model="state.rent_price" class="w-full" :min="0" mode="currency" currency="MMK" />
                </div>
                <div class="field">
                    <label class="mb-2 block text-md">Rent Deposit</label>
                    <InputNumber v-model="state.rent_deposit_price" class="w-full" :min="0" mode="currency" currency="MMK" />
                </div>
                <div class="field">
                    <label class="mb-2 block text-md">Booking Deposit</label>
                    <InputNumber v-model="state.booking_deposit_price" class="w-full" :min="0" mode="currency" currency="MMK" />
                </div>

                <RoomImageManager
                    :staged-images="stagedImages"
                    :persisted-images="persistedImages"
                    :add-staged-files="addStagedFiles"
                    :remove-staged="removeStaged"
                    :set-primary="setPrimary"
                    :replace-persisted-image="replacePersistedImage"
                />

                <div class="flex gap-2 md:col-span-2">
                    <Button type="submit" label="Save Room"  />
                    <router-link :to="{ name: 'roomList' }">
                        <Button type="button" label="Cancel" />
                    </router-link>
                </div>
            </form>

            <Loading v-if="isLoading" />
        </div>
    </div>
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
import useNewRoom from './useNewRoom';

export default defineComponent({
    name: 'NewRoom',
    components: { InputText, InputNumber, Textarea, Dropdown, Button, Loading, RoomImageManager },
    setup() {
        return useNewRoom();
    },
});
</script>
