import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { UTILITY_RATE_STATUS_OPTIONS } from '@/constants/constant';
import { useUtilityRateStore } from '../store';
import { useUtilityTypeStore } from '@/modules/admin/utility-types/store';
import { toActiveOptions } from '@/utils/activeOptions';
import { formatDate, parseDate } from '@/utils/formatter';
import { showApiErrorToast } from '@/utils/apiError';

export default function useEditUtilityRate() {
    const store = useUtilityRateStore();
    const utilityTypeStore = useUtilityTypeStore();
    const router = useRouter();
    const route = useRoute();
    const confirm = useConfirm();
    const isLoading = ref(true);
    const errors = new Errors();
    const submitted = ref(false);
    const utilityTypeOptions = ref([]);

    const state = reactive({
        id: null,
        utility_type_id: null,
        unit_price: 0,
        effective_date: null,
        status: 'active',
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchUtilityRate();
        }
    });

    const loadUtilityTypeOptions = () => {
        const response = utilityTypeStore.getAllResponse;

        if (response?.data?.data) {
            utilityTypeOptions.value = toActiveOptions(
                response.data.data,
                state.utility_type_id,
            );
        }
    };

    onMounted(async () => {
        try {
            await utilityTypeStore.fetchAll({ per_page: 100, status: 'active' });
            await fetchUtilityRate();
            loadUtilityTypeOptions();
        } catch (error) {
            showApiErrorToast(error, 'Unable to load utility rate form data.');
            isLoading.value = false;
        }
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
        utilityTypeStore.$reset();
        utilityTypeStore.$dispose();
    });

    const fetchUtilityRate = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, {
                    id: response.data.id,
                    utility_type_id: response.data.utility_type_id,
                    unit_price: Number(response.data.unit_price),
                    effective_date: parseDate(response.data.effective_date),
                    status: response.data.status || 'active',
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load utility rate.');
        } finally {
            isLoading.value = false;
        }
    };

    const showConfirmDialog = (id) => {
        confirm.require({
            message: 'Are you sure you want to delete this utility rate?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, delete it',
            rejectLabel: 'Cancel',
            acceptClass: 'p-button-danger',
            rejectClass: 'p-button-danger p-button-text',
            accept: () => deleteUtilityRate(id),
        });
    };

    const deleteUtilityRate = async (id) => {
        isLoading.value = true;

        try {
            await store.delete({ id });
            const response = store.getDeleteResponse;

            if (response) {
                await router.push({ name: 'utilityRateList' });
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to delete this utility rate.');
        } finally {
            isLoading.value = false;
        }
    };

    const handleSubmit = async () => {
        isLoading.value = true;
        errors.clear();

        try {
            const payload = {
                ...state,
                effective_date: formatDate(state.effective_date),
            };

            await store.update(payload);
            const response = store.getUpdateResponse;

            if (response) {
                await router.push({ name: 'utilityRateList' });
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });
            }
        } catch (error) {
            if (error.status === 422) {
                errors.record(error.data.data);
            } else {
                showApiErrorToast(error, 'Unable to save utility rate.');
            }
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        handleSubmit,
        showConfirmDialog,
        submitted,
        errors,
        state,
        statusOptions: UTILITY_RATE_STATUS_OPTIONS,
        utilityTypeOptions,
    };
}
