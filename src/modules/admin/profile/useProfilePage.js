import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { formatDate, parseDate } from '@/utils/formatter';
import { showApiErrorToast } from '@/utils/apiError';
import { useAuthStore } from '@/modules/auth/store';
import { useProfileStore } from './store';
import ProfileImage from '@/assets/images/profile.png';

const MAX_AVATAR_PATH_LENGTH = 255;
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

function formatRoleLabel(role) {
    if (!role) {
        return '—';
    }

    return role.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function useProfilePage() {
    const authStore = useAuthStore();
    const store = useProfileStore();
    const isLoading = ref(true);
    const isSaving = ref(false);
    const errors = new Errors();
    const avatarPreviewUrl = ref('');
    const avatarObjectUrl = ref('');

    const state = reactive({
        id: null,
        role_id: null,
        role_name: '',
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
                    phone: response.data.phone || '',
                    password: '',
                    password_confirmation: '',
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
        const validationErrors = {};

        if (!state.name?.trim()) {
            validationErrors.name = ['Name is required.'];
        }

        if (!state.email?.trim()) {
            validationErrors.email = ['Email is required.'];
        } else if (!isValidEmail(state.email.trim())) {
            validationErrors.email = ['Enter a valid email address.'];
        }

        if (!state.phone?.trim()) {
            validationErrors.phone = ['Phone number is required.'];
        }

        if (state.avatar_path && state.avatar_path.length > MAX_AVATAR_PATH_LENGTH) {
            validationErrors.avatar_path = [
                `Image URL must be ${MAX_AVATAR_PATH_LENGTH} characters or fewer.`,
            ];
        }

        if (state.password || state.password_confirmation) {
            if (state.password.length < 8) {
                validationErrors.password = ['Password must be at least 8 characters.'];
            }

            if (state.password !== state.password_confirmation) {
                validationErrors.password_confirmation = ['Password confirmation does not match.'];
            }
        }

        if (Object.keys(validationErrors).length) {
            errors.record(validationErrors);
            return false;
        }

        return true;
    };

    const onAvatarSelected = (event) => {
        const file = event.files?.[0];

        if (!file) {
            return;
        }

        errors.clear('avatar_path');

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            errors.record({
                avatar_path: ['Please choose a JPEG, PNG, GIF, or WebP image.'],
            });
            return;
        }

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            errors.record({
                avatar_path: ['Image must be 2 MB or smaller.'],
            });
            return;
        }

        revokeAvatarPreview();
        avatarObjectUrl.value = URL.createObjectURL(file);
        avatarPreviewUrl.value = avatarObjectUrl.value;

        EventBus.emit('show-toast', {
            severity: 'info',
            summary: '',
            detail: 'Image preview updated. Enter a hosted image URL below to save it to your profile.',
        });
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

            if (state.password) {
                payload.password = state.password;
            }

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

                state.password = '';
                state.password_confirmation = '';
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
