<template>
    <div class="admin-panel">
        <DataTable
            :value="notifications"
            data-key="id"
            :loading="isLoading"
            responsive-layout="scroll"
        >
            <template #empty>No notifications found.</template>
            <Column field="type" header="Type">
                <template #body="{ data }">
                    <span class="capitalize">{{ data.type }}</span>
                </template>
            </Column>
            <Column field="title" header="Title" />
            <Column field="message" header="Message" />
            <Column field="status" header="Status">
                <template #body="{ data }">
                    <StatusBadge :value="data.status" />
                </template>
            </Column>
            <Column field="created_at" header="Updated" />
            <Column header="Actions">
                <template #body="{ data }">
                    <Button label="Open" text @click="openNotification(data)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import StatusBadge from '@/components/global/StatusBadge.vue';
import useCustomerNotificationList from '@/composables/customer/useCustomerNotificationList';

export default defineComponent({
    name: 'CustomerNotificationList',
    components: { Button, StatusBadge },
    setup() {
        return useCustomerNotificationList();
    },
});
</script>
