/**
 * Client-side validation rules for Payment Method Create/Edit.
 * Mirrors Store/UpdatePaymentMethodRequest conditional requirements.
 *
 * @param {{ type?: string|null }} values
 * @returns {Array<{ field: string, type?: string, when?: (values: object) => boolean }>}
 */
export function paymentMethodFormValidationRules() {
    return [
        { field: 'name', type: 'text' },
        { field: 'type', type: 'select' },
        { field: 'status', type: 'select' },
        {
            field: 'phone_number',
            type: 'wallet_phone',
            when: (values) => values.type === 'wallet',
        },
        {
            field: 'account_name',
            type: 'text',
            when: (values) => values.type === 'bank_transfer',
        },
        {
            field: 'account_number',
            type: 'text',
            when: (values) => values.type === 'bank_transfer',
        },
    ];
}
