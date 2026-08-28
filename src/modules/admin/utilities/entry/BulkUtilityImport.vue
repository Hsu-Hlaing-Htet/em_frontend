<template>
    <div class="flex flex-col gap-5">
        <div class="flex flex-wrap items-center justify-end gap-2 px-1">
            <Dropdown
                v-model="selectedUtilityTypeId"
                :options="utilityTypeOptions"
                option-label="label"
                option-value="value"
                placeholder="Utility Type"
                class="w-52"
            />
            <Button
                type="button"
                label="Template"
                icon="pi pi-download"
                severity="secondary"
                :disabled="!selectedUtilityTypeId"
                @click="downloadTemplate"
            />
            <Button
                type="button"
                label="Import"
                icon="pi pi-upload"
                :disabled="!selectedUtilityTypeId"
                @click="openFilePicker"
            />
            <input
                ref="fileInput"
                type="file"
                accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                class="hidden"
                @change="handleFileSelected"
            >
        </div>

        <div class="admin-panel">
            <div class="flex flex-col gap-3">
                <h2 class="m-0 text-xl font-semibold">Bulk Utility Import</h2>
                <p class="m-0 text-sm text-[var(--admin-text-muted)]">
                    Bulk utility import setup will be added here.
                </p>
                <p v-if="selectedFilename" class="m-0 text-sm font-medium text-[var(--admin-text)]">
                    Selected file: {{ selectedFilename }}
                </p>
                <p v-if="selectedUtilityTypeName" class="m-0 text-sm font-medium text-[var(--admin-text-muted)]">
                    Utility Type: {{ selectedUtilityTypeName }}
                </p>
                <p v-if="parseError" class="m-0 text-sm font-medium text-red-600">
                    {{ parseError }}
                </p>

                <p v-if="summaryMessage" class="m-0 text-sm font-medium text-[var(--admin-text)]">
                    {{ summaryMessage }}
                </p>

                <DataTable
                    v-if="previewRows.length"
                    :value="previewRows"
                    :row-class="rowClass"
                    responsive-layout="scroll"
                    class="mt-2"
                >
                    <Column
                        v-for="column in templateColumns"
                        :key="column.field"
                        :field="column.field"
                        :header="column.header"
                        style="min-width: 150px"
                    />
                    <Column header="Validation" style="min-width: 260px">
                        <template #body="{ data }">
                            <span v-if="data.is_valid" class="font-semibold text-green-600">Valid</span>
                            <ul v-else class="m-0 pl-4 text-sm text-red-700">
                                <li v-for="message in data.messages" :key="message">
                                    {{ message }}
                                </li>
                            </ul>
                        </template>
                    </Column>
                </DataTable>

                <div class="flex flex-wrap items-center gap-2">
                    <Button
                        v-if="previewRows.length"
                        type="button"
                        label="Import"
                        icon="pi pi-check"
                        :loading="isImporting"
                        :disabled="!canConfirmImport || isImportComplete"
                        @click="confirmImport"
                    />
                    <router-link :to="{ name: 'newUtility' }">
                        <Button type="button" label="Back" severity="secondary" />
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import * as XLSX from 'xlsx';
import { downloadXlsx } from '@/utils/export';
import { service } from '../service';
import { useUtilityTypeStore } from '@/modules/admin/utility-types/store';
import EventBus from '@/libs/AppEventBus';
import { showApiErrorToast } from '@/utils/apiError';

const templateColumns = [
    { field: 'building', header: 'Building' },
    { field: 'room_number', header: 'Room Number' },
    { field: 'billing_month', header: 'Billing Month' },
    { field: 'reading_date', header: 'Reading Date' },
    { field: 'current_reading', header: 'Current Reading', type: 'number' },
];

const templateRows = [
    {
        building: 'Rosewood Tower',
        room_number: 'A-101',
        billing_month: '01/08/2026',
        reading_date: '31/08/2026',
        current_reading: 1325,
    },
];

const normalizeHeader = (value) => String(value || '').trim().toLowerCase();

const rowHasValue = (row) => templateColumns.some(({ field }) => (
    row[field] !== null && row[field] !== undefined && String(row[field]).trim() !== ''
));

const mapWorksheetRows = (worksheet) => {
    const rows = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
        blankrows: false,
        raw: false,
        dateNF: 'dd/mm/yyyy',
    });

    if (!rows.length) {
        return [];
    }

    const headerRow = rows[0].map(normalizeHeader);
    const columnIndexes = templateColumns.map((column) => (
        headerRow.indexOf(normalizeHeader(column.header))
    ));

    return rows.slice(1).map((row) => templateColumns.reduce((item, column, index) => ({
        ...item,
        [column.field]: columnIndexes[index] >= 0 ? row[columnIndexes[index]] : '',
    }), {})).filter(rowHasValue);
};

