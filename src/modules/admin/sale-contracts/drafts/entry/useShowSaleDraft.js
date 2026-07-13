import { reactive, ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { buildFieldSections } from '@/utils/contractDocument';
import {
    downloadPdf,
    exportPdf,
    printContract,
    sendEmail,
} from '@/utils/saleContractPdf';
import { MOCK_DRAFT_CONTRACTS } from '../../mockData';
import { useContractDocument } from '../../useContractDocument';

export default function useShowSaleDraft() {
    const route = useRoute();
    const isLoading = ref(true);

    const state = reactive({
        id: null,
        contract_no: '',
        customer_name: '',
        customer_nrc: '',
        customer_phone: '',
        customer_email: '',
        building_name: '',
        room_number: '',
        room_price: 0,
        deposit: 0,
        payment_plan: '',
        payment_type: '',
        duration_months: 0,
        contract_total: 0,
        start_date: '',
        billing_day: 0,
        remarks: '',
        status: '',
        created_by: '',
        created_at: '',
        timeline: [],
    });

    const { document } = useContractDocument(state);
    const fieldSections = computed(() => buildFieldSections(document.value));
    const editRoute = computed(() => (
        state.id
            ? { name: 'editSaleContractDraft', params: { id: state.id } }
            : null
    ));
    const backRoute = { name: 'saleContractDraftList' };
    const contractPdfRoute = computed(() => (
        state.id
            ? { name: 'saleContractDraftPdf', params: { id: state.id } }
            : null
    ));
    const pdfBackRoute = computed(() => (
        state.id
            ? { name: 'showSaleContractDraft', params: { id: state.id } }
            : backRoute
    ));

    const fetchDraft = async () => {
        isLoading.value = true;

        await new Promise((resolve) => {
            setTimeout(resolve, 200);
        });

        const draft = MOCK_DRAFT_CONTRACTS.find((item) => item.id === Number(route.params.id));

        if (draft) {
            Object.assign(state, {
                ...draft,
                timeline: [
                    { label: 'Draft Created', date: draft.created_at, actor: draft.created_by },
                ],
            });
        }

        isLoading.value = false;
    };

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchDraft();
        }
    });

    onMounted(fetchDraft);

    return {
        isLoading,
        document,
        fieldSections,
        editRoute,
        contractPdfRoute,
        pdfBackRoute,
        backRoute,
        downloadPdf,
        exportPdf,
        printContract,
        sendEmail,
    };
}
