<template>
    <div class="flex flex-col gap-5">
        <div class="admin-crud-header">
            <div>
                <h1>Edit User</h1>
                <p>Update user account details.</p>
            </div>
            <Button type="button" icon="pi pi-trash" class="p-button-danger p-button-outlined" @click="showConfirmDialog(state.id)" />
        </div>

        <div v-if="!isLoading" class="admin-crud-panel relative">
            <form class="grid max-w-xl gap-4" @submit.prevent="handleSubmit">
                <div class="field">
                    <label class="mb-2 block text-sm font-semibold">Role</label>
                    <Dropdown v-model="state.role_id" :options="roleOptions" option-label="label" option-value="value" class="w-full" />
                    <small v-if="errors.has('role_id')" class="p-error">
                        <div v-for="error in errors.get('role_id')" :key="error">{{ error }}</div>
                    </small>
                </div>
                <div class="field">
                    <label class="mb-2 block text-sm font-semibold">Name</label>
                    <InputText v-model="state.name" class="w-full" />
                    <small v-if="errors.has('name')" class="p-error">
                        <div v-for="error in errors.get('name')" :key="error">{{ error }}</div>
                    </small>
                </div>
                <div class="field">
                    <label class="mb-2 block text-sm font-semibold">Email</label>
                    <InputText v-model="state.email" type="email" class="w-full" />
                    <small v-if="errors.has('email')" class="p-error">
                        <div v-for="error in errors.get('email')" :key="error">{{ error }}</div>
                    </small>
                </div>
                <div class="field">
                    <label class="mb-2 block text-sm font-semibold">New Password</label>
                    <Password v-model="state.password" class="w-full" toggle-mask :feedback="false" input-class="w-full" placeholder="Leave blank to keep current" />
                    <small v-if="errors.has('password')" class="p-error">
                        <div v-for="error in errors.get('password')" :key="error">{{ error }}</div>
                    </small>
                </div>
                <div class="flex gap-2">
                    <Button type="submit" label="Save Changes" class="admin-crud-primary-btn" />
                    <router-link :to="{ name: 'userList' }">
                        <Button type="button" label="Cancel" class="p-button-outlined" />
                    </router-link>
                </div>
            </form>
        </div>

        <ConfirmDialog :show-header="false">
            <template #message="slotProps">
                <div class="w-full text-center">
                    <Button type="button" :icon="slotProps.message.icon" class="p-button-lg p-button-danger p-button-rounded p-button-outlined mt-4" />
                    <h4>{{ slotProps.message.message }}</h4>
                </div>
            </template>
        </ConfirmDialog>

        <Loading v-if="isLoading" />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import ConfirmDialog from 'primevue/confirmdialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import useEditUser from './useEditUser';

export default defineComponent({
    name: 'EditUser',
    components: { ConfirmDialog, Dropdown, InputText, Password, Button, Loading },
    setup() {
        return useEditUser();
    },
});
</script>
