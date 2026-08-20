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
                <Password
                    input-id="current_password"
                    v-model="form.current_password"
                    toggle-mask
                    :feedback="false"
                    class="w-full"
                    input-class="w-full"
                    placeholder="Enter your current password"
                    :disabled="loading"
                />
                <FieldErrors :errors="errors" field="current_password" />
            </div>

            <div class="field">
                <label class="mb-2 block text-md" for="new_password">New Password</label>
                <Password
                    input-id="new_password"
                    v-model="form.password"
                    toggle-mask
                    :feedback="false"
                    class="w-full"
                    input-class="w-full"
                    placeholder="Enter a new password"
                    :disabled="loading"
                />
                <FieldErrors :errors="errors" field="password" />
            </div>

            <div class="field">
                <label class="mb-2 block text-md" for="password_confirmation">Confirm New Password</label>
                <Password
                    input-id="password_confirmation"
                    v-model="form.password_confirmation"
                    toggle-mask
                    :feedback="false"
                    class="w-full"
                    input-class="w-full"
                    placeholder="Confirm your new password"
                    :disabled="loading"
                />
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
import Password from 'primevue/password';
import FieldErrors from '@/components/global/FieldErrors.vue';
import { useChangePassword } from '@/composables/global/useChangePassword';

export default defineComponent({
    name: 'ChangePasswordDialog',
    components: { Dialog, Button, Password, FieldErrors },
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
            resetForm,
            submit,
        } = useChangePassword();

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
            close,
            onVisibleChange,
            submit,
        };
    },
});
</script>
