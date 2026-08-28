<template>
    <div class="field" :class="fieldClass">
        <label v-if="label" class="mb-2 block text-md" :for="inputId">{{ label }}</label>

        <template v-if="isSuperAdminLock">
            <InputText
                :id="inputId"
                :model-value="modelValue"
                class="w-full"
                type="email"
                disabled
            />
            <small class="mt-1 block text-sm text-[var(--admin-text-muted)]">
                Super Admin email cannot be changed.
            </small>
        </template>

        <div
            v-else
            class="flex w-full items-stretch overflow-hidden rounded-[3px] border border-[var(--admin-border)] bg-[var(--admin-surface-solid)] focus-within:border-[var(--admin-primary)]"
        >
            <InputText
                :id="inputId"
                :model-value="username"
                class="gmail-username-input min-w-0 flex-1"
                type="text"
                autocomplete="username"
                placeholder="username"
                :disabled="disabled"
                @update:model-value="onUsernameChange"
            />
            <span
                class="inline-flex shrink-0 items-center px-3 text-sm text-[var(--admin-text-muted)]"
                aria-hidden="true"
            >
                @gmail.com
            </span>
        </div>

        <small v-if="errorMessages.length" class="p-error">
            <div v-for="error in errorMessages" :key="error">{{ error }}</div>
        </small>
    </div>
</template>

<script>
import { computed, ref, watch } from 'vue';
import InputText from 'primevue/inputtext';
import {
    formatGmailAddress,
    isReservedSuperAdminEmail,
    parseGmailUsername,
    sanitizeGmailUsername,
    shouldUseGmailUsernameInput,
} from '@/helpers/email/gmailFormat';

let gmailInputUid = 0;

export default {
    name: 'GmailInput',
    components: { InputText },
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        originalEmail: {
            type: String,
            default: null,
        },
        label: {
            type: String,
            default: 'Email',
        },
        fieldClass: {
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        errors: {
            type: [Array, Object],
            default: () => [],
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        gmailInputUid += 1;
        const inputId = `gmail-username-${gmailInputUid}`;
        const username = ref('');

        const isSuperAdminLock = computed(() => !shouldUseGmailUsernameInput(
            props.modelValue,
            props.originalEmail,
        ));

        const errorMessages = computed(() => {
            if (Array.isArray(props.errors)) {
                return props.errors;
            }

            if (props.errors && typeof props.errors.get === 'function') {
                return props.errors.get('email') || [];
            }

            return [];
        });

        const clearEmailError = () => {
            if (props.errors && typeof props.errors.clear === 'function' && props.errors.has?.('email')) {
                props.errors.clear('email');
            }
        };

        const applyFromModel = (value) => {
            if (isReservedSuperAdminEmail(value) || isReservedSuperAdminEmail(props.originalEmail)) {
                username.value = '';
                return;
            }

            const parsed = parseGmailUsername(value);
            username.value = parsed || '';
        };

        const onUsernameChange = (value) => {
            if (isSuperAdminLock.value) {
                return;
            }

            const nextUsername = sanitizeGmailUsername(value);
            username.value = nextUsername;
            clearEmailError();
            emit('update:modelValue', formatGmailAddress(nextUsername));
        };

        watch(
            () => [props.modelValue, props.originalEmail],
            () => {
                if (isSuperAdminLock.value) {
                    return;
                }

                const current = formatGmailAddress(username.value);

                if ((props.modelValue || '') === current) {
                    return;
                }

                applyFromModel(props.modelValue);
            },
            { immediate: true },
        );

        return {
            inputId,
            username,
            isSuperAdminLock,
            errorMessages,
            onUsernameChange,
        };
    },
};
</script>

<style scoped>
:deep(.gmail-username-input.p-inputtext) {
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    width: 100%;
}
</style>
