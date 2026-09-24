import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import EventBus from '@/libs/AppEventBus';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { showApiErrorToast } from '@/utils/apiError';
import {
    PAYMENT_METHOD_STATUS_OPTIONS,
    PAYMENT_METHOD_TYPE_OPTIONS,
} from '@/constants/constant';
import { normalizePaymentMethodWalletPhone } from '@/helpers/phone/phoneFormat';
import { paymentMethodFormValidationRules } from './paymentMethodFormValidation';
import { usePaymentMethodStore } from '../store';

export default function useEditPaymentMethod() {
    const store = usePaymentMethodStore();
    const router = useRouter();
    const route = useRoute();
    const isLoading = ref(true);
    const isHydrating = ref(true);
    const errors = new Errors();
    const submitted = ref(false);
    const qrPreviewUrl = ref('');
    const qrFileName = ref('');
    const hadExistingQr = ref(false);

    const state = reactive({
        id: null,
        name: '',
        type: null,
        status: 'active',
        account_name: '',
        account_number: '',
        phone_number: '',
        instructions: '',
        qr_image: null,
        remove_qr_image: false,
    });

    bindErrorClearing(state, errors);

    const isWalletType = computed(() => state.type === 'wallet');
    const isBankTransferType = computed(() => state.type === 'bank_transfer');

    const clearQrPreview = ({ markRemoved = true } = {}) => {
        if (qrPreviewUrl.value && qrPreviewUrl.value.startsWith('blob:')) {
            URL.revokeObjectURL(qrPreviewUrl.value);
        }
        qrPreviewUrl.value = '';
        qrFileName.value = '';
        state.qr_image = null;
        if (markRemoved) {
            state.remove_qr_image = true;
        }
    };

    const clearStaleTypeFields = (type) => {
        if (type !== 'wallet') {
            state.phone_number = '';
            clearQrPreview({ markRemoved: hadExistingQr.value || Boolean(state.qr_image) });
            errors.clear('phone_number');
            errors.clear('qr_image');
        }

        if (type !== 'bank_transfer') {
            state.account_name = '';
            state.account_number = '';
            errors.clear('account_name');
            errors.clear('account_number');
        }

        if (type !== 'wallet' && type !== 'bank_transfer') {
            state.instructions = '';
            errors.clear('instructions');
        }
    };

    watch(() => state.type, (next, prev) => {
        if (isHydrating.value || !prev || next === prev) {
            return;
        }

        clearStaleTypeFields(next);
    });

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchPaymentMethod();
        }
    });

    onMounted(() => {
        fetchPaymentMethod();
    });

    onBeforeUnmount(() => {
        if (qrPreviewUrl.value && qrPreviewUrl.value.startsWith('blob:')) {
            URL.revokeObjectURL(qrPreviewUrl.value);
        }
        store.$reset();
        store.$dispose();
    });

    const fetchPaymentMethod = async () => {
        isLoading.value = true;
        isHydrating.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, {
                    id: response.data.id,
                    name: response.data.name || '',
                    type: response.data.type || null,
                    status: response.data.status || 'active',
                    account_name: response.data.account_name || '',
                    account_number: response.data.account_number || '',
                    phone_number: normalizePaymentMethodWalletPhone(response.data.phone_number)
                        || response.data.phone_number
                        || '',
                    instructions: response.data.instructions || '',
                    qr_image: null,
                    remove_qr_image: false,
                });
                qrPreviewUrl.value = response.data.qr_image_url || '';
                qrFileName.value = response.data.qr_image_url ? 'Current QR image' : '';
                hadExistingQr.value = Boolean(response.data.qr_image_url);
            }
        } catch (error) {
            showApiErrorToast(error, 'Unable to load payment method.');
        } finally {
            isLoading.value = false;
            isHydrating.value = false;
        }
    };

    const onQrSelected = (event) => {
        const file = event.target?.files?.[0] || null;
        if (qrPreviewUrl.value && qrPreviewUrl.value.startsWith('blob:')) {
            URL.revokeObjectURL(qrPreviewUrl.value);
        }
        qrPreviewUrl.value = '';
        qrFileName.value = '';
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
        qrFileName.value = file.name || 'Selected QR image';
        qrPreviewUrl.value = URL.createObjectURL(file);
    };

    const clearQr = () => {
        clearQrPreview({ markRemoved: true });
    };

    const buildPayload = () => {
        const payload = {
            id: state.id,
            name: state.name,
            type: state.type,
            status: state.status,
            instructions: '',
            phone_number: '',
            account_name: '',
            account_number: '',
            qr_image: null,
            remove_qr_image: false,
        };

        if (state.type === 'wallet') {
            payload.phone_number = normalizePaymentMethodWalletPhone(state.phone_number)
                || String(state.phone_number || '').trim();
            payload.instructions = state.instructions;
            payload.qr_image = state.qr_image;
            payload.remove_qr_image = state.remove_qr_image;
        } else if (state.type === 'bank_transfer') {
            payload.account_name = state.account_name;
            payload.account_number = state.account_number;
            payload.instructions = state.instructions;
            payload.remove_qr_image = hadExistingQr.value || state.remove_qr_image;
        } else {
            payload.remove_qr_image = hadExistingQr.value || state.remove_qr_image;
        }

        return payload;
    };

    const handleSubmit = async () => {
        errors.clear();

        if (!applyValidation(errors, state, paymentMethodFormValidationRules())) {
            return;
        }

        isLoading.value = true;

        try {
            await store.update(buildPayload());
            const response = store.getUpdateResponse;

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
        isBankTransferType,
        qrPreviewUrl,
        qrFileName,
        onQrSelected,
        clearQr,
        statusOptions: PAYMENT_METHOD_STATUS_OPTIONS,
        typeOptions: PAYMENT_METHOD_TYPE_OPTIONS,
    };
}
