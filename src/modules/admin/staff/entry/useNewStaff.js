import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { showApiErrorToast } from '@/utils/apiError';
import { useRoleStore } from '@/modules/admin/roles/store';
import { GENDER_OPTIONS } from '@/constants/constant';
import { useStaffStore } from '../store';
import { formatDate } from '@/utils/formatter';
import { findDuplicateAccountEmailError } from '@/helpers/accounts/accountUniqueness';

export default function useNewStaff() {
    const store = useStaffStore();
    const roleStore = useRoleStore();
    const router = useRouter();
    const isLoading = ref(false);
    const errors = new Errors();
    const submitted = ref(false);
    const roleOptions = ref([]);

    const state = reactive({
        role_id: null,
        name: '',
        email: '',
        phone: '',
        nrc: '',
        dob: null,
        gender: null,
        address: '',
        avatar_path: '',
    });

    bindErrorClearing(state, errors);

    onMounted(async () => {
        try {
            await roleStore.fetchAll({ per_page: 100 });
            const response = roleStore.getAllResponse;

            if (response?.data?.data) {
                roleOptions.value = response.data.data
                .filter((role) => role.name.toLowerCase() !== 'customer')
                .map((role) => ({
                    label: role.name
                        .replaceAll('_', ' ')
                        .replace(/\b\w/g, (char) => char.toUpperCase()),
                    value: role.id,
                }));
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load staff form data.');
        }
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const handleSubmit = async () => {
        errors.clear();

        if (!applyValidation(errors, state, [
            { field: 'role_id', type: 'select' },
            { field: 'name', type: 'text' },
            { field: 'email', type: 'email', accountEmail: true },
            { field: 'phone', type: 'phone' },
            { field: 'nrc', type: 'nrc' },
            { field: 'dob', type: 'date' },
            { field: 'gender', type: 'select' },
            { field: 'address', type: 'text' },
        ])) {
            return;
        }

        isLoading.value = true;

        try {
            const duplicateEmailError = await findDuplicateAccountEmailError({
                email: state.email,
            });

            if (duplicateEmailError) {
                errors.record({ email: [duplicateEmailError] });
                return;
            }

            await store.add({
                ...state,
                dob: formatDate(state.dob),
            });

            const response = store.getAddResponse;

            if (response) {
                await router.push({ name: 'staffList' });
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message || 'Staff member created. A welcome email with a temporary password was sent.',
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
        submitted,
        errors,
        state,
        roleOptions,
        genderOptions: GENDER_OPTIONS,
    };
}
