import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { showApiErrorToast } from '@/utils/apiError';
import { useCustomerMaintenanceRequestStore } from '@/modules/customer/maintenance-requests/store';

const mapCustomerStatus = (status) => {
    if (status === 'accepted') {
        return 'pending';
    }

    if (status === 'rejected') {
        return 'cancelled';
    }

    return status || 'pending';
};

export default function useCustomerShowMaintenanceRequest() {
    const store = useCustomerMaintenanceRequestStore();
    const route = useRoute();
    const isLoading = ref(true);

    const state = reactive({
        id: null,
        request_number: '',
        room_id: null,
        room_number: '',
        building_name: '',
        title: '',
        category: '',
        priority: '',
        description: '',
        status: '',
        customer_status: '',
        rejection_reason: '',
        cancellation_reason: '',
        resolution_note: '',
        completion_note: '',
        assigned_staff: '',
        visit_date: '',
        attachment_url: '',
        status_history: [],
        approved_by_name: '',
        approved_at: '',
        created_at: '',
        updated_at: '',
    });

    const customerStatus = computed(() => state.customer_status || mapCustomerStatus(state.status));
    const isCompleted = computed(() => customerStatus.value === 'completed');
    const isCancelled = computed(() => customerStatus.value === 'cancelled');
    const isInProgress = computed(() => customerStatus.value === 'in_progress');
    const isRejected = computed(() => {
        if (customerStatus.value !== 'cancelled') {
            return false;
        }

        const history = Array.isArray(state.status_history) ? state.status_history : [];
        const reachedInProgress = history.some((item) => item.status === 'in_progress')
            || Boolean(state.assigned_staff);

        return !reachedInProgress;
    });
    const statusBadgeValue = computed(() => (isRejected.value ? 'rejected' : customerStatus.value));
    const showProgressTimeline = computed(() => !isRejected.value);
    const showUpdatedHistory = computed(() => !isRejected.value);
    const rejectionOrCancellationReason = computed(() => (
        state.rejection_reason || state.cancellation_reason || ''
    ));

    const visibleHistory = computed(() => {
        const history = Array.isArray(state.status_history) ? state.status_history : [];

        return history
            .filter((item) => item.status !== 'accepted')
            .map((item) => ({
                ...item,
                status: mapCustomerStatus(item.status),
            }));
    });

    const adminUpdateText = computed(() => {
        if (!isInProgress.value) {
            return '';
        }

        const latestUpdate = [...visibleHistory.value]
            .reverse()
            .find((item) => item.status === 'in_progress' && String(item.remarks || '').trim());

        if (latestUpdate?.remarks) {
            return String(latestUpdate.remarks).trim();
        }

        if (!state.assigned_staff) {
            return '';
        }

        return state.visit_date
            ? `Assigned to ${state.assigned_staff} (visit ${state.visit_date})`
            : `Assigned to ${state.assigned_staff}`;
    });

    const statusRemark = computed(() => {
        if (isRejected.value) {
            const text = rejectionOrCancellationReason.value.trim();

            return text
                ? { tone: 'danger', labelKey: 'customer.rejectionReason', text }
                : null;
        }

        if (isCompleted.value) {
            const text = String(state.completion_note || state.resolution_note || '').trim();

            return text
                ? { tone: 'success', labelKey: 'customer.completionNote', text }
                : null;
        }

        if (isInProgress.value) {
            const text = adminUpdateText.value.trim();

            return text
                ? { tone: 'accent', labelKey: 'customer.adminUpdate', text }
                : null;
        }

        if (isCancelled.value) {
            const text = rejectionOrCancellationReason.value.trim();

            return text
                ? { tone: 'danger', labelKey: 'customer.cancellationReason', text }
                : null;
        }

        return null;
    });

    const timelineSteps = computed(() => {
        const status = customerStatus.value;
        const rawHistory = Array.isArray(state.status_history) ? state.status_history : [];
        const history = visibleHistory.value;
        const findAt = (...statuses) => history.find((item) => statuses.includes(item.status))?.at || null;
        const hasRawStatus = (...statuses) => rawHistory.some((item) => statuses.includes(item.status));

        const pendingStep = {
            key: 'pending',
            label: 'Pending',
            reached: true,
            detail: 'Request submitted',
            at: findAt('pending') || state.created_at,
        };

        const inProgressStep = {
            key: 'in_progress',
            label: 'In Progress',
            reached: true,
            detail: 'Team / staff assigned',
            at: findAt('in_progress') || state.visit_date || state.approved_at,
        };

        if (status === 'pending') {
            return [
                pendingStep,
                {
                    key: 'in_progress',
                    label: 'In Progress',
                    reached: false,
                    detail: 'Team / staff assigned',
                    at: null,
                },
                {
                    key: 'final',
                    label: 'Final',
                    reached: false,
                    detail: 'Final state',
                    at: null,
                },
            ];
        }

        if (status === 'in_progress') {
            return [
                pendingStep,
                inProgressStep,
                {
                    key: 'final',
                    label: 'Final',
                    reached: false,
                    detail: 'Final state',
                    at: null,
                },
            ];
        }

        if (status === 'completed') {
            return [
                pendingStep,
                inProgressStep,
                {
                    key: 'completed',
                    label: 'Completed',
                    reached: true,
                    detail: 'Request completed',
                    at: findAt('completed') || state.approved_at,
                },
            ];
        }

        if (status === 'cancelled') {
            const reachedInProgress = hasRawStatus('in_progress') || Boolean(state.assigned_staff);
            const endAt = findAt('cancelled') || state.approved_at;

            if (!reachedInProgress) {
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

            return [
                pendingStep,
                inProgressStep,
                {
                    key: 'cancelled',
                    label: 'Cancelled',
                    reached: true,
                    detail: 'Request cancelled',
                    at: endAt,
                },
            ];
        }

        return [pendingStep];
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

    const fetchRequest = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, response.data);
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load maintenance request.');
        } finally {
            isLoading.value = false;
        }
    };

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchRequest();
        }
    });

    onMounted(fetchRequest);

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    return {
        isLoading,
        state,
        customerStatus,
        isCompleted,
        isCancelled,
        isInProgress,
        isRejected,
        statusBadgeValue,
        showProgressTimeline,
        showUpdatedHistory,
        rejectionOrCancellationReason,
        statusRemark,
        visibleHistory,
        timelineSteps,
        timelineProgress,
        timelineFlowActive,
        mapCustomerStatus,
    };
}
