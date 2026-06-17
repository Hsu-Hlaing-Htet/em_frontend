<template>
    <div class="flex flex-col gap-5">
        <div class="admin-crud-header">
            <div>
                <h1>User Details</h1>
                <p>View user account information.</p>
            </div>
            <div class="flex gap-2">
                <router-link :to="{ name: 'userList' }">
                    <Button label="Back" class="p-button-outlined p-button-secondary" />
                </router-link>
                <router-link v-if="state.id" :to="{ name: 'editUser', params: { id: state.id } }">
                    <Button type="button" icon="pi pi-pencil" class="admin-crud-primary-btn p-button-outlined" />
                </router-link>
            </div>
        </div>

        <div v-if="!isLoading" class="admin-crud-panel grid max-w-xl gap-4">
            <div class="field">
                <label class="mb-2 block text-sm font-semibold text-[var(--admin-text-muted)]">Name</label>
                <InputText :model-value="state.name" class="w-full" disabled />
            </div>
            <div class="field">
                <label class="mb-2 block text-sm font-semibold text-[var(--admin-text-muted)]">Email</label>
                <InputText :model-value="state.email" class="w-full" disabled />
            </div>
            <div class="field">
                <label class="mb-2 block text-sm font-semibold text-[var(--admin-text-muted)]">Role</label>
                <InputText :model-value="state.role_name" class="w-full" disabled />
            </div>
            <div class="field">
                <label class="mb-2 block text-sm font-semibold text-[var(--admin-text-muted)]">Created At</label>
                <InputText :model-value="state.created_at" class="w-full" disabled />
            </div>
        </div>

        <Loading v-if="isLoading" />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import useShowUser from './useShowUser';

export default defineComponent({
    name: 'ShowUser',
    components: { InputText, Button, Loading },
    setup() {
        return useShowUser();
    },
});
</script>
