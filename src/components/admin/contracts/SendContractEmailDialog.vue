<template>
    <SendDocumentEmailDialog
        v-model="proxyVisible"
        document-kind="contract"
        :document-number="contractNo"
        :recipients="recipients"
        :submitting="submitting"
        @confirm="$emit('confirm')"
    />
</template>

<script>
import { computed, defineComponent } from 'vue';
import SendDocumentEmailDialog from '@/components/admin/SendDocumentEmailDialog.vue';
import { buildDocumentEmailRecipients } from '@/helpers/documents/buildDocumentEmailRecipients';

/**
 * Thin contract wrapper around the shared compact Send Email dialog.
 * Prefer SendDocumentEmailDialog directly for billing documents.
 */
export default defineComponent({
    name: 'SendContractEmailDialog',
    components: { SendDocumentEmailDialog },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        customerName: {
            type: String,
            default: '',
        },
        email: {
            type: String,
            default: '',
        },
        secondCustomerName: {
            type: String,
            default: '',
        },
        secondCustomerEmail: {
            type: String,
            default: '',
        },
        contractNo: {
            type: String,
            default: '',
        },
        submitting: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue', 'confirm'],
    setup(props, { emit }) {
        const proxyVisible = computed({
            get: () => props.modelValue,
            set: (value) => emit('update:modelValue', value),
        });

        const recipients = computed(() => buildDocumentEmailRecipients({
            customer_name: props.customerName,
            customer_email: props.email,
            second_customer_name: props.secondCustomerName,
            second_customer_email: props.secondCustomerEmail,
        }));

        return {
            proxyVisible,
            recipients,
        };
    },
});
</script>
