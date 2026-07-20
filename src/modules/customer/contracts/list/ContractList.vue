<template>
    <div class="admin-panel">
        <DataTable
            :value="contracts"
            data-key="id"
            :loading="isLoading"
            :lazy="true"
            :paginator="true"
            :rows="rows"
            :first="first"
            :total-records="totalRecords"
            @page="onPage"
        >
            <template #empty>No contracts found.</template>
            <Column field="contract_number" header="Contract #" />
            <Column field="type" header="Type">
                <template #body="{ data }">
                    <span class="capitalize">{{ data.type }}</span>
                </template>
            </Column>
            <Column field="building_name" header="Building" />
            <Column field="room_number" header="Room" />
            <Column field="status" header="Status">
                <template #body="{ data }">
                    <StatusBadge :value="data.status" />
                </template>
            </Column>
            <Column header="Actions">
                <template #body="{ data }">
                    <Button label="View" text @click="openContract(data.id)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import StatusBadge from '@/components/global/StatusBadge.vue';
import useCustomerContractList from '@/composables/customer/useCustomerContractList';

export default defineComponent({
    name: 'CustomerContractList',
    components: { Button, StatusBadge },
    setup() {
        return useCustomerContractList();
    },
});
</script>
