<template>
    <div v-if="!isLoading" class="">
        <header class="pdf-bar no-print">
            <div class="pdf-actions">
                <Button
                    label="Download"
                    icon="pi pi-download"
                    @click="downloadPdf"
                />
                <router-link
                    v-if="editRoute"
                    :to="editRoute"
                >
                    <Button
                        icon="pi pi-pencil"
                        label="Edit"
                        severity="secondary"
                    />
                </router-link>
                <router-link :to="backRoute">
                    <Button label="Back" severity="secondary" />
                </router-link>
            </div>
        </header>

        <div class="pdf-canvas">
            <div class="pdf-frame">
                <ContractPdfSheet
                    variant="rent"
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
import useShowRentDraft from './useShowRentDraft';

export default defineComponent({
    name: 'ContractPdf',
    components: { Button, Loading, ContractPdfSheet },
    setup() {
        return useShowRentDraft();
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
