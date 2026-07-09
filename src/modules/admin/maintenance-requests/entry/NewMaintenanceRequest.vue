<template>
    <div class="admin-panel relative mx-auto max-w-3xl">
        <form class="grid grid-cols-1 gap-4" @submit.prevent="handleSubmit">
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
                <label for="description" class="mb-2 block text-md">Description</label>
                <Textarea id="description" v-model="state.description" rows="4" class="w-full" />
            </div>
            <div class="flex justify-end gap-2">
                <Button type="submit" label="Save" />
                <router-link :to="{ name: 'maintenanceRequestList' }">
                    <Button type="button" label="Cancel" />
                </router-link>
            </div>
        </form>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import useNewMaintenanceRequest from './useNewMaintenanceRequest';

export default defineComponent({
    name: 'NewMaintenanceRequest',
    components: { Dropdown, InputText, Textarea, Button, Loading },
    setup() {
        return useNewMaintenanceRequest();
    },
});
</script>
