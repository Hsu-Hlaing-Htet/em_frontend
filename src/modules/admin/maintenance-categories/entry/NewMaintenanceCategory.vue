<template>
    <div class="admin-panel relative mx-auto max-w-6xl">
        <form
            class="grid grid-cols-1 gap-4 md:grid-cols-2"
            @submit.prevent="handleSubmit"
        >
            <div class="field">
                <label for="name" class="mb-2 block text-md">Name</label>
                <InputText
                    id="name"
                    v-model="state.name"
                    class="w-full"
                    placeholder="e.g. Plumbing"
                />
                <small v-if="errors.has('name')" class="p-error">
                    <div v-for="error in errors.get('name')" :key="error">{{ error }}</div>
                </small>
            </div>

            <div class="field">
                <label for="status" class="mb-2 block text-md">Status</label>
                <Dropdown
                    id="status"
                    v-model="state.status"
                    :options="statusOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Select status"
                    class="w-full"
                />
                <small v-if="errors.has('status')" class="p-error">
                    <div v-for="error in errors.get('status')" :key="error">{{ error }}</div>
                </small>
            </div>

            <div class="flex justify-end gap-2 md:col-span-2">
                <Button type="submit" label="Save" />
                <router-link :to="{ name: 'maintenanceCategoryList' }">
                    <Button type="button" label="Cancel" />
                </router-link>
            </div>
        </form>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Dropdown from '@/components/global/AppDropdown.vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import useNewMaintenanceCategory from './useNewMaintenanceCategory';

export default defineComponent({
    name: 'NewMaintenanceCategory',
    components: { Dropdown, InputText, Button, Loading },
    setup() {
        return useNewMaintenanceCategory();
    },
});
</script>
