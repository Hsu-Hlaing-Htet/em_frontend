import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { downloadBlob } from '@/utils/downloadFile';
import { showApiErrorToast } from '@/utils/apiError';
import { useCustomerContractStore } from '@/modules/customer/contracts/store';

export default function useCustomerShowContract() {
    const store = useCustomerContractStore();
    const route = useRoute();
    const isLoading = ref(true);
    const isDownloading = ref(false);

    const state = reactive({
        id: null,
        contract_number: '',
        type: '',
        status: '',
        building_name: '',
        room_number: '',
        contract_total: '',
        deposit_amount: '',
        start_date: '',
        end_date: '',
        payment_type: '',
    });

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
                Object.assign(state, data);
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load contract.');
        } finally {
            isLoading.value = false;
        }
    }

    async function downloadPdf() {
        isDownloading.value = true;

        try {
            const blob = await store.downloadDocument(state.id);
            downloadBlob(`${state.contract_number || 'contract'}.html`, blob);
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

    return {
        isLoading,
        isDownloading,
        state,
        downloadPdf,
    };
}
