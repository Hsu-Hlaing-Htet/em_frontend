<template>
    <div class="flex flex-wrap items-center gap-2">
        <Button
            label="Download"
            icon="pi pi-download"
            severity="secondary"
            @click="$emit('download')"
        />
        <SplitButton
            label="Export"
            icon="pi pi-upload"
            severity="secondary"
            :model="exportMenuItems"
            @click="$emit('export-csv')"
        />
        <Button
            label="Print"
            icon="pi pi-print"
            severity="secondary"
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
    emits: ['download', 'export-csv', 'export-excel', 'print'],
    setup(_, { emit }) {
        const exportMenuItems = computed(() => [
            {
                label: 'Export CSV',
                icon: 'pi pi-file',
                command: () => emit('export-csv'),
            },
            {
                label: 'Export Excel',
                icon: 'pi pi-file-excel',
                command: () => emit('export-excel'),
            },
        ]);

        return { exportMenuItems };
    },
});
</script>
