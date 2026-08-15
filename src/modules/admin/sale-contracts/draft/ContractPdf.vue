<template>
    <div v-if="!isLoading" class="">
        <header class="">
            <div class="pdf-actions">
                <DocumentDownloadActions
                    @download-pdf="downloadPdf"
                    @export-document="exportPdf"
                    @print="printContract"
                />
                <Button
                    icon="pi pi-envelope"
                    label="Send Email"
                    @click="sendEmail"
                />
                <router-link :to="pdfBackRoute">
                    <Button label="Back" severity="secondary" />
                </router-link>
            </div>
        </header>

        <div class="pdf-canvas">
            <div class="pdf-frame">
                <ContractPdfSheet
                    variant="sale"
                    :document="document"
                    :field-sections="fieldSections"
                />
            </div>
        </div>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import ContractPdfSheet from '@/components/admin/documents/ContractPdfSheet.vue';
import DocumentDownloadActions from '@/components/admin/DocumentDownloadActions.vue';
import useShowSaleDraft from './useShowSaleDraft';

export default defineComponent({
    name: 'ContractPdf',
    components: { Button, Loading, ContractPdfSheet, DocumentDownloadActions },
    setup() {
        return useShowSaleDraft();
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
