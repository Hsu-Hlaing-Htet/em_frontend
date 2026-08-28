<template>
    <div v-if="!isLoading" class="admin-panel relative mx-auto max-w-4xl">
        <form
            class="grid grid-cols-1 gap-4 md:grid-cols-2"
            @submit.prevent="handleSubmit"
        >
            <div class="field md:col-span-2">
                <label class="mb-2 block text-md">Profile Image</label>
                <div class="admin-profile-photo">
                    <div class="admin-profile-photo-avatar">
                        <Avatar
                            :image="displayAvatar"
                            size="xlarge"
                            shape="circle"
                        />
                        <button
                            v-if="hasCustomAvatar"
                            type="button"
                            class="admin-profile-photo-remove"
                            aria-label="Remove photo"
                            @click="clearAvatar"
                        >
                            <i class="pi pi-times" aria-hidden="true" />
                        </button>
                    </div>

                    <div class="admin-profile-photo-actions">
                        <input
                            ref="avatarFileInput"
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            class="admin-profile-photo-input"
                            @change="onAvatarFileChange"
                        >
                        <Button
                            type="button"
                            label="Upload Photo"
                            outlined
                            @click="openAvatarPicker"
                        />
                        <small v-if="errors.has('avatar_path')" class="p-error">
                            <div v-for="error in errors.get('avatar_path')" :key="error">{{ error }}</div>
                        </small>
                    </div>
                </div>
            </div>

            <div class="field">
                <label class="mb-2 block text-md">Role</label>
                <InputText :model-value="roleLabel" class="w-full" disabled />
            </div>

            <div class="field">
                <label class="mb-2 block text-md">Name</label>
                <InputText v-model="state.name" class="w-full" />
                <small v-if="errors.has('name')" class="p-error">
                    <div v-for="error in errors.get('name')" :key="error">{{ error }}</div>
                </small>
            </div>

            <GmailInput
                v-model="state.email"
                :original-email="state.original_email"
                :errors="errors"
            />

            <div class="field">
                <label class="mb-2 block text-md">Phone</label>
                <InputText v-model="state.phone" class="w-full" />
                <small v-if="errors.has('phone')" class="p-error">
                    <div v-for="error in errors.get('phone')" :key="error">{{ error }}</div>
                </small>
            </div>

            <div class="field md:col-span-2">
                <label class="mb-2 block text-md">Password</label>
                <p class="mb-3 text-sm text-[var(--admin-text-muted)]">
                    You will need to sign in again after changing your password.
                </p>
                <Button
                    type="button"
                    label="Change Password"
                    outlined
                    @click="showChangePasswordDialog = true"
                />
            </div>

            <div class="col-span-1 pt-2 md:col-span-2">
                <Button type="submit" label="Save Profile" :loading="isSaving" />
            </div>
        </form>
    </div>

    <ChangePasswordDialog v-model="showChangePasswordDialog" />

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Avatar from 'primevue/avatar';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import ChangePasswordDialog from '@/components/admin/ChangePasswordDialog.vue';
import GmailInput from '@/components/admin/GmailInput.vue';
import useProfilePage from './useProfilePage';

export default defineComponent({
    name: 'ProfilePage',
    components: {
        Avatar,
        InputText,
        Button,
        Loading,
        ChangePasswordDialog,
        GmailInput,
    },
    setup() {
        return useProfilePage();
    },
});
</script>
