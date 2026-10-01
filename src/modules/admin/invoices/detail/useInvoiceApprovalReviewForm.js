import { reactive } from 'vue';
import { toQueryDate } from '@/helpers/lists/listQuery';

function normalizeList(value) {
    if (Array.isArray(value)) {
        return value;
    }

    if (value && Array.isArray(value.data)) {
        return value.data;
    }

    if (value?.data?.data && Array.isArray(value.data.data)) {
        return value.data.data;
    }

    return [];
}

function parseDateValue(value) {
    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return value;
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function roundMoney(value) {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function mapFormItem(item) {
    const isMetered = Boolean(
        item.is_metered
        || item.previous_reading != null
        || item.current_reading != null
        || item.usage != null,
    );

    return {
        id: item.id,
        description: item.description || '',
        previous_reading: item.previous_reading != null ? Number(item.previous_reading) : null,
        current_reading: item.current_reading != null ? Number(item.current_reading) : null,
        usage: item.usage != null ? Number(item.usage) : null,
        unit_price: item.unit_price != null ? Number(item.unit_price) : null,
        amount: item.amount != null ? Number(item.amount) : 0,
        is_metered: isMetered,
    };
}

export function recalculateInvoiceItem(item) {
    if (!item) {
        return;
    }

    if (item.is_metered) {
        if (item.previous_reading != null && item.current_reading != null) {
            item.usage = roundMoney(Number(item.current_reading) - Number(item.previous_reading));
        }

        if (item.usage != null && item.unit_price != null) {
            item.amount = roundMoney(Number(item.usage) * Number(item.unit_price));
        }

        return;
    }

    if (item.unit_price != null) {
        item.amount = roundMoney(Number(item.unit_price));
    }
}

export function createInvoiceApprovalReviewForm() {
    const form = reactive({
        id: null,
        invoice_number: '',
        contract_id: null,
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        building_name: '',
        room_number: '',
        issued_date: null,
        due_date: null,
        billing_month: null,
        late_fee: 0,
        type: '',
        items: [],
    });

    const errors = reactive({
        due_date: '',
        late_fee_selection: '',
        items: '',
    });

    const clearErrors = () => {
        errors.due_date = '';
        errors.late_fee_selection = '';
        errors.items = '';
    };

    const syncFromInvoice = async (invoice) => {
        form.id = invoice.id;
        form.invoice_number = invoice.invoice_number || '';
        form.contract_id = invoice.contract_id || null;
        form.customer_name = invoice.customer_name || '';
        form.customer_email = invoice.customer_email || '';
        form.customer_phone = invoice.customer_phone || '';
        form.building_name = invoice.building_name || '';
        form.room_number = invoice.room_number || '';
        form.issued_date = parseDateValue(invoice.issued_date);
        form.due_date = parseDateValue(invoice.due_date);
        form.billing_month = parseDateValue(invoice.billing_month || invoice.billing_period);
        form.late_fee = Number(invoice.late_fee || 0);
        form.type = invoice.type || invoice.invoice_type || '';
        form.items = normalizeList(invoice.items).map(mapFormItem);
    };

    const validate = (lateFeeSelection) => {
        clearErrors();
        let valid = true;

        if (!form.due_date) {
            errors.due_date = 'Due date is required.';
            valid = false;
        }

        if (lateFeeSelection == null || lateFeeSelection === '') {
            errors.late_fee_selection = 'Please select a Late Fee Rule.';
            valid = false;
        }

        for (const item of form.items) {
            if (item.is_metered
                && item.previous_reading != null
                && item.current_reading != null
                && Number(item.current_reading) < Number(item.previous_reading)) {
                errors.items = 'Current unit cannot be less than previous unit.';
                valid = false;
                break;
            }

            if (item.unit_price != null && Number(item.unit_price) < 0) {
                errors.items = 'Unit price must be zero or greater.';
                valid = false;
                break;
            }
        }

        return valid;
    };

    const buildIssuePayload = (lateFeeSelection) => ({
        late_fee_selection: lateFeeSelection,
        due_date: toQueryDate(form.due_date) || undefined,
        items: form.items.map((item) => {
            if (item.is_metered) {
                return {
                    id: item.id,
                    current_reading: item.current_reading,
                    unit_price: item.unit_price,
                };
            }

            return {
                id: item.id,
                unit_price: item.unit_price,
            };
        }),
    });

    return {
        form,
        errors,
        syncFromInvoice,
        validate,
        clearErrors,
        buildIssuePayload,
        recalculateInvoiceItem,
    };
}
