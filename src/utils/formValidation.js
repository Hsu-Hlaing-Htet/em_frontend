import { watch } from 'vue';
import { validateNrcValue } from '@/helpers/nrc/nrcFormat';
import { validatePhoneValue } from '@/helpers/phone/phoneFormat';
import { parseDate } from '@/utils/formatter';

export const PASSWORD_MIN_LENGTH = 8;

/** Reserved Super Admin login email — not used to determine roles. */
export const SUPER_ADMIN_EMAIL = 'admin@rosewoodroyale.com';

export const VALIDATION_MESSAGES = {
    emailRequired: 'Email is required.',
    emailInvalid: 'Please enter a valid email address.',
    emailGmail: 'Please use a Gmail address.',
    emailUnique: 'This email is already in use.',
    nrcInvalid: 'Please enter a valid NRC.',
    phoneInvalid: 'Please enter a valid phone number.',
    select: 'Please select an option.',
    date: 'Please select a date.',
    file: 'Please upload a file.',
    passwordMin: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
    passwordMatch: 'Passwords do not match.',
    passwordDifferent: 'New password must be different from the current password.',
    currentPasswordIncorrect: 'Current password is incorrect.',
    numberInvalid: 'Please enter a valid number.',
    dateInvalid: 'Please enter a valid date.',
};

const FIELD_LABELS = {
    name: 'Name',
    email: 'Email',
    phone: 'Phone number',
    password: 'Password',
    password_confirmation: 'Confirm password',
    current_password: 'Current password',
    address: 'Address',
    nrc: 'NRC',
    dob: 'Date of birth',
    gender: 'Gender',
    role_id: 'Role',
    building_name: 'Building name',
    location: 'Location',
    description: 'Description',
    building_id: 'Building',
    room_id: 'Room',
    room_number: 'Room number',
    floor_number: 'Floor number',
    area_sqft: 'Area',
    width_ft: 'Width',
    length_ft: 'Length',
    type: 'Type',
    status: 'Status',
    sale_price: 'Sale price',
    rent_price: 'Rent price',
    rent_deposit_price: 'Rent deposit',
    booking_deposit_price: 'Booking deposit',
    title: 'Title',
    category: 'Category',
    priority: 'Priority',
    user_id: 'Customer',
    customer_id: 'Customer',
    invoice_id: 'Invoice',
    payment_method_id: 'Payment method',
    payment_date: 'Payment date',
    amount: 'Amount',
    note: 'Note',
    proof: 'Payment proof',
    payment_type: 'Payment type',
    duration_months: 'Duration',
    interest_percentage: 'Interest percentage',
    value: 'Value',
    per: 'Per',
    grace_days: 'Grace days',
    utility_type_id: 'Utility type',
    unit_price: 'Unit price',
    effective_date: 'Effective date',
    billing_month: 'Billing month',
    previous_reading: 'Previous reading',
    current_reading: 'Current reading',
    start_date: 'Start date',
    end_date: 'End date',
    billing_day: 'Billing day',
    contract_total: 'Contract total',
    remark: 'Remark',
    remarks: 'Remarks',
    rejection_reason: 'Rejection reason',
    cancellation_reason: 'Cancellation reason',
    resolution_note: 'Resolution note',
    avatar_path: 'Avatar',
    slug: 'Slug',
    message: 'Message',
};

const SELECT_FIELDS = new Set([
    'role_id',
    'gender',
    'building_id',
    'room_id',
    'user_id',
    'customer_id',
    'invoice_id',
    'payment_method_id',
    'payment_type',
    'type',
    'status',
    'category',
    'priority',
    'utility_type_id',
    'duration_months',
    'billing_day',
    'per',
]);

const DATE_FIELDS = new Set([
    'dob',
    'payment_date',
    'start_date',
    'end_date',
    'effective_date',
    'billing_month',
    'issued_date',
    'due_date',
]);

const FILE_FIELDS = new Set([
    'proof',
    'file',
    'attachment',
    'image',
    'document',
]);

