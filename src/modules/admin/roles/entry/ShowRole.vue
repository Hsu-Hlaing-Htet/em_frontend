<template>
        <div class="admin-crud-header">
            <div class="flex gap-2">
                <router-link :to="{ name: 'roleList' }">
                    <Button label="Back" />
                </router-link>
                <router-link v-if="state.id" :to="{ name: 'editRole', params: { id: state.id } }">
                    <Button type="button" icon="pi pi-pencil" text severity="info" />
                </router-link>
            </div>
        </div>

        <div v-if="!isLoading" class="admin-panel grid max-w-xl gap-4">
            <div class="field">
                <label class="mb-2 block text-sm font-semibold text-[var(--admin-text-muted)]">Role Name</label>
                <InputText :model-value="state.name" class="w-full" disabled />
            </div>
            <div class="field">
                <label class="mb-2 block text-sm font-semibold text-[var(--admin-text-muted)]">Created At</label>
                <InputText :model-value="state.created_at" class="w-full" disabled />
            </div>
            <div class="field">
                <label class="mb-2 block text-sm font-semibold text-[var(--admin-text-muted)]">Updated At</label>
                <InputText :model-value="state.updated_at" class="w-full" disabled />
            </div>
        </div>

        <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import useShowRole from './useShowRole';

export default defineComponent({
    name: 'ShowRole',
    components: { InputText, Button, Loading },
    setup() {
        return useShowRole();
    },
});
</script>
