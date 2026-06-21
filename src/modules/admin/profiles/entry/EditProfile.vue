<template>
    <div class="flex flex-col gap-5">
        <div class="admin-crud-header">
            <div>
                <h1>Edit Profile</h1>
                <p>Update profile details.</p>
            </div>
            <Button type="button" icon="pi pi-trash" class="p-button-danger p-button-outlined" @click="showConfirmDialog(state.id)" />
        </div>

        <div v-if="!isLoading" class="admin-panel relative">
            <form class="grid max-w-2xl gap-4 md:grid-cols-2" @submit.prevent="handleSubmit">
                <div class="field md:col-span-2">
                    <label class="mb-2 block text-sm font-semibold">User</label>
                    <Dropdown v-model="state.user_id" :options="userOptions" option-label="label" option-value="value" class="w-full" />
                    <small v-if="errors.has('user_id')" class="p-error">
                        <div v-for="error in errors.get('user_id')" :key="error">{{ error }}</div>
                    </small>
                </div>
                <div class="field">
                    <label class="mb-2 block text-sm font-semibold">Phone</label>
                    <InputText v-model="state.phone" class="w-full" />
                    <small v-if="errors.has('phone')" class="p-error">
                        <div v-for="error in errors.get('phone')" :key="error">{{ error }}</div>
                    </small>
                </div>
                <div class="field">
                    <label class="mb-2 block text-sm font-semibold">NRC</label>
                    <InputText v-model="state.nrc" class="w-full" />
                    <small v-if="errors.has('nrc')" class="p-error">
                        <div v-for="error in errors.get('nrc')" :key="error">{{ error }}</div>
                    </small>
                </div>
                <div class="field">
                    <label class="mb-2 block text-sm font-semibold">Date of Birth</label>
                    <Calendar v-model="state.dob" date-format="yy-mm-dd" class="w-full" show-icon />
                    <small v-if="errors.has('dob')" class="p-error">
                        <div v-for="error in errors.get('dob')" :key="error">{{ error }}</div>
                    </small>
                </div>
                <div class="field">
                    <label class="mb-2 block text-sm font-semibold">Gender</label>
                    <Dropdown v-model="state.gender" :options="genderOptions" option-label="label" option-value="value" class="w-full" />
                    <small v-if="errors.has('gender')" class="p-error">
                        <div v-for="error in errors.get('gender')" :key="error">{{ error }}</div>
                    </small>
                </div>
                <div class="field md:col-span-2">
                    <label class="mb-2 block text-sm font-semibold">Address</label>
                    <Textarea v-model="state.address" rows="4" class="w-full" />
                    <small v-if="errors.has('address')" class="p-error">
                        <div v-for="error in errors.get('address')" :key="error">{{ error }}</div>
                    </small>
                </div>
                <div class="field md:col-span-2">
                    <label class="mb-2 block text-sm font-semibold">Avatar Path</label>
                    <InputText v-model="state.avatar_path" class="w-full" />
                    <small v-if="errors.has('avatar_path')" class="p-error">
                        <div v-for="error in errors.get('avatar_path')" :key="error">{{ error }}</div>
                    </small>
                </div>
                <div class="flex gap-2 md:col-span-2">
                    <Button type="submit" label="Save Changes" class="admin-crud-primary-btn" />
                    <router-link :to="{ name: 'profileList' }">
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
import Textarea from 'primevue/textarea';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import useEditProfile from './useEditProfile';

export default defineComponent({
    name: 'EditProfile',
    components: { ConfirmDialog, Dropdown, InputText, Textarea, Calendar, Button, Loading },
    setup() {
        return useEditProfile();
    },
});
</script>
