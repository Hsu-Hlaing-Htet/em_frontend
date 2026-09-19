<template>
    <div v-if="!isLoading" class="">
        <header class="pdf-bar no-print">
            <div class="pdf-actions">
                <Button
                    v-if="document"
                    type="button"
                    icon="pi pi-eye"
                    label="View"
                    severity="secondary"
                    @click="viewContract"
                />
                <Button
                    v-if="canReview"
                    type="button"
                    icon="pi pi-check"
                    label="Approve"
                    severity="success"
                    :loading="isApproving"
                    :disabled="isApproving || isRejecting"
                    @click="showApproveDialog = true"
                />
                <Button
                    v-if="canReview"
                    type="button"
                    icon="pi pi-times"
                    label="Reject"
                    severity="danger"
                    :loading="isRejecting"
                    :disabled="isApproving || isRejecting"
                    @click="openRejectDialog"
                />
                <router-link :to="backRoute">
                    <Button type="button" label="Back" severity="secondary" />
                </router-link>
            </div>
        </header>

        <div class="pdf-canvas">
            <div class="pdf-frame">
                <ContractPdfSheet
                    variant="rent"
                    :document="document"
                    :field-sections="fieldSections"
                    show-approval-section
                />
            </div>
        </div>
    </div>

    <Loading v-if="isLoading" />

    <ApproveRecordDialog
        v-model="showApproveDialog"
        entity="rent contract"
        :submitting="isApproving"
        @confirm="approveContract"
    />

    <RejectContractDialog
        v-model="showRejectDialog"
        entity="rent contract"
        :submitting="isRejecting"
        :close-on-confirm="false"
        @confirm="rejectContract"
    />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import ContractPdfSheet from '@/components/admin/documents/ContractPdfSheet.vue';
import ApproveRecordDialog from '@/components/admin/ApproveRecordDialog.vue';
import RejectContractDialog from '@/components/admin/contracts/RejectContractDialog.vue';
import useShowRentContractApproval from './useShowRentContractApproval';

export default defineComponent({
    name: 'ShowRentContractApproval',
    components: { Button, Loading, ContractPdfSheet, ApproveRecordDialog, RejectContractDialog },
    setup() {
        return useShowRentContractApproval();
    },
});
</script>

<style src="@/assets/css/documents/contract-pdf-view.css"></style>
