import { reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { showApiErrorToast } from '@/utils/apiError';
import { useRoleStore } from '@/modules/admin/roles/store';
import { GENDER_OPTIONS } from '@/constants/constant';
import { useStaffStore } from '../store';
import { formatDate } from '@/utils/formatter';

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
        password: '',
        phone: '',
        nrc: '',
        dob: null,
        gender: null,
        address: '',
        avatar_path: '',
    });

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
        isLoading.value = true;
        errors.clear();

        try {
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
        submitted,
        errors,
        state,
        roleOptions,
        genderOptions: GENDER_OPTIONS,
    };
}
