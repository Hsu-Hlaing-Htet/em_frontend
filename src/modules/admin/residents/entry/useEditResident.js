import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { GENDER_OPTIONS } from '@/constants/constant';
import { useResidentStore } from '../store';
import { formatDate, parseDate } from '@/utils/formatter';
import { showApiErrorToast } from '@/utils/apiError';

export default function useEditResident() {
    const store = useResidentStore();
    const router = useRouter();
    const route = useRoute();
    const confirm = useConfirm();
    const isLoading = ref(true);
    const errors = new Errors();
    const submitted = ref(false);

    const state = reactive({
        id: null,
        name: '',
        email: '',
        password: '',
        phone: '',
        nrc: '',
        dob: null,
        gender: null,
        address: '',
        avatar_path: '',
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchResident();
        }
    });

    onMounted(() => {
        fetchResident();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const fetchResident = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, {
                    id: response.data.id,
                    name: response.data.name || '',
                    email: response.data.email || '',
                    password: '',
                    phone: response.data.phone || '',
                    nrc: response.data.nrc || '',
                    dob: parseDate(response.data.dob),
                    gender: response.data.gender || null,
                    address: response.data.address || '',
                    avatar_path: response.data.avatar_path || '',
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load resident.');
        } finally {
            isLoading.value = false;
        }
    };

    const showConfirmDialog = (id) => {
        confirm.require({
            message: 'Are you sure you want to delete this resident?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, delete it',
            rejectLabel: 'Cancel',
            acceptClass: 'p-button-danger',
            rejectClass: 'p-button-danger p-button-text',
            accept: () => deleteResident(id),
        });
    };

    const deleteResident = async (id) => {
        isLoading.value = true;

        try {
            await store.delete({ id });
            const response = store.getDeleteResponse;

            if (response) {
                await router.push({ name: 'residentList' });
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to delete this resident.');
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
                dob: formatDate(state.dob),
            };

            if (!payload.password) {
                delete payload.password;
            }

            await store.update(payload);
            const response = store.getUpdateResponse;

            if (response) {
                await router.push({ name: 'residentList' });
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
                showApiErrorToast(error, 'Unable to save resident.');
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
        genderOptions: GENDER_OPTIONS,
    };
}
