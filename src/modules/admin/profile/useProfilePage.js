import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { bindErrorClearing, collectValidationErrors } from '@/utils/formValidation';
import { formatDate, parseDate } from '@/utils/formatter';
import { showApiErrorToast } from '@/utils/apiError';
import { useAuthStore } from '@/modules/auth/store';
import { useProfileStore } from './store';
import ProfileImage from '@/assets/images/profile.png';

const MAX_AVATAR_PATH_LENGTH = 255;
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const PROFILE_RULES = [
    { field: 'name', type: 'text' },
    { field: 'email', type: 'email', accountEmail: true, originalEmailField: 'original_email' },
    { field: 'phone', type: 'phone' },
];

function formatRoleLabel(role) {
    if (!role) {
        return '—';
    }

    return role.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function useProfilePage() {
    const authStore = useAuthStore();
    const store = useProfileStore();
    const isLoading = ref(true);
    const isSaving = ref(false);
    const showChangePasswordDialog = ref(false);
    const errors = new Errors();
    const avatarPreviewUrl = ref('');
    const avatarObjectUrl = ref('');
    const avatarFileInput = ref(null);

    const state = reactive({
        id: null,
        role_id: null,
        role_name: '',
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

    const displayAvatar = computed(() => {
        if (avatarPreviewUrl.value) {
            return avatarPreviewUrl.value;
        }

        if (state.avatar_path) {
            return state.avatar_path;
        }

        return ProfileImage;
    });

    const roleLabel = computed(() => formatRoleLabel(state.role_name || authStore.user?.role));
    const hasCustomAvatar = computed(() => Boolean(avatarPreviewUrl.value || state.avatar_path));

    onMounted(async () => {
        await fetchProfile();
    });

    onBeforeUnmount(() => {
        revokeAvatarPreview();
        store.$reset();
        store.$dispose();
    });

    const revokeAvatarPreview = () => {
        if (avatarObjectUrl.value) {
            URL.revokeObjectURL(avatarObjectUrl.value);
            avatarObjectUrl.value = '';
        }
    };

    const fetchProfile = async () => {
        isLoading.value = true;

        try {
            await authStore.ensureLoaded();

            const userId = authStore.user?.id;

            if (!userId) {
                throw new Error('Unable to load the current user.');
            }

            await store.fetchProfile(userId);
            const response = store.getProfileResponse;

            if (response?.data) {
                Object.assign(state, {
                    id: response.data.id,
                    role_id: response.data.role_id,
                    role_name: response.data.role_name || authStore.user?.role || '',
                    name: response.data.name || '',
                    email: response.data.email || '',
                    original_email: response.data.email || '',
                    phone: response.data.phone || '',
                    nrc: response.data.nrc || '',
                    dob: parseDate(response.data.dob),
                    gender: response.data.gender || '',
                    address: response.data.address || '',
                    avatar_path: response.data.avatar_path || '',
                });
                avatarPreviewUrl.value = '';
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load your profile.');
        } finally {
            isLoading.value = false;
        }
    };

    const validateForm = () => {
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
    };

    const openAvatarPicker = () => {
        avatarFileInput.value?.click();
    };

    const onAvatarFileChange = (event) => {
        const file = event.target?.files?.[0];

        if (event.target) {
            event.target.value = '';
        }

        if (!file) {
            return;
        }

        errors.clear('avatar_path');

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            errors.record({
                avatar_path: ['Please choose a JPEG, PNG, GIF, or WebP image.'],
            }, false);
            return;
        }

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            errors.record({
                avatar_path: ['Image must be 2 MB or smaller.'],
            }, false);
            return;
        }

        revokeAvatarPreview();
        avatarObjectUrl.value = URL.createObjectURL(file);
        avatarPreviewUrl.value = avatarObjectUrl.value;
    };

    const clearAvatar = () => {
        revokeAvatarPreview();
        avatarPreviewUrl.value = '';
        state.avatar_path = '';
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        isSaving.value = true;
        errors.clear();

        try {
            const payload = {
                id: state.id,
                role_id: state.role_id,
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

                if (response.data) {
                    state.avatar_path = response.data.avatar_path || '';
                    state.name = response.data.name || state.name;
                    state.email = response.data.email || state.email;
                    state.phone = response.data.phone || state.phone;
                }

                revokeAvatarPreview();
                avatarPreviewUrl.value = '';

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
    };

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
