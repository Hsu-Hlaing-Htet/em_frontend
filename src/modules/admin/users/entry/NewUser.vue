<template>
    <div class="flex flex-col gap-5">
        <div class="admin-crud-header">
            <div>
                <h1>Create User</h1>
                <p>Add a new platform user account.</p>
            </div>
        </div>

        <div class="admin-crud-panel relative">
    <form
        class="grid grid-cols-1 gap-4 md:grid-cols-2"
        @submit.prevent="handleSubmit"
    >
        <!-- Role -->
        <div class="field">
            <label class="mb-2 block text-sm font-semibold">Role</label>
            <Dropdown
                v-model="state.role_id"
                :options="roleOptions"
                option-label="label"
                option-value="value"
                placeholder="Select role"
                class="w-full"
            />
        </div>

        <!-- Name -->
        <div class="field">
            <label class="mb-2 block text-sm font-semibold">Name</label>
            <InputText v-model="state.name" class="w-full" />
        </div>

        <!-- Email -->
        <div class="field">
            <label class="mb-2 block text-sm font-semibold">Email</label>
            <InputText
                v-model="state.email"
                type="email"
                class="w-full"
            />
        </div>

        <!-- Password -->
        <div class="field">
            <label class="mb-2 block text-sm font-semibold">Password</label>
            <Password
                v-model="state.password"
                toggle-mask
                :feedback="false"
                class="w-full"
                input-class="w-full"
            />
        </div>

        <!-- Buttons Full Width -->
        <div class="col-span-1 flex gap-2 pt-2 md:col-span-2">
            <Button
                type="submit"
                label="Save User"
                class="admin-crud-primary-btn"
            />

            <router-link :to="{ name: 'userList' }">
                <Button
                    type="button"
                    label="Cancel"
                    class="p-button-outlined p-button-secondary"
                />
            </router-link>
        </div>
    </form>

    <Loading v-if="isLoading" />
</div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import useNewUser from './useNewUser';

export default defineComponent({
    name: 'NewUser',
    components: { Dropdown, InputText, Password, Button, Loading },
    setup() {
        return useNewUser();
    },
});
</script>
