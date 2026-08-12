<template>
    <div v-if="!isLoading" class="mx-auto max-w-4xl">
        <h1 class="customer-page-heading">{{ $t('customer.profile') }}</h1>
        <p class="customer-page-lead">{{ $t('customer.profileLead') }}</p>

        <div class="admin-panel customer-profile-hero">
            <Avatar :image="displayAvatar" size="xlarge" shape="circle" />
            <div>
                <p class="m-0 text-lg font-bold">{{ state.name || $t('customer.customerFallback') }}</p>
                <p class="m-0 text-sm text-[var(--admin-text-muted)]">{{ state.email }}</p>
                <p class="m-0 mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--admin-primary)]">{{ roleLabel }}</p>
            </div>
        </div>

        <form @submit.prevent="handleSubmit">
            <section class="admin-panel customer-form-section">
                <h3>{{ $t('customer.profilePhoto') }}</h3>
                <div class="flex flex-col gap-3">
                    <InputText v-model="state.avatar_path" class="w-full" :placeholder="$t('common.imageUrl')" />
                    <div class="flex flex-wrap gap-2">
                        <FileUpload
                            mode="basic"
                            :choose-label="$t('common.chooseImage')"
                            accept="image/*"
                            :auto="false"
                            custom-upload
                            @uploader="onAvatarSelected"
                        />
                        <Button
                            v-if="state.avatar_path || avatarPreviewUrl"
                            type="button"
                            :label="$t('common.remove')"
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
                <h3>{{ $t('customer.personalInformation') }}</h3>
                <div class="flex flex-col gap-4">
                    <div>
                        <label class="mb-2 block text-sm font-semibold">{{ $t('common.name') }}</label>
                        <InputText v-model="state.name" class="w-full" />
                        <small v-if="errors.has('name')" class="p-error">
                            <div v-for="error in errors.get('name')" :key="error">{{ error }}</div>
                        </small>
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-semibold">{{ $t('common.email') }}</label>
                        <InputText v-model="state.email" type="email" class="w-full" />
                        <small v-if="errors.has('email')" class="p-error">
                            <div v-for="error in errors.get('email')" :key="error">{{ error }}</div>
                        </small>
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-semibold">{{ $t('common.phone') }}</label>
                        <InputText v-model="state.phone" class="w-full" />
                        <small v-if="errors.has('phone')" class="p-error">
                            <div v-for="error in errors.get('phone')" :key="error">{{ error }}</div>
                        </small>
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-semibold">{{ $t('common.nrc') }}</label>
                        <InputText v-model="state.nrc" class="w-full" />
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-semibold">{{ $t('common.address') }}</label>
                        <Textarea v-model="state.address" rows="3" class="w-full" />
                    </div>
                </div>
            </section>

            <section class="admin-panel customer-form-section">
                <h3>{{ $t('customer.security') }}</h3>
                <div class="flex flex-col gap-4">
                    <div>
                        <label class="mb-2 block text-sm font-semibold">{{ $t('customer.newPassword') }}</label>
                        <Password
                            v-model="state.password"
                            toggle-mask
                            :feedback="false"
                            class="w-full"
                            input-class="w-full"
                            :placeholder="$t('customer.leavePasswordBlank')"
                        />
                        <small v-if="errors.has('password')" class="p-error">
                            <div v-for="error in errors.get('password')" :key="error">{{ error }}</div>
                        </small>
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-semibold">{{ $t('customer.confirmPassword') }}</label>
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

            <Button type="submit" :label="$t('customer.saveProfile')" class="customer-btn-block" :loading="isSaving" />
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
