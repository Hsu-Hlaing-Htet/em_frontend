<template>
    <div class="flex flex-col gap-5">
        <div class="admin-crud-header">
            <div>
                <h1>Profile Details</h1>
                <p>View profile information.</p>
            </div>
            <div class="flex gap-2">
                <router-link :to="{ name: 'profileList' }">
                    <Button label="Back" class="p-button-outlined p-button-secondary" />
                </router-link>
                <router-link v-if="state.id" :to="{ name: 'editProfile', params: { id: state.id } }">
                    <Button type="button" icon="pi pi-pencil" class="admin-crud-primary-btn p-button-outlined" />
                </router-link>
            </div>
        </div>

        <div v-if="!isLoading" class="admin-crud-panel grid max-w-2xl gap-4 md:grid-cols-2">
            <div class="field md:col-span-2">
                <label class="mb-2 block text-sm font-semibold text-[var(--admin-text-muted)]">User</label>
                <InputText :model-value="`${state.user_name} (${state.user_email})`" class="w-full" disabled />
            </div>
            <div class="field">
                <label class="mb-2 block text-sm font-semibold text-[var(--admin-text-muted)]">Phone</label>
                <InputText :model-value="state.phone" class="w-full" disabled />
            </div>
            <div class="field">
                <label class="mb-2 block text-sm font-semibold text-[var(--admin-text-muted)]">NRC</label>
                <InputText :model-value="state.nrc" class="w-full" disabled />
            </div>
            <div class="field">
                <label class="mb-2 block text-sm font-semibold text-[var(--admin-text-muted)]">Date of Birth</label>
                <InputText :model-value="state.dob" class="w-full" disabled />
            </div>
            <div class="field">
                <label class="mb-2 block text-sm font-semibold text-[var(--admin-text-muted)]">Gender</label>
                <InputText :model-value="state.gender" class="w-full" disabled />
            </div>
            <div class="field md:col-span-2">
                <label class="mb-2 block text-sm font-semibold text-[var(--admin-text-muted)]">Address</label>
                <Textarea :model-value="state.address" rows="4" class="w-full" disabled />
            </div>
            <div class="field md:col-span-2">
                <label class="mb-2 block text-sm font-semibold text-[var(--admin-text-muted)]">Avatar Path</label>
                <InputText :model-value="state.avatar_path" class="w-full" disabled />
            </div>
        </div>

        <Loading v-if="isLoading" />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import useShowProfile from './useShowProfile';

export default defineComponent({
    name: 'ShowProfile',
    components: { InputText, Textarea, Button, Loading },
    setup() {
        return useShowProfile();
    },
});
</script>
