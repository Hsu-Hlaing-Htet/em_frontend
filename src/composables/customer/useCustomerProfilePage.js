import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { formatDate, parseDate } from '@/utils/formatter';
import { showApiErrorToast } from '@/utils/apiError';
import { useAuthStore } from '@/modules/auth/store';
import { useCustomerProfileStore } from '@/modules/customer/profile/store';
import ProfileImage from '@/assets/images/profile.png';

const MAX_AVATAR_PATH_LENGTH = 255;
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function useCustomerProfilePage() {
    const authStore = useAuthStore();
    const store = useCustomerProfileStore();
    const isLoading = ref(true);
    const isSaving = ref(false);
    const errors = new Errors();
    const avatarPreviewUrl = ref('');
    const avatarObjectUrl = ref('');

    const state = reactive({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        nrc: '',
        dob: null,
        gender: '',
        address: '',
        avatar_path: '',
    });

    const displayAvatar = computed(() => avatarPreviewUrl.value || state.avatar_path || ProfileImage);
    const roleLabel = computed(() => 'Customer');

    onMounted(fetchProfile);

    onBeforeUnmount(() => {
        if (avatarObjectUrl.value) {
            URL.revokeObjectURL(avatarObjectUrl.value);
        }
        store.$reset();
        store.$dispose();
    });

    async function fetchProfile() {
        isLoading.value = true;

        try {
            await store.fetchProfile();
            const data = store.getProfileResponse?.data;

            if (data) {
                Object.assign(state, {
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    password: '',
                    password_confirmation: '',
                    nrc: data.nrc || '',
                    dob: parseDate(data.dob),
                    gender: data.gender || '',
                    address: data.address || '',
                    avatar_path: data.avatar_path || '',
                });
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load your profile.');
        } finally {
            isLoading.value = false;
        }
    }

    function validateForm() {
        errors.clear();
        const validationErrors = {};

        if (!state.name?.trim()) validationErrors.name = ['Name is required.'];
        if (!state.email?.trim()) {
            validationErrors.email = ['Email is required.'];
        } else if (!isValidEmail(state.email.trim())) {
            validationErrors.email = ['Enter a valid email address.'];
        }
        if (!state.phone?.trim()) validationErrors.phone = ['Phone number is required.'];
        if (state.avatar_path && state.avatar_path.length > MAX_AVATAR_PATH_LENGTH) {
            validationErrors.avatar_path = [`Image URL must be ${MAX_AVATAR_PATH_LENGTH} characters or fewer.`];
        }
        if (state.password || state.password_confirmation) {
            if (state.password.length < 8) validationErrors.password = ['Password must be at least 8 characters.'];
            if (state.password !== state.password_confirmation) {
                validationErrors.password_confirmation = ['Password confirmation does not match.'];
            }
        }

        if (Object.keys(validationErrors).length) {
            errors.record(validationErrors);
            return false;
        }

        return true;
    }

    function onAvatarSelected(event) {
        const file = event.files?.[0];
        if (!file) return;

        if (!ALLOWED_IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_SIZE_BYTES) {
            errors.record({ avatar_path: ['Choose a valid image up to 2 MB.'] });
            return;
        }

        if (avatarObjectUrl.value) URL.revokeObjectURL(avatarObjectUrl.value);
        avatarObjectUrl.value = URL.createObjectURL(file);
        avatarPreviewUrl.value = avatarObjectUrl.value;
    }

    function clearAvatar() {
        if (avatarObjectUrl.value) URL.revokeObjectURL(avatarObjectUrl.value);
        avatarObjectUrl.value = '';
        avatarPreviewUrl.value = '';
        state.avatar_path = '';
    }

    async function handleSubmit() {
        if (!validateForm()) return;

        isSaving.value = true;
        errors.clear();

        try {
            const payload = {
                name: state.name.trim(),
                email: state.email.trim(),
                phone: state.phone.trim(),
                nrc: state.nrc,
                dob: formatDate(state.dob),
                gender: state.gender,
                address: state.address,
                avatar_path: state.avatar_path?.trim() || null,
            };

            if (state.password) payload.password = state.password;

            await store.updateProfile(payload);
            const response = store.getUpdateResponse;

            if (response) {
                await authStore.refreshUser();
                state.password = '';
                state.password_confirmation = '';
                clearAvatar();

                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message || 'Profile updated successfully.',
                });
            }
        } catch (error) {
            if (error.status === 422) {
                errors.record(error.data.data);
                return;
            }
            showApiErrorToast(error, 'Unable to update your profile.');
        } finally {
            isSaving.value = false;
        }
    }

    return {
        isLoading,
        isSaving,
        errors,
        state,
        displayAvatar,
        avatarPreviewUrl,
        roleLabel,
        handleSubmit,
        onAvatarSelected,
        clearAvatar,
    };
}
