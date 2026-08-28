import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { showApiErrorToast } from '@/utils/apiError';
import { useContractDocument as useSaleContractDocument } from '@/composables/admin/documents/useSaleContractDocument';
import { useContractDocument as useRentContractDocument } from '@/composables/admin/documents/useRentContractDocument';
import {
    downloadContractDocumentPdf,
    downloadRentContractDocumentPdf,
    exportContractDocument,
    exportRentContractDocument,
    printContractDocument,
    printRentContractDocument,
} from '@/helpers/documents/documentOutput';
import { buildSaleTimeline, mapSaleFromApi } from '@/modules/admin/sale-contracts/mapSale';
import { buildRentTimeline, mapRentFromApi } from '@/modules/admin/rent-contracts/mapRent';
import { useCustomerContractStore } from '@/modules/customer/contracts/store';

export default function useCustomerShowContract() {
    const store = useCustomerContractStore();
    const route = useRoute();
    const isLoading = ref(true);
    const isDownloading = ref(false);

    const state = reactive({
        id: null,
        contract_no: '',
        contract_number: '',
        type: '',
        status: '',
        customer_name: '',
        customer_nrc: '',
        customer_phone: '',
        customer_email: '',
        customer_address: '',
        building_name: '',
        room_number: '',
        room_price: 0,
        deposit: 0,
        payment_plan: '',
        payment_type: '',
        duration_months: null,
        contract_total: 0,
        paid_amount: 0,
        remaining_amount: 0,
        start_date: '',
        end_date: '',
        billing_day: null,
        remarks: '',
        created_by: '',
        created_at: '',
        approved_by: '',
        approved_at: '',
        termination_date: '',
        termination_reason: '',
        timeline: [],
    });

    const saleDocument = useSaleContractDocument(state, {
        showPayment: true,
        showApproval: true,
    });
    const rentDocument = useRentContractDocument(state, {
        showPayment: true,
        showApproval: true,
    });
    const document = computed(() => (
        state.type === 'rent' ? rentDocument.document.value : saleDocument.document.value
    ));
    const documentVariant = computed(() => (state.type === 'rent' ? 'rent' : 'sale'));
    const isRentContract = () => state.type === 'rent';
    const fallbackHtmlFilename = () => `${state.contract_no || state.contract_number || 'contract'}.html`;

    onMounted(loadContract);

    watch(() => route.params.id, (newId) => {
        if (newId) {
            loadContract();
        }
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    async function loadContract() {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const data = store.getOneResponse?.data;

            if (data) {
                const mapped = data.type === 'rent'
                    ? mapRentFromApi(data)
                    : mapSaleFromApi(data);

                if (mapped) {
                    Object.assign(state, {
                        ...mapped,
                        contract_number: mapped.contract_no,
                        timeline: data.type === 'rent'
                            ? buildRentTimeline(mapped)
                            : buildSaleTimeline(mapped),
                    });
                }
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load contract.');
        } finally {
            isLoading.value = false;
        }
    }

    async function downloadPdf() {
        const currentDocument = document.value;

        if (!currentDocument) {
            return;
        }

        isDownloading.value = true;

        try {
            if (isRentContract()) {
                await downloadRentContractDocumentPdf(currentDocument);
            } else {
                await downloadContractDocumentPdf(currentDocument);
            }

            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: 'Contract document downloaded.',
            });
        } catch (error) {
            showApiErrorToast(error, 'Unable to download contract document.');
        } finally {
            isDownloading.value = false;
        }
    }

    function exportPdf() {
        const currentDocument = document.value;

        if (!currentDocument) {
            return;
        }

        try {
            if (isRentContract()) {
                exportRentContractDocument(currentDocument, fallbackHtmlFilename());
            } else {
                exportContractDocument(currentDocument, fallbackHtmlFilename());
            }

            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: 'Contract document exported.',
            });
        } catch (error) {
            showApiErrorToast(error, 'Unable to export contract document.');
        }
    }

    function printContract() {
        const currentDocument = document.value;

        if (!currentDocument) {
            return;
        }

        if (isRentContract()) {
            printRentContractDocument(currentDocument);
        } else {
            printContractDocument(currentDocument);
        }
    }

    return {
        isLoading,
        isDownloading,
        state,
        document,
        documentVariant,
        downloadPdf,
        exportPdf,
        printContract,
    };
}
