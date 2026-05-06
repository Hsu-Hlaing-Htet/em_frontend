<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getAdminSectionRows } from '@/modules/admin/service';

const route = useRoute();
const loading = ref(false);
const rows = ref([]);

const section = computed(() => route.params.section || '');

const columnsMap = {
    owners: ['id', 'name', 'email', 'phone', 'owned_properties_count'],
    tenants: ['id', 'tenant_name', 'phone', 'nrc', 'contracts_count'],
    contracts: ['id', 'contract_code', 'contract_type', 'status'],
    invoices: ['id', 'invoice_number', 'customer_name', 'total_amount', 'status'],
    payments: ['id', 'amount', 'payment_method', 'payment_date'],
    'meter-readings': ['id', 'meter_type', 'usage', 'calculated_amount', 'reading_date'],
    reports: ['id', 'invoice_number', 'customer_name', 'status', 'due_date'],
};

const sectionTitle = computed(() => section.value.replace('-', ' ').toUpperCase());

async function load() {
    loading.value = true;

    try {
        const { data } = await getAdminSectionRows(section.value);
        rows.value = data.data || data;
    } finally {
        loading.value = false;
    }
}

watch(section, load);
onMounted(load);
</script>

<template>
    <div class="rr-card" style="padding: 1rem">
        <p class="rr-title" style="font-size: 0.75rem">{{ sectionTitle }}</p>
        <p class="rr-muted" style="margin-top: 0">Scaffolded module page with live API data for this section.</p>

        <PvDataTable :value="rows" class="rr-table-clean" :loading="loading" responsive-layout="scroll">
            <PvColumn v-for="column in columnsMap[section] || []" :key="column" :field="column" :header="column" />
        </PvDataTable>
    </div>
</template>
