<template>
    <div v-if="!isLoading" class="admin-panel mx-auto max-w-4xl">
        <form class="grid grid-cols-1 gap-4 md:grid-cols-2" @submit.prevent="handleSubmit">
            <div class="field md:col-span-2">
                <label class="mb-2 block">Profile Image</label>
                <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Avatar :image="displayAvatar" size="xlarge" shape="circle" />
                    <div class="flex flex-1 flex-col gap-2">
                        <InputText v-model="state.avatar_path" class="w-full" placeholder="Image URL" />
                        <div class="flex flex-wrap items-center gap-2">
                            <FileUpload
                                mode="basic"
                                choose-label="Choose Image"
                                accept="image/*"
                                :auto="false"
                                custom-upload
                                @uploader="onAvatarSelected"
                            />
                            <Button
                                v-if="state.avatar_path || avatarPreviewUrl"
                                type="button"
                                label="Remove"
                                severity="secondary"
                                text
                                @click="clearAvatar"
                            />
                        </div>
                        <small v-if="errors.has('avatar_path')" class="p-error">
                            <div v-for="error in errors.get('avatar_path')" :key="error">{{ error }}</div>
                        </small>
                    </div>
                </div>
            </div>

            <div class="field">
                <label class="mb-2 block">Role</label>
                <InputText :model-value="roleLabel" class="w-full" disabled />
            </div>

            <div class="field">
                <label class="mb-2 block">Name</label>
                <InputText v-model="state.name" class="w-full" />
                <small v-if="errors.has('name')" class="p-error">
                    <div v-for="error in errors.get('name')" :key="error">{{ error }}</div>
                </small>
            </div>

            <div class="field">
                <label class="mb-2 block">Email</label>
                <InputText v-model="state.email" type="email" class="w-full" />
                <small v-if="errors.has('email')" class="p-error">
                    <div v-for="error in errors.get('email')" :key="error">{{ error }}</div>
                </small>
            </div>

            <div class="field">
                <label class="mb-2 block">Phone</label>
                <InputText v-model="state.phone" class="w-full" />
                <small v-if="errors.has('phone')" class="p-error">
                    <div v-for="error in errors.get('phone')" :key="error">{{ error }}</div>
                </small>
            </div>

            <div class="field">
                <label class="mb-2 block">New Password</label>
                <Password
                    v-model="state.password"
                    toggle-mask
                    :feedback="false"
                    class="w-full"
                    input-class="w-full"
                    placeholder="Leave blank to keep current password"
                />
                <small v-if="errors.has('password')" class="p-error">
                    <div v-for="error in errors.get('password')" :key="error">{{ error }}</div>
                </small>
            </div>

            <div class="field">
                <label class="mb-2 block">Confirm Password</label>
                <Password
                    v-model="state.password_confirmation"
                    toggle-mask
                    :feedback="false"
                    class="w-full"
                    input-class="w-full"
                />
                <small v-if="errors.has('password_confirmation')" class="p-error">
                    <div v-for="error in errors.get('password_confirmation')" :key="error">{{ error }}</div>
                </small>
            </div>

            <div class="md:col-span-2">
                <Button type="submit" label="Save Profile" :loading="isSaving" />
            </div>
        </form>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Avatar from 'primevue/avatar';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import FileUpload from 'primevue/fileupload';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import useCustomerProfilePage from '@/composables/customer/useCustomerProfilePage';

export default defineComponent({
    name: 'CustomerProfilePage',
    components: { Avatar, InputText, Password, FileUpload, Button, Loading },
    setup() {
        return useCustomerProfilePage();
    },
});
</script>
