<template>
    <div class="flex flex-col gap-5">
        <div class="admin-crud-header">
            <div>
                <h1>Create Profile</h1>
                <p>Add profile details for a user.</p>
            </div>
        </div>

        <div class="admin-panel relative">
            <form class="grid max-w-2xl gap-4 md:grid-cols-2" @submit.prevent="handleSubmit">
                <div class="field md:col-span-2">
                    <label class="mb-2 block text-sm font-semibold">User</label>
                    <Dropdown v-model="state.user_id" :options="userOptions" option-label="label" option-value="value" placeholder="Select user" class="w-full" />
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
                    <Dropdown v-model="state.gender" :options="genderOptions" option-label="label" option-value="value" placeholder="Select gender" class="w-full" />
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
                    <InputText v-model="state.avatar_path" class="w-full" placeholder="Optional image path" />
                    <small v-if="errors.has('avatar_path')" class="p-error">
                        <div v-for="error in errors.get('avatar_path')" :key="error">{{ error }}</div>
                    </small>
                </div>
                <div class="flex gap-2 md:col-span-2">
                    <Button type="submit" label="Save Profile" class="admin-crud-primary-btn" />
                    <router-link :to="{ name: 'profileList' }">
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
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import useNewProfile from './useNewProfile';

export default defineComponent({
    name: 'NewProfile',
    components: { Dropdown, InputText, Textarea, Calendar, Button, Loading },
    setup() {
        return useNewProfile();
    },
});
</script>
