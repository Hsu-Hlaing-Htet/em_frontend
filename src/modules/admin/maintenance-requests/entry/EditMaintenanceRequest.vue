<template>
    <div class="admin-panel relative mx-auto max-w-3xl">
        <form
            v-if="!isLoading && state.status === 'pending'"
            class="grid grid-cols-1 gap-4"
            @submit.prevent="handleSubmit"
        >
            <div class="field">
                <label for="room_id" class="mb-2 block text-md">Room</label>
                <Dropdown
                    id="room_id"
                    v-model="state.room_id"
                    :options="roomOptions"
                    option-label="label"
                    option-value="value"
                    filter
                    class="w-full"
                />
            </div>
            <div class="field">
                <label for="user_id" class="mb-2 block text-md">Resident</label>
                <Dropdown
                    id="user_id"
                    v-model="state.user_id"
                    :options="residentOptions"
                    option-label="label"
                    option-value="value"
                    filter
                    class="w-full"
                />
            </div>
            <div class="field">
                <label for="title" class="mb-2 block text-md">Title</label>
                <InputText id="title" v-model="state.title" class="w-full" />
            </div>
            <div class="field">
                <label for="category" class="mb-2 block text-md">Category</label>
                <Dropdown
                    id="category"
                    v-model="state.category"
                    :options="categoryOptions"
                    option-label="label"
                    option-value="value"
                    class="w-full"
                />
            </div>
            <div class="field">
                <label for="priority" class="mb-2 block text-md">Priority</label>
                <Dropdown
                    id="priority"
                    v-model="state.priority"
                    :options="priorityOptions"
                    option-label="label"
                    option-value="value"
                    class="w-full"
                />
            </div>
            <div class="field">
                <label for="description" class="mb-2 block text-md">Description</label>
                <Textarea id="description" v-model="state.description" rows="4" class="w-full" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="submit" label="Save" />
                <router-link :to="{ name: 'showMaintenanceRequest', params: { id: state.id } }">
                    <Button type="button" label="Cancel" />
                </router-link>
            </div>
        </form>

        <div v-else-if="!isLoading" class="p-4 text-center text-[var(--admin-text-muted)]">
            Only pending requests can be edited.
        </div>
    </div>

    <Loading v-if="isLoading || isSaving" />
</template>

<script>
import { defineComponent } from 'vue';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import useEditMaintenanceRequest from './useEditMaintenanceRequest';

export default defineComponent({
    name: 'EditMaintenanceRequest',
    components: { Dropdown, InputText, Textarea, Button, Loading },
    setup() {
        return useEditMaintenanceRequest();
    },
});
</script>
