<template>
    <div v-if="!isLoading" class="pdf-view">
        <header class="pdf-bar no-print">
            <div class="pdf-actions">
                <Button
                    icon="pi pi-download"
                    label="Download"
                    severity="secondary"
                    @click="downloadPdf"
                />
                <Button
                    icon="pi pi-print"
                    label="Print"
                    severity="secondary"
                    @click="printContract"
                />
                <Button
                    icon="pi pi-file-export"
                    label="Export"
                    severity="secondary"
                    @click="exportPdf"
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
import Loading from '@/components/Loading.vue';
import ContractPdfSheet from '../../components/ContractPdfSheet.vue';
import useShowSaleDraft from './useShowSaleDraft';

export default defineComponent({
    name: 'ContractPdf',
    components: { Button, Loading, ContractPdfSheet },
    setup() {
        return useShowSaleDraft();
    },
});
</script>

<style src="../../styles/contract-pdf-view.css"></style>
