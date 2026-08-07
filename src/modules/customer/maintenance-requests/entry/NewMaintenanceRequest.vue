<template>
    <div>
        <div class="mb-4 flex flex-wrap gap-2">
            <router-link :to="{ name: 'customerMaintenanceRequestList' }" class="flex-1">
                <Button label="Back" severity="secondary" class="customer-btn-block" />
            </router-link>
        </div>

        <div class="admin-panel relative mx-auto max-w-3xl p-5">
            <h1 class="customer-page-heading">New Maintenance Request</h1>
            <p class="customer-page-lead mb-6">
                Choose a room from your active contract and describe the issue.
            </p>

            <form class="grid grid-cols-1 gap-4" @submit.prevent="handleSubmit">
                <div>
                    <label for="room_id" class="mb-2 block text-sm font-semibold">Room</label>
                    <Dropdown
                        id="room_id"
                        v-model="state.room_id"
                        :options="roomOptions"
                        option-label="label"
                        option-value="value"
                        placeholder="Select room"
                        class="w-full"
                        :disabled="!roomOptions.length"
                    />
                    <small v-if="!roomOptions.length && !isLoading" class="text-[var(--admin-text-muted)]">
                        No rooms are available from an active approved contract.
                    </small>
                    <small v-if="errors.has('room_id')" class="p-error">
                        <div v-for="error in errors.get('room_id')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div>
                    <label for="title" class="mb-2 block text-sm font-semibold">Title</label>
                    <InputText id="title" v-model="state.title" class="w-full" />
                    <small v-if="errors.has('title')" class="p-error">
                        <div v-for="error in errors.get('title')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div>
                    <label for="category" class="mb-2 block text-sm font-semibold">Category</label>
                    <Dropdown
                        id="category"
                        v-model="state.category"
                        :options="categoryOptions"
                        option-label="label"
                        option-value="value"
                        placeholder="Select category"
                        class="w-full"
                    />
                    <small v-if="errors.has('category')" class="p-error">
                        <div v-for="error in errors.get('category')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div>
                    <label for="priority" class="mb-2 block text-sm font-semibold">Priority</label>
                    <Dropdown
                        id="priority"
                        v-model="state.priority"
                        :options="priorityOptions"
                        option-label="label"
                        option-value="value"
                        placeholder="Select priority"
                        class="w-full"
                    />
                    <small v-if="errors.has('priority')" class="p-error">
                        <div v-for="error in errors.get('priority')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div>
                    <label for="description" class="mb-2 block text-sm font-semibold">Description</label>
                    <Textarea id="description" v-model="state.description" rows="5" class="w-full" />
                    <small v-if="errors.has('description')" class="p-error">
                        <div v-for="error in errors.get('description')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <Button
                    type="submit"
                    label="Submit Request"
                    class="customer-btn-block"
                    :loading="isSaving"
                    :disabled="!roomOptions.length"
                />
            </form>
        </div>

        <Loading v-if="isLoading" />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Loading from '@/components/global/Loading.vue';
import useCustomerNewMaintenanceRequest from '@/composables/customer/useCustomerNewMaintenanceRequest';

export default defineComponent({
    name: 'CustomerNewMaintenanceRequest',
    components: { Button, Dropdown, InputText, Textarea, Loading },
    setup() {
        return useCustomerNewMaintenanceRequest();
    },
});
</script>
