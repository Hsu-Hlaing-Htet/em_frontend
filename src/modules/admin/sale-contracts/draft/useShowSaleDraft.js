import { reactive, ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { buildFieldSections } from '@/helpers/contracts/contractDocument';
import { showApiErrorToast } from '@/utils/apiError';
import { useSaleContractDraftStore } from '../store';
import { mapSaleDraftFromApi } from './mapSaleDraft';
import { useContractDocument } from '@/composables/admin/documents/useSaleContractDocument';
import { useSaleContractDocumentActions } from '@/composables/admin/contracts/contractDocumentActions';

export default function useShowSaleDraft() {
    const route = useRoute();
    const store = useSaleContractDraftStore();
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
        duration_months: null,
        contract_total: 0,
        start_date: '',
        billing_day: null,
        remarks: '',
        status: '',
        created_by: '',
        created_at: '',
        remaining_balance: 0,
        interest_percentage: 0,
        total_installment_amount: 0,
        estimated_monthly_payment: 0,
        timeline: [],
    });

    const { document } = useContractDocument(state);
    const {
        downloadPdf,
    } = useSaleContractDocumentActions('draft', state, () => document.value);
    const fieldSections = computed(() => buildFieldSections(document.value));
    const contractStatus = computed(() => state.status || '');
    const editRoute = computed(() => (
        state.id
            ? { name: 'editSaleContractDraft', params: { id: state.id } }
            : null
    ));
    const backRoute = { name: 'saleContractDraftList' };

    const fetchDraft = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;
            const mapped = mapSaleDraftFromApi(response?.data);

            if (mapped) {
                Object.assign(state, {
                    ...mapped,
                    timeline: [
                        {
                            label: 'Draft Created',
                            date: mapped.created_at,
                            actor: mapped.created_by,
                        },
                    ],
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load sale contract draft.');
        } finally {
            isLoading.value = false;
        }
    };

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchDraft();
        }
    });

    onMounted(fetchDraft);

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    return {
        isLoading,
        state,
        contractStatus,
        document,
        fieldSections,
        editRoute,
        backRoute,
        downloadPdf,
    };
}
