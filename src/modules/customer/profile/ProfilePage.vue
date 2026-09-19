<template>
    <div class="customer-portal-page">
        <CustomerPageHeader
            :title="$t('customer.account')"
            :subtitle="$t('customer.accountLead')"
        />

        <div v-if="!isLoading" class="admin-panel relative mx-auto w-full">
            <form
                class="grid grid-cols-1 gap-4 md:grid-cols-2"
                @submit.prevent="handleSubmit"
            >
                <div class="field md:col-span-2">
                    <label class="mb-2 block text-md">{{ $t('customer.profilePhoto') }}</label>
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
                                :aria-label="$t('common.remove')"
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
                                :label="$t('common.uploadPhoto')"
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
                    <label class="mb-2 block text-md">{{ $t('common.name') }}</label>
                    <InputText v-model="state.name" class="w-full" />
                    <small v-if="errors.has('name')" class="p-error">
                        <div v-for="error in errors.get('name')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <EmailInput
                    v-model="state.email"
                    :original-email="state.original_email"
                    :label="$t('common.email')"
                    :errors="errors"
                />

                <div class="field">
                    <label class="mb-2 block text-md">{{ $t('common.phone') }}</label>
                    <InputText v-model="state.phone" class="w-full" />
                    <small v-if="errors.has('phone')" class="p-error">
                        <div v-for="error in errors.get('phone')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">{{ $t('common.nrc') }}</label>
                    <InputText v-model="state.nrc" class="w-full" />
                    <small v-if="errors.has('nrc')" class="p-error">
                        <div v-for="error in errors.get('nrc')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field md:col-span-2">
                    <label class="mb-2 block text-md">{{ $t('common.address') }}</label>
                    <Textarea v-model="state.address" rows="3" class="w-full" />
                    <small v-if="errors.has('address')" class="p-error">
                        <div v-for="error in errors.get('address')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field md:col-span-2">
                    <label class="mb-2 block text-md">{{ $t('customer.security') }}</label>
                    <p class="mb-3 text-sm text-[var(--admin-text-muted)]">
                        {{ $t('customer.changePasswordLead') }}
                    </p>
                    <Button
                        type="button"
                        :label="$t('common.changePassword')"
                        outlined
                        @click="showChangePasswordDialog = true"
                    />
                </div>

                <div class="col-span-1 pt-2 md:col-span-2">
                    <Button type="submit" :label="$t('customer.saveProfile')" :loading="isSaving" />
                </div>
            </form>
        </div>
    </div>

    <ChangePasswordDialog v-model="showChangePasswordDialog" />

    <Loading v-if="isLoading" />
</template>

<script setup>
import Avatar from 'primevue/avatar';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import ChangePasswordDialog from '@/components/admin/ChangePasswordDialog.vue';
import EmailInput from '@/components/admin/EmailInput.vue';
import CustomerPageHeader from '@/components/customer/CustomerPageHeader.vue';
import useCustomerProfilePage from '@/composables/customer/useCustomerProfilePage';

const {
    isLoading,
    isSaving,
    showChangePasswordDialog,
    errors,
    state,
    displayAvatar,
    hasCustomAvatar,
    avatarFileInput,
    handleSubmit,
    openAvatarPicker,
    onAvatarFileChange,
    clearAvatar,
} = useCustomerProfilePage();
</script>
