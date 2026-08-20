import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { useRoleStore } from '@/modules/admin/roles/store';
import { GENDER_OPTIONS} from '@/constants/constant';
import { useStaffStore } from '../store';
import { formatDate, parseDate } from '@/utils/formatter';
import { showApiErrorToast } from '@/utils/apiError';

const STAFF_ROLE_NAMES = ['super_admin', 'admin'];

export default function useEditStaff() {
    const store = useStaffStore();
    const roleStore = useRoleStore();
    const router = useRouter();
    const route = useRoute();
    const confirm = useConfirm();
    const isLoading = ref(true);
    const errors = new Errors();
    const submitted = ref(false);
    const roleOptions = ref([]);

    const state = reactive({
        id: null,
        role_id: null,
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

    bindErrorClearing(state, errors);

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchStaff();
        }
    });

    onMounted(async () => {
        try {
            await roleStore.fetchAll({ per_page: 100 });
            const response = roleStore.getAllResponse;

            if (response?.data?.data) {
                roleOptions.value = response.data.data
                    .filter((role) => STAFF_ROLE_NAMES.includes(role.name))
                    .map((role) => ({
                        label: role.name.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
                        value: role.id,
                    }));
            }

            await fetchStaff();
        } catch (error) {
            showApiErrorToast(error, 'Unable to load staff form data.');
            isLoading.value = false;
        }
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const fetchStaff = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, {
                    id: response.data.id,
                    role_id: response.data.role_id,
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
            showApiErrorToast(error, 'Unable to load staff member.');
        } finally {
            isLoading.value = false;
        }
    };

    const showConfirmDialog = (id) => {
        confirm.require({
            message: 'Are you sure you want to delete this staff member?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, delete it',
            rejectLabel: 'Cancel',
            acceptClass: 'p-button-danger',
            rejectClass: 'p-button-danger p-button-text',
            accept: () => deleteStaff(id),
        });
    };

    const deleteStaff = async (id) => {
        isLoading.value = true;

        try {
            await store.delete({ id });
            const response = store.getDeleteResponse;

            if (response) {
                await router.push({ name: 'staffList' });
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to delete this staff member.');
        } finally {
            isLoading.value = false;
        }
    };

    const handleSubmit = async () => {
        errors.clear();

        if (!applyValidation(errors, state, [
            { field: 'role_id', type: 'select' },
            { field: 'name', type: 'text' },
            { field: 'email', type: 'email' },
            { field: 'password', type: 'password', required: false },
            { field: 'phone', type: 'phone' },
            { field: 'nrc', type: 'text' },
            { field: 'dob', type: 'date' },
            { field: 'gender', type: 'select' },
            { field: 'address', type: 'text' },
        ])) {
            return;
        }

        isLoading.value = true;

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
                await router.push({ name: 'staffList' });
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
                showApiErrorToast(error, 'Unable to save staff member.');
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
        roleOptions,
        genderOptions: GENDER_OPTIONS,
    };
}
