<script setup>
import { computed, onMounted } from 'vue';
import AccessibleIconButton from './AccessibleIconButton.vue';

const props = defineProps({
    modelValue: {
        type: Array,
        default: () => [],
    },
    descriptionLabel: {
        type: String,
        default: 'Description',
    },
    amountLabel: {
        type: String,
        default: 'Amount',
    },
    addLabel: {
        type: String,
        default: 'Add line item',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:modelValue']);

const items = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
});

const createRow = () => ({
    description: '',
    amount: null,
});

const addRow = () => {
    items.value = [...items.value, createRow()];
};

const removeRow = (index) => {
    items.value = items.value.filter((_, rowIndex) => rowIndex !== index);
};

const updateRow = (index, field, value) => {
    items.value = items.value.map((row, rowIndex) => {
        if (rowIndex !== index) {
            return row;
        }

        return {
            ...row,
            [field]: value,
        };
    });
};

onMounted(() => {
    if (!items.value.length) {
        addRow();
    }
});
</script>

<template>
    <div class="flex flex-col gap-3">
        <DataTable
            :value="items"
            data-key="amount"
            responsive-layout="scroll"
            class="line-items-editor"
        >
            <Column :header="descriptionLabel">
                <template #body="{ data, index }">
                    <InputText
                        :model-value="data.description"
                        class="w-full"
                        :disabled="disabled"
                        :aria-label="`${descriptionLabel} row ${index + 1}`"
                        @update:model-value="updateRow(index, 'description', $event)"
                    />
                </template>
            </Column>

            <Column :header="amountLabel">
                <template #body="{ data, index }">
                    <InputNumber
                        :model-value="data.amount"
                        mode="decimal"
                        :min-fraction-digits="2"
                        :max-fraction-digits="2"
                        class="w-full"
                        :disabled="disabled"
                        :aria-label="`${amountLabel} row ${index + 1}`"
                        @update:model-value="updateRow(index, 'amount', $event)"
                    />
                </template>
            </Column>

            <Column header="Actions" style="width: 5rem">
                <template #body="{ index }">
                    <AccessibleIconButton
                        icon="pi pi-trash"
                        severity="danger"
                        :aria-label="`Remove line item ${index + 1}`"
                        :disabled="disabled || items.length <= 1"
                        @click="removeRow(index)"
                    />
                </template>
            </Column>

            <template #empty>
                <span class="text-sm text-[var(--admin-text-muted)]">No line items added.</span>
            </template>
        </DataTable>

        <div>
            <Button
                type="button"
                :label="addLabel"
                icon="pi pi-plus"
                outlined
                :disabled="disabled"
                :aria-label="addLabel"
                @click="addRow"
            />
        </div>
    </div>
</template>
