<script setup>
import { onMounted, ref } from 'vue';
import { getOwnerProperties } from '@/modules/user/service';

const properties = ref([]);

onMounted(async () => {
    const { data } = await getOwnerProperties();
    properties.value = data;
});
</script>

<template>
    <div class="rr-card" style="padding: 0.5rem">
        <PvDataTable :value="properties" class="rr-table-clean" responsive-layout="scroll">
            <PvColumn field="property_code" header="Code" />
            <PvColumn field="property_name" header="Property" />
            <PvColumn field="property_type" header="Type" />
            <PvColumn field="purpose" header="Purpose" />
            <PvColumn field="township" header="Township" />
            <PvColumn field="status" header="Status" />
        </PvDataTable>
    </div>
</template>
