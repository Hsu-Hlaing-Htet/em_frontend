import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { showApiErrorToast } from '@/utils/apiError';
import {
    getBillingDocumentMeta,
    renderReceiptDocumentBody,
    renderReceiptDocumentLead,
} from '@/helpers/documents/renderBillingDocument';
import { useReceiptStore } from '../store';
import { useReceiptDocument } from '@/composables/admin/documents/useReceiptDocument';
import { useReceiptDocumentActions } from '@/composables/admin/documents/billingDocumentActions';
import { service } from '../service';

export default function useReceiptDocumentPage() {
    const route = useRoute();
    const store = useReceiptStore();
    const isLoading = ref(true);

    const state = reactive({
        id: null,
        receipt_number: '',
        payment_id: null,
        status: '',
        issued_at: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_nrc: '',
        invoice_number: '',
        payment_amount: '',
        payment_method_name: '',
        payment_date: '',
        building_name: '',
        room_number: '',
        created_by_name: '',
        approved_by_name: '',
        created_at: '',
    });

    const { document } = useReceiptDocument(state);
    const {
        downloadPdf,
        exportPdf,
        printPdf,
        sendEmail,
    } = useReceiptDocumentActions(state, () => document.value, service);

    const backRoute = computed(() => (
        route.meta.approvalContext
            ? { name: 'showReceiptApproval', params: { id: state.id } }
            : { name: 'showReceipt', params: { id: state.id } }
    ));

    const loadReceipt = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, response.data);
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load receipt document.');
        } finally {
            isLoading.value = false;
        }
    };

    watch(() => route.params.id, (newId) => {
        if (newId) {
            loadReceipt();
        }
    });

    onMounted(loadReceipt);

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    return {
        isLoading,
        document,
        backRoute,
        downloadPdf,
        exportPdf,
        printPdf,
        printContract: printPdf,
        sendEmail,
        sheetProps: {
            document,
            documentTitle: 'Payment Receipt',
            referenceLabel: 'Receipt No.',
            getMeta: getBillingDocumentMeta,
            renderLead: renderReceiptDocumentLead,
            renderBody: renderReceiptDocumentBody,
        },
    };
}
