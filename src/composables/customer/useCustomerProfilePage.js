import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { bindErrorClearing, collectValidationErrors } from '@/utils/formValidation';
import { formatDate, parseDate } from '@/utils/formatter';
import { showApiErrorToast } from '@/utils/apiError';
import { useAuthStore } from '@/modules/auth/store';
import { useCustomerProfileStore } from '@/modules/customer/profile/store';
import ProfileImage from '@/assets/images/profile.png';

const MAX_AVATAR_PATH_LENGTH = 255;
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const PROFILE_RULES = [
    { field: 'name', type: 'text' },
    { field: 'email', type: 'email', accountEmail: true, originalEmailField: 'original_email' },
    { field: 'phone', type: 'phone' },
];

export default function useCustomerProfilePage() {
    const authStore = useAuthStore();
    const store = useCustomerProfileStore();
    const { t } = useI18n();
    const isLoading = ref(true);
    const isSaving = ref(false);
    const showChangePasswordDialog = ref(false);
    const errors = new Errors();
    const avatarPreviewUrl = ref('');
    const avatarObjectUrl = ref('');
    const avatarFileInput = ref(null);

    const state = reactive({
        name: '',
        email: '',
        original_email: '',
        phone: '',
        nrc: '',
        dob: null,
        gender: '',
        address: '',
        avatar_path: '',
    });

    bindErrorClearing(state, errors);

    const displayAvatar = computed(() => avatarPreviewUrl.value || state.avatar_path || ProfileImage);
    const hasCustomAvatar = computed(() => Boolean(avatarPreviewUrl.value || state.avatar_path));
    const roleLabel = computed(() => t('customer.customerFallback'));

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
                    original_email: data.email || '',
                    phone: data.phone || '',
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
        const validationErrors = collectValidationErrors(state, PROFILE_RULES);

        if (state.avatar_path && state.avatar_path.length > MAX_AVATAR_PATH_LENGTH) {
            validationErrors.avatar_path = [
                `Image URL must be ${MAX_AVATAR_PATH_LENGTH} characters or fewer.`,
            ];
        }

        if (Object.keys(validationErrors).length) {
            errors.record(validationErrors);
            return false;
        }

        return true;
    }

    function openAvatarPicker() {
        avatarFileInput.value?.click();
    }

    function onAvatarFileChange(event) {
        const file = event.target?.files?.[0];

        if (event.target) {
            event.target.value = '';
        }

        if (!file) {
            return;
        }

        errors.clear('avatar_path');

        if (!ALLOWED_IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_SIZE_BYTES) {
            errors.record({ avatar_path: ['Choose a valid image up to 2 MB.'] }, false);
            return;
        }

        if (avatarObjectUrl.value) {
            URL.revokeObjectURL(avatarObjectUrl.value);
        }

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

            await store.updateProfile(payload);
            const response = store.getUpdateResponse;

            if (response) {
                await authStore.refreshUser();
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
        showChangePasswordDialog,
        errors,
        state,
        displayAvatar,
        hasCustomAvatar,
        avatarPreviewUrl,
        avatarFileInput,
        roleLabel,
        handleSubmit,
        openAvatarPicker,
        onAvatarFileChange,
        clearAvatar,
    };
}
