<template>
    <div class="flex flex-wrap items-center gap-2">
        <Button
            label="Download"
            icon="pi pi-download"
            severity="secondary"
            :loading="loading"
            :disabled="isBusy"
            @click="$emit('download')"
        />
        <SplitButton
            label="Export"
            icon="pi pi-upload"
            severity="secondary"
            :model="exportMenuItems"
            :disabled="isBusy"
            @click="$emit('export-csv')"
        />
        <Button
            label="Print"
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
        const isBusy = computed(() => props.loading || props.disabled);

        const exportMenuItems = computed(() => [
            {
                label: 'Export CSV',
                icon: 'pi pi-file',
                disabled: isBusy.value,
                command: () => emit('export-csv'),
            },
            {
                label: 'Export Excel',
                icon: 'pi pi-file-excel',
                disabled: isBusy.value,
                command: () => emit('export-excel'),
            },
        ]);

        return { exportMenuItems, isBusy };
    },
});
</script>
