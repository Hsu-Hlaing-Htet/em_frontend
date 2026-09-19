<template>
    <Dialog
        v-model:visible="visible"
        modal
        header="Change Password"
        close-icon="pi pi-times"
        class="w-full max-w-lg"
        :closable="!loading"
        :close-on-escape="!loading"
        :dismissable-mask="false"
        @update:visible="onVisibleChange"
    >
        <form class="flex flex-col gap-4" novalidate @submit.prevent="submit">
            <div class="field">
                <label class="mb-2 block text-md" for="current_password">Current Password</label>
                <div class="admin-password-field">
                    <input
                        id="current_password"
                        v-model="form.current_password"
                        :type="showCurrentPassword ? 'text' : 'password'"
                        class="p-inputtext p-component w-full admin-password-field__input"
                        placeholder="Enter your current password"
                        :disabled="loading"
                    >
                    <button
                        type="button"
                        class="admin-password-field__toggle"
                        :disabled="loading"
                        @click="showCurrentPassword = !showCurrentPassword"
                    >
                        <i :class="showCurrentPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" />
                    </button>
                </div>
                <FieldErrors :errors="errors" field="current_password" />
            </div>

            <div class="field">
                <label class="mb-2 block text-md" for="new_password">New Password</label>
                <div class="admin-password-field">
                    <input
                        id="new_password"
                        v-model="form.password"
                        :type="showPassword ? 'text' : 'password'"
                        class="p-inputtext p-component w-full admin-password-field__input"
                        placeholder="Enter a new password"
                        :disabled="loading"
                    >
                    <button
                        type="button"
                        class="admin-password-field__toggle"
                        :disabled="loading"
                        @click="showPassword = !showPassword"
                    >
                        <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" />
                    </button>
                </div>
                <FieldErrors :errors="errors" field="password" />
            </div>

            <div class="field">
                <label class="mb-2 block text-md" for="password_confirmation">Confirm New Password</label>
                <div class="admin-password-field">
                    <input
                        id="password_confirmation"
                        v-model="form.password_confirmation"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        class="p-inputtext p-component w-full admin-password-field__input"
                        placeholder="Confirm your new password"
                        :disabled="loading"
                    >
                    <button
                        type="button"
                        class="admin-password-field__toggle"
                        :disabled="loading"
                        @click="showConfirmPassword = !showConfirmPassword"
                    >
                        <i :class="showConfirmPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" />
                    </button>
                </div>
                <FieldErrors :errors="errors" field="password_confirmation" />
            </div>
        </form>

        <template #footer>
            <Button
                type="button"
                label="Cancel"
                class="btn-outline"
                :disabled="loading"
                @click="close"
            />
            <Button
                type="submit"
                label="Change Password"
                :loading="loading"
                :disabled="loading"
                @click="submit"
            />
        </template>
    </Dialog>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import FieldErrors from '@/components/global/FieldErrors.vue';
import { useChangePassword } from '@/composables/global/useChangePassword';

export default defineComponent({
    name: 'ChangePasswordDialog',
    components: { Dialog, Button, FieldErrors },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const visible = ref(props.modelValue);
        const {
            form,
            errors,
            loading,
            showCurrentPassword,
            showPassword,
            showConfirmPassword,
            resetForm,
            submit,
        } = useChangePassword({
            keepSession: true,
            successMessage: 'Password changed successfully.',
            onSuccess: () => {
                visible.value = false;
                emit('update:modelValue', false);
            },
        });

        watch(() => props.modelValue, (value) => {
            visible.value = value;

            if (value) {
                resetForm();
            }
        });

        const close = () => {
            if (loading.value) {
                return;
            }

            emit('update:modelValue', false);
        };

        const onVisibleChange = (value) => {
            if (loading.value && !value) {
                visible.value = true;
                return;
            }

            visible.value = value;

            if (!value) {
                emit('update:modelValue', false);
            }
        };

        return {
            visible,
            form,
            errors,
            loading,
            showCurrentPassword,
            showPassword,
            showConfirmPassword,
            close,
            onVisibleChange,
            submit,
        };
    },
});
</script>

<style scoped>
.admin-password-field {
    position: relative;
}

.admin-password-field__input {
    padding-right: 2.75rem;
}

.admin-password-field__toggle {
    position: absolute;
    top: 50%;
    right: 0.85rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border: 0;
    background: transparent;
    color: var(--admin-text-muted);
    cursor: pointer;
    transform: translateY(-50%);
}

.admin-password-field__toggle:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}

.admin-password-field__toggle:focus,
.admin-password-field__toggle:focus-visible {
    outline: none;
}
</style>
