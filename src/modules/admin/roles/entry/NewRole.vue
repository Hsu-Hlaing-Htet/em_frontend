<template>
    <div class="flex flex-col gap-5">
        <div class="admin-crud-header">
            <div>
                <h1>Create Role</h1>
                <p>Add a new access role for the platform.</p>
            </div>
        </div>

        <div class="admin-panel relative">
            <form class="grid max-w-xl gap-4" @submit.prevent="handleSubmit">
                <div class="field">
                    <label for="name" class="mb-2 block text-sm font-semibold text-[var(--admin-text)]">Role Name</label>
                    <InputText id="name" v-model="state.name" class="w-full" placeholder="admin" />
                    <small v-if="errors.has('name')" class="p-error">
                        <div v-for="error in errors.get('name')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="flex gap-2">
                    <Button type="submit" label="Save Role" class="admin-crud-primary-btn" />
                    <router-link :to="{ name: 'roleList' }">
                        <Button type="button" label="Cancel" class="p-button-outlined" />
                    </router-link>
                </div>
            </form>

            <Loading v-if="isLoading" />
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import useNewRole from './useNewRole';

export default defineComponent({
    name: 'NewRole',
    components: { InputText, Button, Loading },
    setup() {
        return useNewRole();
    },
});
</script>
