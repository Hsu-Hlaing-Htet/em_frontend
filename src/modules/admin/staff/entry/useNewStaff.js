import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { showApiErrorToast } from '@/utils/apiError';
import { GENDER_OPTIONS, STAFF_ROLE_NAMES } from '@/constants/constant';
import { useStaffStore } from '../store';
import { useRoleStore } from '@/modules/admin/roles/store';
import { formatRoleName } from '@/utils/formatter';
import { formatDate } from '@/utils/formatter';
import { findDuplicateAccountEmailError } from '@/helpers/accounts/accountUniqueness';

export default function useNewStaff() {
    const store = useStaffStore();
    const roleStore = useRoleStore();
    const roleOptions = ref([]);
    const router = useRouter();
    const isLoading = ref(false);
    const errors = new Errors();
    const submitted = ref(false);

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
        await roleStore.fetchAll({ per_page: 100 });
        roleOptions.value = (roleStore.getAllResponse?.data?.data || [])
            .filter((role) => STAFF_ROLE_NAMES.includes(role.name))
            .map((role) => ({ label: formatRoleName(role.name), value: role.id }));
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
        roleStore.$reset();
        roleStore.$dispose();
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
                    detail: response.message || 'Staff member created.',
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
