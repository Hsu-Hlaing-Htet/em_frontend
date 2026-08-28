<template>
    <div class="field" :class="fieldClass">
        <label v-if="label" class="mb-2 block text-md" :for="numberInputId">{{ label }}</label>

        <div class="flex flex-wrap items-center gap-2">
            <Dropdown
                :input-id="stateInputId"
                :model-value="parts.stateCode"
                :options="stateOptions"
                option-label="label"
                option-value="code"
                placeholder="State"
                class="w-[6.5rem] min-w-[6.5rem]"
                :disabled="disabled"
                @update:model-value="onStateChange"
            />

            <span class="text-lg font-semibold text-[var(--admin-text)]" aria-hidden="true">/</span>

            <Dropdown
                :key="`nrc-township-${parts.stateCode || 'none'}`"
                :input-id="townshipInputId"
                :model-value="parts.townshipCode"
                :options="townshipOptions"
                option-label="label"
                option-value="value"
                placeholder="Township"
                class="w-[9.5rem] min-w-[9.5rem]"
                :disabled="disabled || !hasStateCode"
                @update:model-value="onTownshipChange"
            />

            <Dropdown
                :input-id="typeInputId"
                :model-value="parts.type"
                :options="typeOptions"
                option-label="label"
                option-value="value"
                placeholder="Type"
                class="w-[5.5rem] min-w-[5.5rem]"
                :disabled="disabled"
                @update:model-value="onTypeChange"
            />

            <InputText
                :id="numberInputId"
                :model-value="parts.number"
                class="w-[9.5rem] min-w-[9.5rem]"
                inputmode="numeric"
                :maxlength="numberLength"
                placeholder="000000"
                :disabled="disabled"
                @update:model-value="onNumberChange"
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
import {
    NRC_NUMBER_LENGTH,
    NRC_STATE_OPTIONS,
    NRC_TYPE_OPTIONS,
    getNrcTownshipOptions,
    isValidNrcTownship,
    normalizeNrcStateCode,
} from '@/constants/nrcData';
import {
    emptyNrcParts,
    formatNrcValue,
    parseNrcValue,
    sanitizeNrcNumber,
} from '@/helpers/nrc/nrcFormat';

let nrcInputUid = 0;

function normalizeTownshipCode(value) {
    if (value == null || value === '') {
        return null;
    }

    if (typeof value === 'object' && value.value != null) {
        return String(value.value);
    }

    const normalized = String(value).trim();

    return normalized === '' ? null : normalized;
}

export default {
    name: 'NrcInput',
    components: { Dropdown, InputText },
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        label: {
            type: String,
            default: 'NRC',
        },
        fieldClass: {
            type: String,
            default: 'md:col-span-2',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        /**
         * Either an array of messages, or the shared Errors store (preferred).
         */
        errors: {
            type: [Array, Object],
            default: () => [],
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        nrcInputUid += 1;
        const uid = nrcInputUid;

        const parts = reactive(emptyNrcParts());
        let syncingFromValue = false;

        const stateOptions = NRC_STATE_OPTIONS;
        const typeOptions = NRC_TYPE_OPTIONS;
        const numberLength = NRC_NUMBER_LENGTH;

        const hasStateCode = computed(() => Boolean(normalizeNrcStateCode(parts.stateCode)));

        const townshipOptions = computed(() => {
            const stateCode = normalizeNrcStateCode(parts.stateCode);

            return stateCode ? getNrcTownshipOptions(stateCode) : [];
        });

        const errorMessages = computed(() => {
            if (Array.isArray(props.errors)) {
                return props.errors;
            }

            if (props.errors && typeof props.errors.get === 'function') {
                return props.errors.get('nrc') || [];
            }

            return [];
        });

        const clearNrcError = () => {
            if (props.errors && typeof props.errors.clear === 'function' && props.errors.has?.('nrc')) {
                props.errors.clear('nrc');
            }
        };

        const applyParsedValue = (value) => {
            syncingFromValue = true;
            const parsed = parseNrcValue(value);
            parts.stateCode = normalizeNrcStateCode(parsed.stateCode);
            parts.townshipCode = normalizeTownshipCode(parsed.townshipCode);
            parts.type = parsed.type || 'N';
            parts.number = parsed.number;
            syncingFromValue = false;
        };

        const emitFormattedValue = () => {
            if (syncingFromValue) {
                return;
            }

            clearNrcError();
            emit('update:modelValue', formatNrcValue(parts));
        };

        const onStateChange = (value) => {
            const nextState = normalizeNrcStateCode(value);

            if (parts.stateCode !== nextState) {
                parts.townshipCode = null;
            }

            parts.stateCode = nextState;
            emitFormattedValue();
        };

        const onTownshipChange = (value) => {
            parts.townshipCode = normalizeTownshipCode(value);
            emitFormattedValue();
        };

        const onTypeChange = (value) => {
            parts.type = value || null;
            emitFormattedValue();
        };

        const onNumberChange = (value) => {
            parts.number = sanitizeNrcNumber(value);
            emitFormattedValue();
        };

        watch(
            () => normalizeNrcStateCode(parts.stateCode),
            (stateCode) => {
                if (!parts.townshipCode) {
                    return;
                }

                if (!stateCode || !isValidNrcTownship(stateCode, parts.townshipCode)) {
                    parts.townshipCode = null;
                    emitFormattedValue();
                }
            },
        );

        watch(
            () => props.modelValue,
            (value) => {
                const current = formatNrcValue(parts);

                if ((value || '') === current) {
                    return;
                }

                applyParsedValue(value);
            },
            { immediate: true },
        );

        return {
            parts,
            stateOptions,
            townshipOptions,
            typeOptions,
            numberLength,
            hasStateCode,
            errorMessages,
            stateInputId: `nrc-state-${uid}`,
            townshipInputId: `nrc-township-${uid}`,
            typeInputId: `nrc-type-${uid}`,
            numberInputId: `nrc-number-${uid}`,
            onStateChange,
            onTownshipChange,
            onTypeChange,
            onNumberChange,
        };
    },
};
</script>
