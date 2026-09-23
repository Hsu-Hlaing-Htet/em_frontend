import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { showApiErrorToast } from '@/utils/apiError';
import { useMaintenanceRequestStore } from '../store';

export default function useShowMaintenanceRequest() {
    const store = useMaintenanceRequestStore();
    const route = useRoute();
    const isLoading = ref(true);
    const workflowLoading = ref({
        accept: false,
        assign: false,
        complete: false,
        reject: false,
        cancel: false,
    });
    const showRejectDialog = ref(false);
    const showCompleteDialog = ref(false);
    const showCancelDialog = ref(false);
    const resolutionNote = ref('');
    const maintenanceFeeAmount = ref(null);
    const chargeDescription = ref('');
    const cancellationReason = ref('');
    const assignForm = reactive({
        assigned_staff: '',
        visit_date: null,
    });

    const state = reactive({
        id: null,
        request_number: '',
        room_id: null,
        room_number: '',
        building_name: '',
        user_id: null,
        user_name: '',
        customer_name: '',
        contact_number: '',
        title: '',
        category: '',
        priority: '',
        description: '',
        status: '',
        rejection_reason: '',
        cancellation_reason: '',
        resolution_note: '',
        completion_note: '',
        maintenance_category_id: null,
        maintenance_category_name: '',
        maintenance_fee_amount: null,
        charge_description: '',
        invoice_id: null,
        invoice_number: '',
        assigned_staff: '',
        visit_date: '',
        attachment_url: '',
        status_history: [],
        approved_by_name: '',
        approved_at: '',
        created_at: '',
        updated_at: '',
    });

    const canAccept = computed(() => state.status === 'pending');
    const canReject = computed(() => ['pending', 'in_progress'].includes(state.status));
    // Backend has no accepted/assign persistence — Accept starts work (in_progress).
    const canAssign = computed(() => false);
    const canWorkDone = computed(() => state.status === 'in_progress');
    const canCancel = computed(() => state.status === 'in_progress');
    const isPending = computed(() => state.status === 'pending');
    const isRejected = computed(() => {
        if (state.status !== 'rejected') {
            return false;
        }

        const history = Array.isArray(state.status_history) ? state.status_history : [];
        const reachedInProgress = history.some((item) => item.status === 'in_progress')
            || Boolean(state.assigned_staff);

        // Rejected before work started → Rejected. After in_progress cancel → Cancelled.
        return !reachedInProgress;
    });
    const statusBadgeValue = computed(() => {
        if (state.status === 'rejected') {
            return isRejected.value ? 'rejected' : 'cancelled';
        }

        return state.status;
    });
    const showPostAcceptPanels = computed(() => (
        !isPending.value
        && state.status !== 'rejected'
        && Boolean(state.status)
    ));
    const showAssignmentForm = computed(() => false);
    const showInProgressActions = computed(() => state.status === 'in_progress');
    const showAssignedStaff = computed(() => Boolean(state.assigned_staff)
        || ['in_progress', 'completed'].includes(state.status));
    const rejectionOrCancellationReason = computed(() => (
        state.rejection_reason || state.cancellation_reason || ''
    ));

    const timelineSteps = computed(() => {
        const status = state.status === 'rejected' ? 'cancelled' : state.status;
        const history = Array.isArray(state.status_history) ? state.status_history : [];
        const findAt = (...statuses) => history.find((item) => statuses.includes(item.status))?.at || null;
        const hasStatus = (...statuses) => history.some((item) => statuses.includes(item.status));

        const acceptedReached = ['accepted', 'in_progress', 'completed'].includes(status)
            || (status === 'cancelled' && (hasStatus('accepted') || hasStatus('in_progress') || Boolean(state.assigned_staff)));
        const inProgressReached = ['in_progress', 'completed'].includes(status)
            || (status === 'cancelled' && (hasStatus('in_progress') || Boolean(state.assigned_staff)));
        const completedReached = status === 'completed';

        const normalPath = [
            {
                key: 'pending',
                label: 'Pending',
                reached: true,
                detail: 'Request submitted',
                at: findAt('pending') || state.created_at,
            },
            {
                key: 'accepted',
                label: 'Accepted',
                reached: acceptedReached,
                detail: 'Ready for assignment',
                at: acceptedReached ? (findAt('accepted') || state.approved_at) : null,
            },
            {
                key: 'in_progress',
                label: 'In Progress',
                reached: inProgressReached,
                detail: state.assigned_staff ? `Assigned: ${state.assigned_staff}` : 'Team / staff assigned',
                at: inProgressReached
                    ? (findAt('in_progress') || state.visit_date || state.approved_at)
                    : null,
            },
            {
                key: 'completed',
                label: 'Completed',
                reached: completedReached,
                detail: 'Request completed',
                at: completedReached ? (findAt('completed') || state.approved_at) : null,
            },
        ];

        if (['accepted', 'in_progress', 'completed'].includes(status)) {
            return normalPath;
        }

        if (status === 'cancelled') {
            const endAt = findAt('cancelled', 'rejected') || state.approved_at;
            const pendingStep = normalPath[0];

            if (!acceptedReached) {
                return [
                    pendingStep,
                    {
                        key: 'rejected',
                        label: 'Rejected',
                        reached: true,
                        detail: 'Request rejected',
                        at: endAt,
                    },
                ];
            }

            if (!inProgressReached) {
                return [
                    pendingStep,
                    {
                        ...normalPath[1],
                        reached: true,
                        at: findAt('accepted') || state.approved_at,
                    },
                    {
                        key: 'rejected',
                        label: 'Rejected',
                        reached: true,
                        detail: 'Request rejected',
                        at: endAt,
                    },
                ];
            }

            return [
                pendingStep,
                {
                    ...normalPath[1],
                    reached: true,
                    at: findAt('accepted') || state.approved_at,
                },
                {
                    ...normalPath[2],
                    reached: true,
                    at: findAt('in_progress') || state.visit_date || state.approved_at,
                },
                {
                    key: 'cancelled',
                    label: 'Cancelled',
                    reached: true,
                    detail: 'Request cancelled',
                    at: endAt,
                },
            ];
        }

        return [normalPath[0]];
    });

    const timelineProgress = computed(() => {
        const steps = timelineSteps.value;

        if (steps.length <= 1) {
            return 0;
        }

        const lastReachedIndex = steps.reduce(
            (lastIndex, step, index) => (step.reached ? index : lastIndex),
            0,
        );

        return (lastReachedIndex / (steps.length - 1)) * 100;
    });

    const timelineFlowActive = computed(() => {
        const steps = timelineSteps.value;

        if (steps.length <= 1) {
            return false;
        }

        const lastReachedIndex = steps.reduce(
            (lastIndex, step, index) => (step.reached ? index : lastIndex),
            0,
        );

        return lastReachedIndex < steps.length - 1;
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchRequest();
        }
    });

    onMounted(() => {
        fetchRequest();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const fetchRequest = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, response.data);
                assignForm.assigned_staff = response.data.assigned_staff || '';
                assignForm.visit_date = response.data.visit_date
                    ? new Date(`${response.data.visit_date}T00:00:00`)
                    : null;
            }
        } finally {
            isLoading.value = false;
        }
    };

    const openRejectDialog = () => {
        showRejectDialog.value = true;
    };

    const openCompleteDialog = () => {
        resolutionNote.value = '';
        maintenanceFeeAmount.value = null;
        chargeDescription.value = '';
        showCompleteDialog.value = true;
    };

    const openCancelDialog = () => {
        cancellationReason.value = '';
        showCancelDialog.value = true;
    };

    const confirmReject = async (reason) => {
        await runWorkflow('reject', { rejection_reason: reason });
    };

    const confirmComplete = async () => {
        const note = resolutionNote.value.trim();
        const fee = Number(maintenanceFeeAmount.value || 0);
        const charge = chargeDescription.value.trim();

        if (!note) {
            EventBus.emit('show-toast', {
                severity: 'warn',
                summary: '',
                detail: 'Completion note is required.',
            });

            return;
        }

        if (fee > 0 && !charge) {
            EventBus.emit('show-toast', {
                severity: 'warn',
                summary: '',
                detail: 'Charge description is required when a maintenance fee is charged.',
            });

            return;
        }

        showCompleteDialog.value = false;
        await runWorkflow('complete', {
            resolution_note: note,
            maintenance_fee_amount: fee,
            charge_description: fee > 0 ? charge : null,
        });
    };

    const confirmCancel = async () => {
        const reason = cancellationReason.value.trim();

        if (!reason) {
            EventBus.emit('show-toast', {
                severity: 'warn',
                summary: '',
                detail: 'Cancellation reason is required.',
            });

            return;
        }

        showCancelDialog.value = false;
        await runWorkflow('cancel', {
            cancellation_reason: reason,
        });
    };

    const submitAssign = async () => {
        if (!assignForm.assigned_staff?.trim() || !assignForm.visit_date) {
            EventBus.emit('show-toast', {
                severity: 'warn',
                summary: '',
                detail: 'Assign team/staff and visit date are required.',
            });

            return;
        }

        const visitDate = assignForm.visit_date instanceof Date
            ? [
                assignForm.visit_date.getFullYear(),
                String(assignForm.visit_date.getMonth() + 1).padStart(2, '0'),
                String(assignForm.visit_date.getDate()).padStart(2, '0'),
            ].join('-')
            : String(assignForm.visit_date).slice(0, 10);

        await runWorkflow('assign', {
            assigned_staff: assignForm.assigned_staff.trim(),
            visit_date: visitDate,
        });
    };

    const runWorkflow = async (action, payload = {}) => {
        workflowLoading.value[action] = true;

        try {
            await store[action]({ id: state.id, ...payload });
            const response = store.getActionResponse;

            if (response) {
                Object.assign(state, response.data);
                EventBus.emit('show-toast', {
                    severity: ['reject', 'cancel'].includes(action) ? 'warn' : 'success',
                    summary: '',
                    detail: response.message,
                });
            }
        } catch (error) {
            showApiErrorToast(error, `Unable to ${action} maintenance request.`);
        } finally {
            workflowLoading.value[action] = false;
        }
    };

    return {
        isLoading,
        state,
        assignForm,
        workflowLoading,
        showRejectDialog,
        showCompleteDialog,
        showCancelDialog,
        resolutionNote,
        maintenanceFeeAmount,
        chargeDescription,
        cancellationReason,
        timelineSteps,
        timelineProgress,
        timelineFlowActive,
        canAccept,
        canReject,
        canAssign,
        canWorkDone,
        canCancel,
        isPending,
        isRejected,
        statusBadgeValue,
        showPostAcceptPanels,
        showAssignmentForm,
        showInProgressActions,
        showAssignedStaff,
        rejectionOrCancellationReason,
        openRejectDialog,
        openCompleteDialog,
        openCancelDialog,
        confirmReject,
        confirmComplete,
        confirmCancel,
        submitAssign,
        runWorkflow,
    };
}
