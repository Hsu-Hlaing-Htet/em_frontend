<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true,
    },
    initialData: {
        type: Object,
        default: null,
    },
    owners: {
        type: Array,
        default: () => [],
    },
    saving: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:modelValue', 'submit']);

const emptyForm = () => ({
    property_code: '',
    property_name: '',
    property_type: 'apartment',
    purpose: 'sale',
    owner_user_id: null,
    building: '',
    floor: '',
    unit_number: '',
    township: '',
    address: '',
    bedrooms: null,
    bathrooms: null,
    area_sqft: null,
    status: 'available',
    sale_price: null,
    monthly_rent: null,
    maintenance_fee: 0,
    description: '',
    featured_image: '',
    gallery_images_input: '',
    is_featured: false,
    listed_at: new Date(),
});

const form = ref(emptyForm());

watch(
    () => props.modelValue,
    (open) => {
        if (!open) {
            return;
        }

        form.value = {
            ...emptyForm(),
            ...(props.initialData || {}),
            listed_at: props.initialData?.listed_at ? new Date(props.initialData.listed_at) : new Date(),
            gallery_images_input: (props.initialData?.gallery_images || []).join(', '),
        };
    }
);

const typeOptions = [
    { label: 'Apartment', value: 'apartment' },
    { label: 'Condo', value: 'condo' },
    { label: 'House', value: 'house' },
];

const purposeOptions = [
    { label: 'Sale', value: 'sale' },
    { label: 'Rent', value: 'rent' },
];

const statusOptions = [
    { label: 'Available', value: 'available' },
    { label: 'Reserved', value: 'reserved' },
    { label: 'Occupied', value: 'occupied' },
    { label: 'Sold', value: 'sold' },
];

const dialogTitle = computed(() => (props.initialData ? 'Edit Property' : 'Create Property'));

function close() {
    emit('update:modelValue', false);
}

function submit() {
    const payload = {
        ...form.value,
        listed_at: form.value.listed_at ? form.value.listed_at.toISOString().slice(0, 10) : null,
        gallery_images: String(form.value.gallery_images_input || '')
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
    };

    emit('submit', payload);
}
</script>

<template>
    <PvDialog
        :visible="modelValue"
        :header="dialogTitle"
        modal
        :style="{ width: 'min(980px, 94vw)' }"
        @update:visible="(value) => emit('update:modelValue', value)"
    >
        <div class="rr-layout-columns">
            <div class="rr-col-4">
                <label class="rr-muted">Property Code</label>
                <PvInputText v-model="form.property_code" style="width: 100%" />
            </div>
            <div class="rr-col-8">
                <label class="rr-muted">Property Name</label>
                <PvInputText v-model="form.property_name" style="width: 100%" />
            </div>

            <div class="rr-col-4">
                <label class="rr-muted">Property Type</label>
                <PvDropdown v-model="form.property_type" :options="typeOptions" option-label="label" option-value="value" style="width: 100%" />
            </div>
            <div class="rr-col-4">
                <label class="rr-muted">Purpose</label>
                <PvDropdown v-model="form.purpose" :options="purposeOptions" option-label="label" option-value="value" style="width: 100%" />
            </div>
            <div class="rr-col-4">
                <label class="rr-muted">Status</label>
                <PvDropdown v-model="form.status" :options="statusOptions" option-label="label" option-value="value" style="width: 100%" />
            </div>

            <div class="rr-col-6">
                <label class="rr-muted">Owner</label>
                <PvDropdown
                    v-model="form.owner_user_id"
                    :options="owners"
                    option-label="name"
                    option-value="id"
                    show-clear
                    placeholder="Select owner"
                    style="width: 100%"
                />
            </div>
            <div class="rr-col-6">
                <label class="rr-muted">Township</label>
                <PvInputText v-model="form.township" style="width: 100%" />
            </div>

            <div class="rr-col-12">
                <label class="rr-muted">Address</label>
                <PvInputText v-model="form.address" style="width: 100%" />
            </div>

            <div class="rr-col-3">
                <label class="rr-muted">Bedrooms</label>
                <PvInputNumber v-model="form.bedrooms" :min="0" style="width: 100%" />
            </div>
            <div class="rr-col-3">
                <label class="rr-muted">Bathrooms</label>
                <PvInputNumber v-model="form.bathrooms" :min="0" style="width: 100%" />
            </div>
            <div class="rr-col-3">
                <label class="rr-muted">Area (sqft)</label>
                <PvInputNumber v-model="form.area_sqft" :min="0" style="width: 100%" />
            </div>
            <div class="rr-col-3">
                <label class="rr-muted">Maintenance Fee</label>
                <PvInputNumber v-model="form.maintenance_fee" mode="currency" currency="USD" locale="en-US" style="width: 100%" />
            </div>

            <div class="rr-col-6">
                <label class="rr-muted">Sale Price</label>
                <PvInputNumber v-model="form.sale_price" mode="currency" currency="USD" locale="en-US" style="width: 100%" />
            </div>
            <div class="rr-col-6">
                <label class="rr-muted">Monthly Rent</label>
                <PvInputNumber v-model="form.monthly_rent" mode="currency" currency="USD" locale="en-US" style="width: 100%" />
            </div>

            <div class="rr-col-12">
                <label class="rr-muted">Featured Image URL</label>
                <PvInputText v-model="form.featured_image" style="width: 100%" />
            </div>
            <div class="rr-col-12">
                <label class="rr-muted">Gallery Image URLs (comma separated)</label>
                <PvInputText v-model="form.gallery_images_input" style="width: 100%" />
            </div>
            <div class="rr-col-12">
                <label class="rr-muted">Description</label>
                <PvTextarea v-model="form.description" rows="4" style="width: 100%" />
            </div>
        </div>

        <template #footer>
            <PvButton label="Cancel" outlined severity="secondary" @click="close" />
            <PvButton :loading="saving" label="Save Property" @click="submit" />
        </template>
    </PvDialog>
</template>
