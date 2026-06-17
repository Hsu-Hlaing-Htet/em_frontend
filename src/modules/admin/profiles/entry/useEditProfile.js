import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { useProfileStore } from '../store';
import { useUserStore } from '@/modules/admin/users/store';

const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
];

export default function useEditProfile() {
    const store = useProfileStore();
    const userStore = useUserStore();
    const router = useRouter();
    const route = useRoute();
    const confirm = useConfirm();
    const isLoading = ref(true);
    const errors = new Errors();
    const userOptions = ref([]);

    const state = reactive({
        id: null,
        user_id: null,
        phone: '',
        nrc: '',
        dob: null,
        gender: null,
        address: '',
        avatar_path: '',
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchProfile();
        }
    });

    onMounted(async () => {
        await userStore.fetchAll({ per_page: 100 });

        if (userStore.getAllResponse?.data?.data) {
            userOptions.value = userStore.getAllResponse.data.data.map((user) => ({
                label: `${user.name} (${user.email})`,
                value: user.id,
            }));
        }

        await fetchProfile();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const fetchProfile = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                state.id = response.data.id;
                state.user_id = response.data.user_id;
                state.phone = response.data.phone || '';
                state.nrc = response.data.nrc || '';
                state.dob = response.data.dob ? new Date(response.data.dob) : null;
                state.gender = response.data.gender || null;
                state.address = response.data.address || '';
                state.avatar_path = response.data.avatar_path || '';
            }
        } finally {
            isLoading.value = false;
        }
    };

    const formatDate = (value) => {
        if (!value) {
            return null;
        }

        if (typeof value === 'string') {
            return value;
        }

        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const showConfirmDialog = (id) => {
        confirm.require({
            message: 'Are you sure you want to delete this profile?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes, delete it',
            rejectLabel: 'Cancel',
            acceptClass: 'p-button-danger',
            rejectClass: 'p-button-danger p-button-text',
            accept: () => deleteProfile(id),
        });
    };

    const deleteProfile = async (id) => {
        isLoading.value = true;
        await store.delete({ id });
        const response = store.getDeleteResponse;

        if (response) {
            await router.push({ name: 'profileList' });
            EventBus.emit('show-toast', {
                severity: 'success',
                summary: '',
                detail: response.message,
            });
        }

        isLoading.value = false;
    };

    const handleSubmit = async () => {
        isLoading.value = true;
        errors.clear();

        try {
            await store.update({
                id: state.id,
                user_id: state.user_id,
                phone: state.phone,
                nrc: state.nrc,
                dob: formatDate(state.dob),
                gender: state.gender,
                address: state.address,
                avatar_path: state.avatar_path || null,
            });

            const response = store.getUpdateResponse;

            if (response) {
                await router.push({ name: 'profileList' });
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });
            }
        } catch (error) {
            if (error.status === 422) {
                errors.record(error.data.data);
            }
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        handleSubmit,
        showConfirmDialog,
        errors,
        state,
        userOptions,
        genderOptions,
    };
}
