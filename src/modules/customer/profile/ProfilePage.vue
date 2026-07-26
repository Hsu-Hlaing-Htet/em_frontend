<template>
    <div v-if="!isLoading" class="mx-auto max-w-4xl">
        <h1 class="customer-page-heading">Profile</h1>
        <p class="customer-page-lead">Manage your account and security settings</p>

        <div class="admin-panel customer-profile-hero">
            <Avatar :image="displayAvatar" size="xlarge" shape="circle" />
            <div>
                <p class="m-0 text-lg font-bold">{{ state.name || 'Customer' }}</p>
                <p class="m-0 text-sm text-[var(--admin-text-muted)]">{{ state.email }}</p>
                <p class="m-0 mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--admin-primary)]">{{ roleLabel }}</p>
            </div>
        </div>

        <form @submit.prevent="handleSubmit">
            <section class="admin-panel customer-form-section">
                <h3>Profile Photo</h3>
                <div class="flex flex-col gap-3">
                    <InputText v-model="state.avatar_path" class="w-full" placeholder="Image URL" />
                    <div class="flex flex-wrap gap-2">
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
            </section>

            <section class="admin-panel customer-form-section">
                <h3>Personal Information</h3>
                <div class="flex flex-col gap-4">
                    <div>
                        <label class="mb-2 block text-sm font-semibold">Name</label>
                        <InputText v-model="state.name" class="w-full" />
                        <small v-if="errors.has('name')" class="p-error">
                            <div v-for="error in errors.get('name')" :key="error">{{ error }}</div>
                        </small>
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-semibold">Email</label>
                        <InputText v-model="state.email" type="email" class="w-full" />
                        <small v-if="errors.has('email')" class="p-error">
                            <div v-for="error in errors.get('email')" :key="error">{{ error }}</div>
                        </small>
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-semibold">Phone</label>
                        <InputText v-model="state.phone" class="w-full" />
                        <small v-if="errors.has('phone')" class="p-error">
                            <div v-for="error in errors.get('phone')" :key="error">{{ error }}</div>
                        </small>
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-semibold">NRC</label>
                        <InputText v-model="state.nrc" class="w-full" />
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-semibold">Address</label>
                        <Textarea v-model="state.address" rows="3" class="w-full" />
                    </div>
                </div>
            </section>

            <section class="admin-panel customer-form-section">
                <h3>Security</h3>
                <div class="flex flex-col gap-4">
                    <div>
                        <label class="mb-2 block text-sm font-semibold">New Password</label>
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
                    <div>
                        <label class="mb-2 block text-sm font-semibold">Confirm Password</label>
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
                </div>
            </section>

            <Button type="submit" label="Save Profile" class="customer-btn-block" :loading="isSaving" />
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
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import useCustomerProfilePage from '@/composables/customer/useCustomerProfilePage';

export default defineComponent({
    name: 'CustomerProfilePage',
    components: { Avatar, InputText, Password, FileUpload, Textarea, Button, Loading },
    setup() {
        return useCustomerProfilePage();
    },
});
</script>
