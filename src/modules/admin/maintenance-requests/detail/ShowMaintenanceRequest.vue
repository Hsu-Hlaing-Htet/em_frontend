<template>
    <div class="flex flex-wrap items-center justify-between gap-3 p-4">
        <h1 class="m-0 text-xl font-semibold">Maintenance Request Detail</h1>
        <router-link :to="{ name: 'maintenanceRequestList' }">
            <Button label="Back" icon="pi pi-arrow-left" severity="secondary" />
        </router-link>
    </div>

    <div v-if="!isLoading" class="mx-auto flex max-w-5xl flex-col gap-5 px-4 pb-8">
        <section class="admin-panel p-5">
            <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p class="m-0 text-sm text-[var(--admin-text-muted)]">
                        Request No. {{ state.request_number || `MR-${String(state.id).padStart(6, '0')}` }}
                    </p>
                    <h2 class="m-0 mt-1 text-lg font-semibold">Request Information</h2>
                </div>
                <StatusBadge :value="statusBadgeValue" />
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Customer</p>
                    <p class="text-sm font-medium">{{ state.customer_name || state.user_name || '—' }}</p>
                </div>
                <div>
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Building</p>
                    <p class="text-sm font-medium">{{ state.building_name || '—' }}</p>
                </div>
                <div>
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Title</p>
                    <p class="text-sm font-medium">{{ state.title || '—' }}</p>
                </div>
                <div>
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Category</p>
                    <p class="text-sm font-medium">{{ state.maintenance_category_name || state.category || '—' }}</p>
                </div>
                <div>
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Priority</p>
                    <p class="text-sm font-medium capitalize">{{ state.priority || '—' }}</p>
                </div>
                <div>
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Room</p>
                    <p class="text-sm font-medium">{{ state.room_number || '—' }}</p>
                </div>
                <div>
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Contact Number</p>
                    <p class="text-sm font-medium">{{ state.contact_number || '—' }}</p>
                </div>
                <div v-if="showAssignedStaff">
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Assigned Team / Staff</p>
                    <p class="text-sm font-medium">{{ state.assigned_staff || '—' }}</p>
                </div>
                <div v-if="showAssignedStaff && state.visit_date">
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Visit Date</p>
                    <p class="text-sm font-medium">{{ state.visit_date }}</p>
                </div>
                <div class="md:col-span-2">
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Description</p>
                    <p class="text-sm leading-7">{{ state.description || '—' }}</p>
                </div>
                <div class="md:col-span-2">
                    <p class="mb-2 text-sm text-[var(--admin-text-muted)]">Attachment</p>
                    <div
                        class="flex min-h-[140px] items-center justify-center rounded-md border border-dashed border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-4"
                    >
                        <img
                            v-if="state.attachment_url"
                            :src="state.attachment_url"
                            alt="Maintenance attachment"
                            class="max-h-64 max-w-full rounded object-contain"
                        >
                        <p v-else class="m-0 text-sm text-[var(--admin-text-muted)]">No attachment uploaded.</p>
                    </div>
                </div>
                <div v-if="state.completion_note || state.resolution_note" class="md:col-span-2">
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Completion Note</p>
                    <p class="text-sm leading-7">{{ state.completion_note || state.resolution_note }}</p>
                </div>
                <div v-if="Number(state.maintenance_fee_amount) > 0">
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Maintenance Fee</p>
                    <p class="text-sm font-medium">
                        {{ Number(state.maintenance_fee_amount).toLocaleString() }} MMK
                    </p>
                </div>
                <div v-if="state.charge_description">
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Charge Description</p>
                    <p class="text-sm font-medium">{{ state.charge_description }}</p>
                </div>
                <div v-if="state.invoice_id">
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">Invoice</p>
                    <router-link
                        :to="{ name: 'showInvoice', params: { id: state.invoice_id } }"
                        class="text-sm font-medium text-[var(--admin-accent)] underline"
                    >
                        {{ state.invoice_number || `INV-${state.invoice_id}` }}
                    </router-link>
                </div>
                <div v-if="rejectionOrCancellationReason" class="md:col-span-2">
                    <p class="mb-1 text-sm text-[var(--admin-text-muted)]">
                        {{ isRejected ? 'Rejection Reason' : 'Cancellation Reason' }}
                    </p>
                    <p class="text-sm leading-7">{{ rejectionOrCancellationReason }}</p>
                </div>
            </div>

            <div v-if="canAccept || (canReject && isPending)" class="mt-5 flex flex-wrap justify-end gap-2">
                <Button
                    v-if="canAccept"
                    type="button"
                    label="Accept"
                    icon="pi pi-check"
                    :loading="workflowLoading.accept"
                    :disabled="workflowLoading.reject"
                    @click="runWorkflow('accept')"
                />
                <Button
                    v-if="canReject && isPending"
                    type="button"
                    label="Reject"
                    icon="pi pi-times"
                    severity="danger"
                    outlined
                    :loading="workflowLoading.reject"
                    :disabled="workflowLoading.accept"
                    @click="openRejectDialog"
                />
            </div>
        </section>

        <section v-if="showPostAcceptPanels" class="admin-panel p-5">
            <div
                class="maintenance-timeline mb-4"
                :class="{ 'is-flowing': timelineFlowActive }"
                :style="{
                    '--timeline-steps': timelineSteps.length,
                    '--timeline-progress': timelineProgress / 100,
                }"
            >
                <div class="maintenance-timeline__rail" aria-hidden="true">
                    <div class="maintenance-timeline__track" />
                    <div class="maintenance-timeline__progress" />
                    <div v-if="timelineFlowActive" class="maintenance-timeline__flow" />
                </div>
                <div class="maintenance-timeline__nodes">
                    <div
                        v-for="step in timelineSteps"
                        :key="step.key"
                        class="maintenance-timeline__step"
                        :class="{ 'is-reached': step.reached }"
                    >
                        <div class="maintenance-timeline__dot">
                            <i v-if="step.reached" class="pi pi-check" />
                        </div>
                        <p class="maintenance-timeline__label">{{ step.label }}</p>
                        <p class="maintenance-timeline__detail">{{ step.detail }}</p>
                        <p v-if="step.reached && step.at" class="maintenance-timeline__at">
                            {{ step.at }}
                        </p>
                    </div>
                </div>
            </div>

            <div v-if="showAssignmentForm" class="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label class="mb-2 block text-sm font-medium">Assign Team / Staff</label>
                    <InputText
                        v-model="assignForm.assigned_staff"
                        class="w-full"
                        placeholder="Enter team or staff name"
                    />
                </div>
                <div>
                    <label class="mb-2 block text-sm font-medium">Visit Date</label>
                    <Calendar
                        v-model="assignForm.visit_date"
                        date-format="dd/mm/yy"
                        show-icon
                        class="w-full"
                        placeholder="Select visit date"
                    />
                </div>
                <div class="md:col-span-2 flex justify-end">
                    <Button
                        label="Assign"
                        icon="pi pi-user-plus"
                        :loading="workflowLoading.assign"
                        @click="submitAssign"
                    />
                </div>
            </div>

            <div v-if="showInProgressActions" class="mb-5 flex flex-wrap justify-end gap-2">
                <Button
                    label="Work Done"
                    icon="pi pi-check"
                    severity="success"
                    :loading="workflowLoading.complete"
                    :disabled="workflowLoading.cancel"
                    @click="openCompleteDialog"
                />
                <Button
                    label="Cancel"
                    icon="pi pi-ban"
                    severity="danger"
                    outlined
                    :loading="workflowLoading.cancel"
                    :disabled="workflowLoading.complete"
                    @click="openCancelDialog"
                />
            </div>

            <div>
                <h3 class="mb-3 text-base font-semibold">Update History</h3>
                <DataTable
                    :value="state.status_history || []"
                    responsive-layout="scroll"
                    class="w-full"
                >
                    <template #empty>No updates yet.</template>
                    <Column field="at" header="Date & Time" style="min-width: 160px" />
                    <Column field="status" header="Status" style="min-width: 120px">
                        <template #body="{ data }">
                            <StatusBadge :value="data.status" />
                        </template>
                    </Column>
                    <Column field="updated_by" header="Updated By" style="min-width: 140px" />
                    <Column field="remarks" header="Remarks" style="min-width: 200px" />
                </DataTable>
            </div>
        </section>
    </div>

    <RejectContractDialog
        v-model="showRejectDialog"
        header="Reject Maintenance Request"
        description="Please provide a reason explaining why this request is being rejected."
        @confirm="confirmReject"
    />

    <Dialog
        v-model:visible="showCompleteDialog"
        modal
        header="Work Done"
        class="w-full max-w-lg"
    >
        <div class="flex flex-col gap-4">
            <div>
                <label for="resolution_note" class="mb-2 block text-sm font-medium">Completion Note</label>
                <Textarea
                    id="resolution_note"
                    v-model="resolutionNote"
                    rows="4"
                    class="w-full"
                    placeholder="Completion note..."
                />
            </div>
            <div>
                <label for="maintenance_fee_amount" class="mb-2 block text-sm font-medium">
                    Maintenance Fee (MMK)
                    <span class="font-normal text-[var(--admin-text-muted)]">(optional)</span>
                </label>
                <InputNumber
                    id="maintenance_fee_amount"
                    v-model="maintenanceFeeAmount"
                    class="w-full"
                    mode="decimal"
                    :min="0"
                    :min-fraction-digits="0"
                    :max-fraction-digits="2"
                    placeholder="0"
                />
            </div>
            <div>
                <label for="charge_description" class="mb-2 block text-sm font-medium">
                    Charge Description
                    <span
                        v-if="Number(maintenanceFeeAmount) > 0"
                        class="font-normal text-[var(--admin-text-muted)]"
                    >(required when fee &gt; 0)</span>
                </label>
                <InputText
                    id="charge_description"
                    v-model="chargeDescription"
                    class="w-full"
                    placeholder="e.g. Door hinge replacement"
                />
            </div>
        </div>
        <template #footer>
            <Button label="Back" severity="secondary" text @click="showCompleteDialog = false" />
            <Button
                label="Work Done"
                severity="success"
                :loading="workflowLoading.complete"
                @click="confirmComplete"
            />
        </template>
    </Dialog>

    <Dialog
        v-model:visible="showCancelDialog"
        modal
        header="Cancel Maintenance Request"
        class="w-full max-w-lg"
    >
        <p class="mb-4">Enter a cancellation reason for the customer.</p>
        <Textarea
            v-model="cancellationReason"
            rows="4"
            class="w-full"
            placeholder="Cancellation reason..."
        />
        <template #footer>
            <Button label="Back" severity="secondary" text @click="showCancelDialog = false" />
            <Button
                label="Cancel Request"
                severity="danger"
                :loading="workflowLoading.cancel"
                @click="confirmCancel"
            />
        </template>
    </Dialog>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Loading from '@/components/global/Loading.vue';