function humanizeField(field) {
    return String(field || 'Field')
        .replace(/_id$/, '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function fieldLabel(field) {
    return FIELD_LABELS[field] || humanizeField(field);
}

export function requiredMessage(field) {
    if (FILE_FIELDS.has(field) || field?.endsWith('_file') || field?.endsWith('_proof')) {
        return VALIDATION_MESSAGES.file;
    }

    if (DATE_FIELDS.has(field) || field?.endsWith('_date') || field === 'dob') {
        return VALIDATION_MESSAGES.date;
    }

    if (
        SELECT_FIELDS.has(field)
        || field?.endsWith('_id')
        || field === 'type'
        || field === 'status'
        || field === 'gender'
        || field === 'category'
        || field === 'priority'
        || field === 'payment_type'
    ) {
        return VALIDATION_MESSAGES.select;
    }

    return `${fieldLabel(field)} is required.`;
}

export function isBlank(value) {
    if (value === null || value === undefined) {
        return true;
    }

    if (typeof value === 'string') {
        return value.trim() === '';
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    }

    return false;
}

export function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

export function normalizeEmail(value) {
    return String(value || '').trim().toLowerCase();
}

export function isReservedSuperAdminEmail(value) {
    return normalizeEmail(value) === SUPER_ADMIN_EMAIL;
}

export function isGmailAddress(value) {
    const email = normalizeEmail(value);

    return email !== '' && email.endsWith('@gmail.com');
}

/**
 * Account email policy (create/edit users): Gmail-only except reserved Super Admin email.
 * Roles remain independent of email domain.
 *
 * @param {unknown} value
 * @param {{ originalEmail?: string|null }} [options]
 * @returns {string|null} Error message or null when valid
 */
export function validateUserAccountEmail(value, { originalEmail = null } = {}) {
    if (isBlank(value)) {
        return VALIDATION_MESSAGES.emailRequired;
    }

    if (!isValidEmail(value)) {
        return VALIDATION_MESSAGES.emailInvalid;
    }

    const normalized = normalizeEmail(value);
    const unchanged = originalEmail != null
        && normalizeEmail(originalEmail) === normalized;

    if (isReservedSuperAdminEmail(normalized)) {
        if (unchanged) {
            return null;
        }

        return VALIDATION_MESSAGES.emailGmail;
    }

    if (unchanged) {
        return null;
    }

    if (!isGmailAddress(normalized)) {
        return VALIDATION_MESSAGES.emailGmail;
    }

    return null;
}

export function isValidPhone(value) {
    return validatePhoneValue(value) === null;
}

export function isValidDateValue(value) {
    if (value instanceof Date) {
        return !Number.isNaN(value.getTime());
    }

    if (typeof value === 'string' && value.trim()) {
        const parsed = parseDate(value);

        return parsed instanceof Date && !Number.isNaN(parsed.getTime());
    }

    return false;
}

export function isValidNumber(value, { min = null, gt = null, allowZero = true } = {}) {
    if (value === null || value === undefined || value === '') {
        return false;
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return false;
    }

    if (gt !== null && !(number > gt)) {
        return false;
    }

    if (min !== null && number < min) {
        return false;
    }

    if (!allowZero && number === 0) {
        return false;
    }

    return true;
}

/**
 * Password policy matches backend: min 8 characters (no complexity rules).
 */
export function validatePasswordField(password, {
    required = true,
    confirmation = undefined,
    currentPassword = undefined,
    field = 'password',
    confirmationField = 'password_confirmation',
} = {}) {
    const errors = {};
    const value = password ?? '';

    if (required && isBlank(value)) {
        errors[field] = [requiredMessage(field)];
    } else if (!isBlank(value) && String(value).length < PASSWORD_MIN_LENGTH) {
        errors[field] = [VALIDATION_MESSAGES.passwordMin];
    }

    if (confirmation !== undefined) {
        if (isBlank(confirmation) && (required || !isBlank(value))) {
            errors[confirmationField] = [requiredMessage(confirmationField)];
        } else if (!isBlank(confirmation) && String(value) !== String(confirmation)) {
            errors[confirmationField] = [VALIDATION_MESSAGES.passwordMatch];
        }
    }

    if (
        currentPassword !== undefined
        && !isBlank(value)
        && !isBlank(currentPassword)
        && String(value) === String(currentPassword)
    ) {
        errors[field] = [VALIDATION_MESSAGES.passwordDifferent];
    }

    return errors;
}

function evaluateRule(values, rule) {
    if (typeof rule.when === 'function' && !rule.when(values)) {
        return null;
    }

    const field = rule.field;
    const value = values[field];
    const type = rule.type || 'required';

    if (type === 'required' || type === 'text') {
        return isBlank(value) ? requiredMessage(field) : null;
    }

    if (type === 'select') {
        return isBlank(value) ? VALIDATION_MESSAGES.select : null;
    }

    if (type === 'date') {
        if (isBlank(value)) {
            return VALIDATION_MESSAGES.date;
        }

        return isValidDateValue(value) ? null : VALIDATION_MESSAGES.dateInvalid;
    }

    if (type === 'file') {
        return isBlank(value) ? VALIDATION_MESSAGES.file : null;
    }

    if (type === 'email') {
        if (rule.accountEmail) {
            const originalEmail = rule.originalEmailField
                ? values[rule.originalEmailField]
                : (rule.originalEmail ?? null);

            return validateUserAccountEmail(value, { originalEmail });
        }

        if (isBlank(value)) {
            return requiredMessage(field);
        }

        return isValidEmail(value) ? null : VALIDATION_MESSAGES.emailInvalid;
    }

    if (type === 'nrc') {
        return validateNrcValue(value);
    }

    if (type === 'phone') {
        return validatePhoneValue(value);
    }

    if (type === 'number') {
        if (isBlank(value) && value !== 0) {
            return requiredMessage(field);
        }

        if (!isValidNumber(value, {
            min: rule.min ?? null,
            gt: rule.gt ?? null,
            allowZero: rule.allowZero !== false,
        })) {
            if (rule.gt !== null && rule.gt !== undefined) {
                return `Please enter a number greater than ${rule.gt}.`;
            }

            if (rule.min !== null && rule.min !== undefined) {
                return `Please enter a number of at least ${rule.min}.`;
            }

            return VALIDATION_MESSAGES.numberInvalid;
        }

        return null;
    }

    if (type === 'password') {
        const passwordErrors = validatePasswordField(value, {
            required: rule.required !== false,
            confirmation: rule.confirmationField ? values[rule.confirmationField] : undefined,
            currentPassword: rule.currentPasswordField ? values[rule.currentPasswordField] : undefined,
            field,
            confirmationField: rule.confirmationField || 'password_confirmation',
        });

        return Object.keys(passwordErrors).length ? passwordErrors : null;
    }

    return null;
}

/**
 * @param {Record<string, any>} values
 * @param {Array<{ field: string, type?: string, when?: Function, min?: number, gt?: number, required?: boolean, confirmationField?: string, currentPasswordField?: string }>} rules
 * @returns {Record<string, string[]>}
 */
export function collectValidationErrors(values, rules) {
    const errors = {};

    rules.forEach((rule) => {
        const result = evaluateRule(values, rule);

        if (!result) {
            return;
        }

        if (typeof result === 'object' && !Array.isArray(result)) {
            Object.entries(result).forEach(([field, messages]) => {
                errors[field] = messages;
            });

            return;
        }

        errors[rule.field] = [result];
    });

    return errors;
}

/**
 * Records client-side validation errors and returns whether the form is valid.
 */
export function applyValidation(errors, values, rules) {
    const validationErrors = collectValidationErrors(values, rules);

    if (Object.keys(validationErrors).length) {
        errors.record(validationErrors);

        return false;
    }

    return true;
}

/**
 * Clear a field error when the user changes that field.
 */
export function bindErrorClearing(state, errors, fields = null) {
    const keys = fields || Object.keys(state);

    keys.forEach((key) => {
        watch(
            () => state[key],
            () => {
                if (errors.has(key)) {
                    errors.clear(key);
                }
            },
        );
    });
}
