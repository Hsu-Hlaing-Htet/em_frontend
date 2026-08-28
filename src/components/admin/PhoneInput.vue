<template>
    <div class="field" :class="fieldClass">
        <label v-if="label" class="mb-2 block text-md" :for="numberInputId">{{ label }}</label>

        <div class="flex flex-wrap items-center gap-2">
            <Dropdown
                :input-id="countryInputId"
                :model-value="parts.countryCode"
                :options="countryOptions"
                option-label="label"
                option-value="value"
                placeholder="+95"
                class="w-[6.5rem] min-w-[6.5rem]"
                :disabled="disabled"
                @update:model-value="onCountryChange"
            />

            <InputText
                :id="numberInputId"
                :model-value="parts.localNumber"
                class="min-w-[12rem] flex-1"
                inputmode="numeric"
                maxlength="9"
                pattern="[0-9]*"
                placeholder="9xxxxxxxx"
                :disabled="disabled"
                @keydown="onLocalKeydown"
                @paste="onLocalPaste"
                @update:model-value="onLocalChange"
            />
        </div>

        <small v-if="errorMessages.length" class="p-error">
            <div v-for="error in errorMessages" :key="error">{{ error }}</div>
        </small>
    </div>
</template>

<script>
import { computed, reactive, watch } from 'vue';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import { DEFAULT_PHONE_COUNTRY_CODE, PHONE_COUNTRY_OPTIONS } from '@/constants/phoneData';
import {
    emptyPhoneParts,
    formatPhoneValue,
    parsePhoneValue,
    sanitizeLocalPhoneNumber,
} from '@/helpers/phone/phoneFormat';

let phoneInputUid = 0;

function normalizeCountryCode(value) {
    if (value == null || value === '') {
        return DEFAULT_PHONE_COUNTRY_CODE;
    }

    if (typeof value === 'object' && value.value != null) {
        return String(value.value);
    }

    const normalized = String(value).trim();

    return normalized.startsWith('+') ? normalized : `+${normalized.replace(/\D/g, '')}`;
}

export default {
    name: 'PhoneInput',
    components: { Dropdown, InputText },
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        label: {
            type: String,
            default: 'Phone',
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
        phoneInputUid += 1;
        const uid = phoneInputUid;

        const parts = reactive(emptyPhoneParts());
        let syncingFromValue = false;

        const countryOptions = PHONE_COUNTRY_OPTIONS;

        const errorMessages = computed(() => {
            if (Array.isArray(props.errors)) {
                return props.errors;
            }

            if (props.errors && typeof props.errors.get === 'function') {
                return props.errors.get('phone') || [];
            }

            return [];
        });

        const clearPhoneError = () => {
            if (props.errors && typeof props.errors.clear === 'function' && props.errors.has?.('phone')) {
                props.errors.clear('phone');
            }
        };

        const applyParsedValue = (value) => {
            syncingFromValue = true;
            const parsed = parsePhoneValue(value);
            parts.countryCode = parsed.countryCode || DEFAULT_PHONE_COUNTRY_CODE;
            parts.localNumber = parsed.localNumber;
            syncingFromValue = false;
        };

        const emitFormattedValue = () => {
            if (syncingFromValue) {
                return;
            }

            clearPhoneError();
            emit('update:modelValue', formatPhoneValue(parts.countryCode, parts.localNumber));
        };

        const onCountryChange = (value) => {
            const nextCountry = normalizeCountryCode(value);
            parts.countryCode = nextCountry;
            parts.localNumber = sanitizeLocalPhoneNumber(parts.localNumber, nextCountry);
            emitFormattedValue();
        };

        const onLocalChange = (value) => {
            parts.localNumber = sanitizeLocalPhoneNumber(value, parts.countryCode);
            emitFormattedValue();
        };

        const onLocalKeydown = (event) => {
            const allowedKeys = [
                'Backspace',
                'Delete',
                'Tab',
                'Escape',
                'Enter',
                'ArrowLeft',
                'ArrowRight',
                'ArrowUp',
                'ArrowDown',
                'Home',
                'End',
            ];

            if (event.metaKey || event.ctrlKey || allowedKeys.includes(event.key)) {
                return;
            }

            const target = event.target;
            const hasSelection = target.selectionStart !== target.selectionEnd;

            if (!/^\d$/.test(event.key) || (parts.localNumber.length >= 9 && !hasSelection)) {
                event.preventDefault();
            }
        };

        const onLocalPaste = (event) => {
            const pasted = event.clipboardData?.getData('text') || '';
            const sanitized = sanitizeLocalPhoneNumber(pasted, parts.countryCode);

            event.preventDefault();
            parts.localNumber = sanitizeLocalPhoneNumber(`${parts.localNumber}${sanitized}`, parts.countryCode);
            emitFormattedValue();
        };

        watch(
            () => props.modelValue,
            (value) => {
                const current = formatPhoneValue(parts.countryCode, parts.localNumber);

                if ((value || '') === current) {
                    return;
                }

                applyParsedValue(value);
            },
            { immediate: true },
        );

        return {
            parts,
            countryOptions,
            errorMessages,
            countryInputId: `phone-country-${uid}`,
            numberInputId: `phone-number-${uid}`,
            onCountryChange,
            onLocalKeydown,
            onLocalChange,
            onLocalPaste,
        };
    },
};
</script>
