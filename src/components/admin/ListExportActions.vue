<template>
    <div class="flex flex-wrap items-center gap-2">
        <Button
            :label="$t('common.download')"
            icon="pi pi-download"
            severity="secondary"
            :loading="loading"
            :disabled="isBusy"
            @click="$emit('download')"
        />
        <SplitButton
            :label="$t('common.export')"
            icon="pi pi-upload"
            severity="secondary"
            :model="exportMenuItems"
            :disabled="isBusy"
            @click="$emit('export-csv')"
        />
        <Button
            :label="$t('common.print')"
            icon="pi pi-print"
            severity="secondary"
            :loading="loading"
            :disabled="isBusy"
            @click="$emit('print')"
        />
    </div>
</template>

<script>
import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';

export default defineComponent({
    name: 'ListExportActions',
    components: { Button, SplitButton },
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['download', 'export-csv', 'export-excel', 'print'],
    setup(props, { emit }) {
        const { t } = useI18n();
        const isBusy = computed(() => props.loading || props.disabled);

        const exportMenuItems = computed(() => [
            {
                label: t('common.exportCsv'),
                icon: 'pi pi-file',
                disabled: isBusy.value,
                command: () => emit('export-csv'),
            },
            {
                label: t('common.exportExcel'),
                icon: 'pi pi-file-excel',
                disabled: isBusy.value,
                command: () => emit('export-excel'),
            },
        ]);

        return { exportMenuItems, isBusy };
    },
});
</script>
