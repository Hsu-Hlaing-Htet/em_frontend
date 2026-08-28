import { reactive, ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { showApiErrorToast } from '@/utils/apiError';
import { GENDER_OPTIONS } from '@/constants/constant';
import { useResidentStore } from '../store';
import { formatDate } from '@/utils/formatter';
import { findDuplicateAccountEmailError } from '@/helpers/accounts/accountUniqueness';

export default function useNewResident() {
    const store = useResidentStore();
    const router = useRouter();
    const isLoading = ref(false);
    const errors = new Errors();
    const submitted = ref(false);

    const state = reactive({
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

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const handleSubmit = async () => {
        errors.clear();

        if (!applyValidation(errors, state, [
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
                await router.push({ name: 'residentList' });
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message || 'Resident created. A welcome email with a temporary password was sent.',
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
        submitted,
        errors,
        state,
        genderOptions: GENDER_OPTIONS,
    };
}
