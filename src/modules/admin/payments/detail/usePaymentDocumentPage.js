import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { showApiErrorToast } from '@/utils/apiError';
import {
    getBillingDocumentMeta,
    renderPaymentDocumentBody,
    renderPaymentDocumentLead,
} from '@/helpers/documents/renderBillingDocument';
import { usePaymentStore } from '../store';
import { usePaymentDocument } from '@/composables/admin/documents/usePaymentDocument';
import { usePaymentDocumentActions } from '@/composables/admin/documents/billingDocumentActions';
import { service } from '../service';

export default function usePaymentDocumentPage() {
    const route = useRoute();
    const store = usePaymentStore();
    const isLoading = ref(true);

    const state = reactive({
        id: null,
        invoice_id: null,
        invoice_number: '',
        payment_method_name: '',
        amount: '',
        note: '',
        payment_date: '',
        reference_number: '',
        status: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_nrc: '',
        building_name: '',
        room_number: '',
        created_by_name: '',
        approved_by_name: '',
        approved_at: '',
        created_at: '',
    });

    const { document } = usePaymentDocument(state);
    const {
        exportPdf,
        printPdf,
    } = usePaymentDocumentActions(state, () => document.value, service);

    const backRoute = computed(() => (
        route.meta.approvalContext
            ? { name: 'showPaymentApproval', params: { id: state.id } }
            : { name: 'showPayment', params: { id: state.id } }
    ));

    const loadPayment = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, response.data);
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load payment confirmation document.');
        } finally {
            isLoading.value = false;
        }
    };

    watch(() => route.params.id, (newId) => {
        if (newId) {
            loadPayment();
        }
    });

    onMounted(loadPayment);

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    return {
        isLoading,
        document,
        backRoute,
        exportPdf,
        printPdf,
        sheetProps: {
            document,
            documentTitle: 'Payment Confirmation',
            referenceLabel: 'Payment Ref.',
            getMeta: getBillingDocumentMeta,
            renderLead: renderPaymentDocumentLead,
            renderBody: renderPaymentDocumentBody,
        },
    };
}
