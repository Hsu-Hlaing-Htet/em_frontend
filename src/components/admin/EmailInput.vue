<template>
    <div class="field" :class="fieldClass">
        <label v-if="label" class="mb-2 block text-md" :for="inputId">{{ label }}</label>

        <InputText
            :id="inputId"
            :model-value="modelValue"
            class="w-full"
            type="email"
            autocomplete="email"
            placeholder="name@example.com"
            :disabled="disabled || isSuperAdminLock"
            @update:model-value="onInput"
        />

        <small v-if="isSuperAdminLock" class="mt-1 block text-sm text-[var(--admin-text-muted)]">
            Super Admin email cannot be changed.
        </small>

        <small v-if="errorMessages.length" class="p-error">
            <div v-for="error in errorMessages" :key="error">{{ error }}</div>
        </small>
    </div>
</template>

<script>
import { computed } from 'vue';
import InputText from 'primevue/inputtext';
import { isReservedSuperAdminEmail } from '@/utils/formValidation';

let emailInputUid = 0;

export default {
    name: 'EmailInput',
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
        emailInputUid += 1;
        const inputId = `email-input-${emailInputUid}`;

        const isSuperAdminLock = computed(() => (
            isReservedSuperAdminEmail(props.modelValue)
            || isReservedSuperAdminEmail(props.originalEmail)
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

        const onInput = (value) => {
            if (isSuperAdminLock.value) {
                return;
            }

            clearEmailError();
            emit('update:modelValue', String(value || '').trim());
        };

        return {
            inputId,
            isSuperAdminLock,
            errorMessages,
            onInput,
        };
    },
};
</script>