import StatusBadge from '@/components/global/StatusBadge.vue';
import RejectContractDialog from '@/components/admin/contracts/RejectContractDialog.vue';
import useShowMaintenanceRequest from './useShowMaintenanceRequest';

export default defineComponent({
    name: 'ShowMaintenanceRequest',
    components: {
        Button,
        Calendar,
        Column,
        DataTable,
        Dialog,
        InputText,
        InputNumber,
        Textarea,
        Loading,
        StatusBadge,
        RejectContractDialog,
    },
    setup() {
        return useShowMaintenanceRequest();
    },
});
</script>

<style scoped>
.maintenance-timeline {
    --timeline-dot: 1.55rem;
    --timeline-steps: 4;
    --timeline-progress: 0;
    position: relative;
    margin-top: 0;
    padding: 0;
}

.maintenance-timeline__rail {
    position: relative;
    z-index: 0;
    height: var(--timeline-dot);
    margin: 0;
    padding: 0;
    overflow: hidden;
    pointer-events: none;
}

.maintenance-timeline__track,
.maintenance-timeline__progress,
.maintenance-timeline__flow {
    position: absolute;
    top: 50%;
    left: calc(100% / (2 * var(--timeline-steps)));
    width: calc(100% * (var(--timeline-steps) - 1) / var(--timeline-steps));
    height: 2px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 999px;
    transform: translateY(-50%);
    line-height: 0;
    font-size: 0;
}

