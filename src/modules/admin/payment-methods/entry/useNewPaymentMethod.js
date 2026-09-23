import { computed, onBeforeUnmount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { showApiErrorToast } from '@/utils/apiError';
import {
    PAYMENT_METHOD_STATUS_OPTIONS,
    PAYMENT_METHOD_TYPE_OPTIONS,
} from '@/constants/constant';
import { usePaymentMethodStore } from '../store';

export default function useNewPaymentMethod() {
    const store = usePaymentMethodStore();
    const router = useRouter();
    const isLoading = ref(false);
    const errors = new Errors();
    const submitted = ref(false);
    const qrPreviewUrl = ref('');

    const state = reactive({
        name: '',
        type: 'wallet',
        status: 'active',
        account_name: '',
        account_number: '',
        phone_number: '',
        instructions: '',
        is_customer_visible: true,
        sort_order: 0,
        qr_image: null,
        remove_qr_image: false,
    });

    bindErrorClearing(state, errors);

    const isWalletType = computed(() => state.type === 'wallet');

    onBeforeUnmount(() => {
        if (qrPreviewUrl.value && qrPreviewUrl.value.startsWith('blob:')) {
            URL.revokeObjectURL(qrPreviewUrl.value);
        }
        store.$reset();
        store.$dispose();
    });

    const onQrSelected = (event) => {
        const file = event.target?.files?.[0] || null;
        if (qrPreviewUrl.value && qrPreviewUrl.value.startsWith('blob:')) {
            URL.revokeObjectURL(qrPreviewUrl.value);
        }
        qrPreviewUrl.value = '';
        state.qr_image = null;
        state.remove_qr_image = false;

        if (!file) {
            return;
        }

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            errors.record({ qr_image: ['Please upload a JPG, PNG, or WebP image.'] });
            return;
        }

        if (file.size > 5120 * 1024) {
            errors.record({ qr_image: ['QR image must not be larger than 5 MB.'] });
            return;
        }

        errors.clear('qr_image');
        state.qr_image = file;
        qrPreviewUrl.value = URL.createObjectURL(file);
    };

    const clearQr = () => {
        if (qrPreviewUrl.value && qrPreviewUrl.value.startsWith('blob:')) {
            URL.revokeObjectURL(qrPreviewUrl.value);
        }
        qrPreviewUrl.value = '';
        state.qr_image = null;
        state.remove_qr_image = true;
    };

    const handleSubmit = async () => {
        errors.clear();

        if (!applyValidation(errors, state, [
            { field: 'name', type: 'text' },
            { field: 'type', type: 'select' },
            { field: 'status', type: 'select' },
        ])) {
            return;
        }

        isLoading.value = true;

        try {
            await store.add({ ...state });
            const response = store.getAddResponse;

            if (response) {
                await router.push({ name: 'paymentMethodList' });
                EventBus.emit('show-toast', {
                    severity: 'success',
                    summary: '',
                    detail: response.message,
                });
            }
        } catch (error) {
            if (error.status === 422) {
                errors.record(error.data?.data || error.data?.errors || {});
            } else {
                showApiErrorToast(error, 'Unable to save payment method.');
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
        isWalletType,
        qrPreviewUrl,
        onQrSelected,
        clearQr,
        statusOptions: PAYMENT_METHOD_STATUS_OPTIONS,
        typeOptions: PAYMENT_METHOD_TYPE_OPTIONS,
    };
}
