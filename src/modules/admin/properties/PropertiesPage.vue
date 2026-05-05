<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { createAdminProperty, deleteAdminProperty, getAdminOwners, getAdminProperties, updateAdminProperty } from '@/modules/admin/properties/propertiesService';
import StatusBadge from '@/public/components/StatusBadge.vue';
import PropertyFormDialog from '@/modules/admin/components/PropertyFormDialog.vue';

const toast = useToast();
const loading = ref(false);
const saving = ref(false);
const properties = ref([]);
const total = ref(0);
const page = ref(1);
const showDialog = ref(false);
const selected = ref(null);
const owners = ref([]);

const filters = reactive({
    q: '',
    purpose: null,
    property_type: null,
    status: null,
});

const purposeOptions = [
    { label: 'All', value: null },
    { label: 'Sale', value: 'sale' },
    { label: 'Rent', value: 'rent' },
];

const typeOptions = [
    { label: 'All', value: null },
    { label: 'Apartment', value: 'apartment' },
    { label: 'Condo', value: 'condo' },
    { label: 'House', value: 'house' },
];

const statusOptions = [
    { label: 'All', value: null },
    { label: 'Available', value: 'available' },
    { label: 'Reserved', value: 'reserved' },
    { label: 'Occupied', value: 'occupied' },
    { label: 'Sold', value: 'sold' },
];

async function loadOwners() {
    const { data } = await getAdminOwners();
    owners.value = data.data;
}

async function load() {
    loading.value = true;

    try {
        const { data } = await getAdminProperties({
            page: page.value,
            ...filters,
        });

        properties.value = data.data;
        total.value = data.total;
    } finally {
        loading.value = false;
    }
}

function openCreate() {
    selected.value = null;
    showDialog.value = true;
}

function openEdit(property) {
    selected.value = { ...property };
    showDialog.value = true;
}

async function submit(payload) {
    saving.value = true;

    try {
        if (selected.value) {
            await updateAdminProperty(selected.value.id, payload);
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Property updated.', life: 2500 });
        } else {
            await createAdminProperty(payload);
            toast.add({ severity: 'success', summary: 'Created', detail: 'Property created.', life: 2500 });
        }

        showDialog.value = false;
        await load();
    } catch (error) {
        const message = error.response?.data?.message || 'Unable to save property.';
        toast.add({ severity: 'error', summary: 'Failed', detail: message, life: 3500 });
    } finally {
        saving.value = false;
    }
}

async function destroy(property) {
    if (!window.confirm(`Delete property ${property.property_code}?`)) {
        return;
    }

    await deleteAdminProperty(property.id);
    toast.add({ severity: 'success', summary: 'Deleted', detail: 'Property removed.', life: 2500 });
    await load();
}

function applyFilters() {
    page.value = 1;
    load();
}

function formatMoney(value) {
    if (!value) {
        return '-';
    }

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(Number(value));
}

onMounted(async () => {
    await Promise.all([loadOwners(), load()]);
});
</script>

<template>
    <div class="rr-card" style="padding: 1rem; margin-bottom: 1rem">
        <div class="rr-layout-columns" style="align-items: end">
            <div class="rr-col-3">
                <label class="rr-muted">Search</label>
                <PvInputText v-model="filters.q" placeholder="Code / name / township" style="width: 100%" />
            </div>
            <div class="rr-col-2">
                <label class="rr-muted">Purpose</label>
                <PvDropdown v-model="filters.purpose" :options="purposeOptions" option-label="label" option-value="value" style="width: 100%" />
            </div>
            <div class="rr-col-2">
                <label class="rr-muted">Type</label>
                <PvDropdown v-model="filters.property_type" :options="typeOptions" option-label="label" option-value="value" style="width: 100%" />
            </div>
            <div class="rr-col-2">
                <label class="rr-muted">Status</label>
                <PvDropdown v-model="filters.status" :options="statusOptions" option-label="label" option-value="value" style="width: 100%" />
            </div>
            <div class="rr-col-3" style="display: flex; gap: 0.5rem; justify-content: flex-end">
                <PvButton label="Filter" outlined severity="secondary" @click="applyFilters" />
                <PvButton label="Create Property" @click="openCreate" />
            </div>
        </div>
    </div>

    <div class="rr-card" style="padding: 0.4rem">
        <PvDataTable :value="properties" class="rr-table-clean" :loading="loading" responsive-layout="scroll">
            <PvColumn field="property_code" header="Code" />
            <PvColumn field="property_name" header="Property" />
            <PvColumn field="property_type" header="Type" />
            <PvColumn field="purpose" header="Purpose" />
            <PvColumn header="Price">
                <template #body="slotProps">
                    <span>
                        {{ slotProps.data.purpose === 'sale' ? formatMoney(slotProps.data.sale_price) : formatMoney(slotProps.data.monthly_rent) }}
                    </span>
                </template>
            </PvColumn>
            <PvColumn header="Status">
                <template #body="slotProps">
                    <StatusBadge :value="slotProps.data.status" />
                </template>
            </PvColumn>
            <PvColumn header="Actions" style="width: 180px">
                <template #body="slotProps">
                    <div style="display: flex; gap: 0.35rem">
                        <PvButton icon="pi pi-pencil" text @click="openEdit(slotProps.data)" />
                        <PvButton icon="pi pi-trash" text severity="danger" @click="destroy(slotProps.data)" />
                    </div>
                </template>
            </PvColumn>
        </PvDataTable>

        <div style="padding: 0.75rem; display: flex; justify-content: space-between; align-items: center">
            <small class="rr-muted">Total {{ total }} properties</small>
            <div style="display: flex; gap: 0.5rem">
                <PvButton :disabled="page <= 1" label="Prev" outlined severity="secondary" @click="page -= 1; load()" />
                <PvButton label="Next" outlined severity="secondary" @click="page += 1; load()" />
            </div>
        </div>
    </div>

    <PropertyFormDialog
        v-model="showDialog"
        :initial-data="selected"
        :owners="owners"
        :saving="saving"
        @submit="submit"
    />
</template>
