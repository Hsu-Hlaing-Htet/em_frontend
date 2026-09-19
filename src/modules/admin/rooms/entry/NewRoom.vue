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
                    <label class="mb-2 block text-md">Width (ft)</label>
                    <InputNumber v-model="state.width_ft" class="w-full" :min="0" :min-fraction-digits="2" />
                    <small v-if="errors.has('width_ft')" class="p-error">
                        <div v-for="error in errors.get('width_ft')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Length (ft)</label>
                    <InputNumber v-model="state.length_ft" class="w-full" :min="0" :min-fraction-digits="2" />
                    <small v-if="errors.has('length_ft')" class="p-error">
                        <div v-for="error in errors.get('length_ft')" :key="error">{{ error }}</div>
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
                    <label class="mb-2 block text-md">Sale Price (MMK)</label>
                    <InputNumber
                        v-model="state.sale_price"
                        class="w-full"
                        v-bind="currencyInputProps"
                    />
                    <small v-if="errors.has('sale_price')" class="p-error">
                        <div v-for="error in errors.get('sale_price')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Rent Price (MMK)</label>
                    <InputNumber
                        v-model="state.rent_price"
                        class="w-full"
                        v-bind="currencyInputProps"
                    />
                    <small v-if="errors.has('rent_price')" class="p-error">
                        <div v-for="error in errors.get('rent_price')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Rent Deposit (MMK)</label>
                    <InputNumber
                        v-model="state.rent_deposit_price"
                        class="w-full"
                        v-bind="currencyInputProps"
                    />
                    <small v-if="errors.has('rent_deposit_price')" class="p-error">
                        <div v-for="error in errors.get('rent_deposit_price')" :key="error">{{ error }}</div>
                    </small>
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
import Dropdown from '@/components/global/AppDropdown.vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import RoomImageManager from './RoomImageManager.vue';
import useNewRoom from './useNewRoom';
import { ROOM_CURRENCY_INPUT_PROPS } from '../roomForm';

export default defineComponent({
    name: 'NewRoom',
    components: { InputText, InputNumber, Textarea, Dropdown, Button, Loading, RoomImageManager },
    setup() {
        return {
            ...useNewRoom(),
            currencyInputProps: ROOM_CURRENCY_INPUT_PROPS,
        };
    },
});
</script>