.maintenance-timeline__track {
    background: var(--admin-border);
}

.maintenance-timeline__progress {
    width: calc(
        100% * (var(--timeline-steps) - 1) / var(--timeline-steps) * var(--timeline-progress)
    );
    background: var(--admin-primary);
    transition: width 0.2s ease;
}

.maintenance-timeline__flow {
    left: calc(
        (100% / (2 * var(--timeline-steps)))
        + (100% * (var(--timeline-steps) - 1) / var(--timeline-steps) * var(--timeline-progress))
    );
    width: calc(100% / var(--timeline-steps));
    overflow: hidden;
    background: color-mix(in srgb, var(--admin-primary) 22%, var(--admin-border));
}

.maintenance-timeline__flow::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 42%;
    height: 100%;
    border-radius: 999px;
    transform: translate(-20%, -50%);
    background: linear-gradient(
        90deg,
        transparent 0%,
        color-mix(in srgb, var(--admin-primary) 45%, transparent) 30%,
        color-mix(in srgb, var(--admin-primary) 90%, #fff) 50%,
        color-mix(in srgb, var(--admin-primary) 45%, transparent) 70%,
        transparent 100%
    );
    animation: maintenance-timeline-flow 2.8s ease-in-out infinite;
}

@keyframes maintenance-timeline-flow {
    0% {
        transform: translate(-35%, -50%);
        opacity: 0.35;
    }

    50% {
        opacity: 0.95;
    }

    100% {
        transform: translate(175%, -50%);
        opacity: 0.35;
    }
}

@media (prefers-reduced-motion: reduce) {
    .maintenance-timeline__flow::after {
        animation: none;
        left: 0;
        width: 100%;
        transform: none;
        opacity: 0.55;
        background: color-mix(in srgb, var(--admin-primary) 55%, transparent);
    }
}

.maintenance-timeline__nodes {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    margin-top: calc(var(--timeline-dot) * -1);
    padding: 0;
}

.maintenance-timeline__step {
    flex: 1 1 0;
    min-width: 0;
    text-align: center;
}

.maintenance-timeline__dot {
    width: var(--timeline-dot);
    height: var(--timeline-dot);
    margin: 0 auto 0.4rem;
    border-radius: 999px;
    border: 2px solid var(--admin-border);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--admin-surface, #111);
    color: #fff;
    font-size: 0.7rem;
    box-sizing: border-box;
}

.maintenance-timeline__step.is-reached .maintenance-timeline__dot {
    border-color: var(--admin-primary);
    background: var(--admin-primary);
}

.maintenance-timeline__label {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--admin-text-muted);
}

.maintenance-timeline__step.is-reached .maintenance-timeline__label {
    color: inherit;
}

.maintenance-timeline__detail,
.maintenance-timeline__at {
    margin: 0.1rem 0 0;
    font-size: 0.75rem;
    line-height: 1.35;
    color: var(--admin-text-muted);
}
</style>
