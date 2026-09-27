import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { showApiErrorToast } from '@/utils/apiError';
import {
    getBillingDocumentMeta,
    renderUtilityDocumentBody,
    renderUtilityDocumentLead,
} from '@/helpers/documents/renderBillingDocument';
import { useUtilityStore } from '../store';
import { useUtilityDocument } from '@/composables/admin/documents/useUtilityDocument';
import { useUtilityDocumentActions } from '@/composables/admin/documents/billingDocumentActions';
import { buildDocumentEmailRecipients } from '@/helpers/documents/buildDocumentEmailRecipients';
import { formatUtilityReference } from '@/helpers/documents/billingDocumentHelpers';
import { service } from '../service';

export default function useUtilityDocumentPage() {
    const route = useRoute();
    const store = useUtilityStore();
    const isLoading = ref(true);
    const showSendEmailDialog = ref(false);
    const isSendingEmail = ref(false);

    const state = reactive({
        id: null,
        room_id: null,
        room_number: '',
        building_name: '',
        billing_month: '',
        total_amount: '',
        status: '',
        items: [],
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        customer_nrc: '',
        created_by_name: '',
        approved_by_name: '',
        approved_at: '',
        created_at: '',
    });

    const { document } = useUtilityDocument(state);
    const {
        downloadPdf,
        exportPdf,
        printPdf,
        sendEmail: sendDocumentEmail,
    } = useUtilityDocumentActions(state, () => document.value, service);

    const isApprovalView = computed(() => route.meta.approvalContext === true);
    const canSendUtility = computed(() => (
        !isApprovalView.value
        && Boolean(state.id)
        && String(state.status || '').toLowerCase() === 'approved'
    ));
    const emailRecipients = computed(() => buildDocumentEmailRecipients(state));
    const utilityReference = computed(() => formatUtilityReference(state));
    const backRoute = computed(() => (
        isApprovalView.value
            ? { name: 'showUtilityApproval', params: { id: state.id } }
            : { name: 'showUtility', params: { id: state.id } }
    ));

    const openSendEmailDialog = () => {
        showSendEmailDialog.value = true;
    };

    const confirmSendEmail = async () => {
        if (isSendingEmail.value) {
            return;
        }

        isSendingEmail.value = true;

        try {
            await sendDocumentEmail();
            showSendEmailDialog.value = false;
        } finally {
            isSendingEmail.value = false;
        }
    };

    const loadUtility = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, response.data, {
                    items: response.data.items || [],
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load utility bill document.');
        } finally {
            isLoading.value = false;
        }
    };

    watch(() => route.params.id, (newId) => {
        if (newId) {
            loadUtility();
        }
    });

    onMounted(loadUtility);

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    return {
        isLoading,
        isApprovalView,
        canSendUtility,
        document,
        backRoute,
        downloadPdf,
        exportPdf,
        printPdf,
        showSendEmailDialog,
        isSendingEmail,
        emailRecipients,
        utilityReference,
        openSendEmailDialog,
        confirmSendEmail,
        sheetProps: {
            document,
            documentTitle: 'Utility Bill',
            referenceLabel: 'Bill No.',
            getMeta: getBillingDocumentMeta,
            renderLead: renderUtilityDocumentLead,
            renderBody: renderUtilityDocumentBody,
        },
    };
}