export default defineComponent({
    name: 'BulkUtilityImport',
    components: {
        Button,
        DataTable,
        Column,
        Dropdown,
    },
    setup() {
        const utilityTypeStore = useUtilityTypeStore();
        const fileInput = ref(null);
        const selectedUtilityTypeId = ref(null);
        const utilityTypeOptions = ref([]);
        const selectedFilename = ref('');
        const parseError = ref('');
        const previewRows = ref([]);
        const isImporting = ref(false);
        const isImportComplete = ref(false);
        const summary = ref({
            total_rows: 0,
            valid_rows: 0,
            invalid_rows: 0,
        });
        const canConfirmImport = computed(() => (
            summary.value.total_rows > 0
            && summary.value.valid_rows === summary.value.total_rows
            && summary.value.invalid_rows === 0
            && !isImporting.value
        ));
        const selectedUtilityTypeName = computed(() => (
            utilityTypeOptions.value.find((option) => option.value === selectedUtilityTypeId.value)?.label || ''
        ));
        const summaryMessage = computed(() => {
            const total = summary.value.total_rows;
            const valid = summary.value.valid_rows;
            const invalid = summary.value.invalid_rows;

            if (!total) {
                return '';
            }

            if (!invalid) {
                return `${total} rows found — all rows are valid.`;
            }

            if (!valid) {
                return `${total} rows found — ${invalid} rows have validation errors.`;
            }

            return `${total} rows found — ${valid} valid, ${invalid} invalid.`;
        });

        const resetPreview = () => {
            selectedFilename.value = '';
            parseError.value = '';
            previewRows.value = [];
            isImportComplete.value = false;
            summary.value = {
                total_rows: 0,
                valid_rows: 0,
                invalid_rows: 0,
            };
        };

        const loadUtilityTypes = async () => {
            await utilityTypeStore.fetchAll({ per_page: 100, status: 'active' });
            const response = utilityTypeStore.getAllResponse;
            const data = response?.data?.data || [];

            utilityTypeOptions.value = data.map((item) => ({
                label: item.name,
                value: item.id,
            }));
        };

        const downloadTemplate = () => {
            if (!selectedUtilityTypeId.value) {
                parseError.value = 'Please select a Utility Type first.';
                return;
            }

            downloadXlsx('Rosewood_Royale_Utility_Import_Template.xlsx', templateRows, templateColumns);
        };

        const openFilePicker = () => {
            if (!selectedUtilityTypeId.value) {
                parseError.value = 'Please select a Utility Type first.';
                return;
            }

            fileInput.value?.click();
        };

        const parseFile = async (file) => {
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
            const firstSheetName = workbook.SheetNames[0];

            if (!firstSheetName) {
                return [];
            }

            return mapWorksheetRows(workbook.Sheets[firstSheetName]);
        };

        const validatePreviewRows = async (rows) => {
            const response = await service.previewBulkImport({
                utility_type_id: selectedUtilityTypeId.value,
                rows,
            });

            previewRows.value = response?.data?.rows || [];
            summary.value = response?.data?.summary || {
                total_rows: 0,
                valid_rows: 0,
                invalid_rows: 0,
            };
        };

        const handleFileSelected = async (event) => {
            const file = event.target.files?.[0];

            resetPreview();
            selectedFilename.value = file?.name || '';

            if (!file) {
                event.target.value = '';
                return;
            }

            try {
                const rows = await parseFile(file);

                if (!rows.length) {
                    parseError.value = 'The selected file is empty or does not contain readable utility rows.';
                } else {
                    await validatePreviewRows(rows);
                }
            } catch (error) {
                parseError.value = 'Unable to parse the selected file. Please upload a valid .xlsx or .csv file.';
            }

            event.target.value = '';
        };

        const confirmImport = async () => {
            if (!canConfirmImport.value || isImportComplete.value) {
                return;
            }

            isImporting.value = true;

            try {
                const rows = previewRows.value.filter((row) => row.is_valid);
                const response = await service.confirmBulkImport({
                    utility_type_id: selectedUtilityTypeId.value,
                    rows,
                });

                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response?.message || 'Utility import completed successfully.',
                });

                isImportComplete.value = true;
            } catch (error) {
                showApiErrorToast(error, 'Unable to import utilities.');
            } finally {
                isImporting.value = false;
            }
        };

        watch(selectedUtilityTypeId, resetPreview);
        onMounted(loadUtilityTypes);
        onBeforeUnmount(() => {
            utilityTypeStore.$reset();
            utilityTypeStore.$dispose();
        });

        return {
            fileInput,
            selectedUtilityTypeId,
            utilityTypeOptions,
            selectedUtilityTypeName,
            selectedFilename,
            parseError,
            previewRows,
            templateColumns,
            canConfirmImport,
            isImporting,
            isImportComplete,
            summaryMessage,
            downloadTemplate,
            openFilePicker,
            handleFileSelected,
            confirmImport,
            summary,
            rowClass: (data) => (!data.is_valid ? 'bulk-utility-invalid-row' : ''),
        };
    },
});
</script>

<style scoped>
:deep(.bulk-utility-invalid-row) {
    background: rgba(220, 38, 38, 0.08);
}
</style>
