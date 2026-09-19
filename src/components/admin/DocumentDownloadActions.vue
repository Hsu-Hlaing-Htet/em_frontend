<template>
    <div>
        <Button
            type="button"
            label="Download"
            icon="pi pi-download"
            severity="secondary"
            aria-haspopup="true"
            aria-controls="document-download-menu"
            @click="toggleMenu"
        />
        <Menu
            id="document-download-menu"
            ref="downloadMenu"
            :model="downloadMenuItems"
            :popup="true"
        />
    </div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue';
import Button from 'primevue/button';
import Menu from 'primevue/menu';

export default defineComponent({
    name: 'DocumentDownloadActions',
    components: { Button, Menu },
    props: {
        hasPdfDownload: {
            type: Boolean,
            default: true,
        },
        hasDocumentExport: {
            type: Boolean,
            default: true,
        },
    },
    emits: ['download-pdf', 'export-document', 'print'],
    setup(props, { emit }) {
        const downloadMenu = ref();
        const downloadMenuItems = computed(() => [
            props.hasPdfDownload
                ? {
                    label: 'PDF',
                    icon: 'pi pi-file-pdf',
                    command: () => emit('download-pdf'),
                }
                : null,
            props.hasDocumentExport
                ? {
                    label: 'Document',
                    icon: 'pi pi-file-export',
                    command: () => emit('export-document'),
                }
                : null,
            {
                label: 'Print',
                icon: 'pi pi-print',
                command: () => emit('print'),
            },
        ].filter(Boolean));

        const toggleMenu = (event) => {
            downloadMenu.value?.toggle(event);
        };

        return { downloadMenu, downloadMenuItems, toggleMenu };
    },
});
</script>
