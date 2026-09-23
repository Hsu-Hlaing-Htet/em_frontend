import { parseDate, formatDate } from '@/utils/formatter';

export function toNumber(value) {
    if (value === null || value === undefined || value === '') {
        return 0;
    }

    return Number(value);
}

export function mapSaleDraftFromApi(data) {
    if (!data) {
        return null;
    }

    const customer = data.customer || {};
    const secondCustomer = data.second_customer || {};

    return {
        id: data.id,
        contract_no: data.contract_number,
        customer_id: data.user_id,
        customer_name: customer.name || data.user_name || data.customer_name || '',
        customer_nrc: customer.nrc || '',
        customer_phone: customer.phone || '',
        customer_email: customer.email || '',
        customer_address: customer.address || data.customer_address || '',
        second_customer_id: data.second_user_id ?? secondCustomer.id ?? null,
        second_customer_name: secondCustomer.name || '',
        second_customer_nrc: secondCustomer.nrc || '',
        second_customer_phone: secondCustomer.phone || '',
        second_customer_email: secondCustomer.email || '',
        building_id: data.building_id ?? data.room?.building_id ?? data.building?.id ?? null,
        building_name: data.building_name || data.building?.building_name || '',
        room_id: data.room_id,
        room_number: data.room_number || data.room?.room_number || '',
        room_price: toNumber(data.room_price ?? data.room?.sale_price),
        deposit: toNumber(data.deposit_amount),
        payment_plan: data.payment_plan?.name || data.payment_plan_name || '',
        payment_type: data.payment_type,
        duration_months: data.payment_type === 'full' ? null : data.duration_months,
        contract_total: toNumber(data.contract_total),
        start_date: data.start_date,
        remarks: data.remark || '',
        status: data.status ?? '',
        created_by: data.created_by_name || data.creator?.name || '',
        created_at: data.created_at,
        remaining_balance: toNumber(data.remaining_balance),
        interest_percentage: toNumber(data.interest_percentage),
        total_installment_amount: toNumber(data.total_installment_amount),
        estimated_monthly_payment: toNumber(data.estimated_monthly_payment),
    };
}

export function mapSaleDraftFormFromApi(data) {
    const mapped = mapSaleDraftFromApi(data);

    if (!mapped) {
        return null;
    }

    return {
        ...mapped,
        start_date: parseDate(mapped.start_date),
    };
}

export function mapSaleDraftToApi(state) {
    const payload = {
        user_id: state.customer_id,
        second_user_id: state.show_second_customer && state.second_customer_id
            ? state.second_customer_id
            : null,
        room_id: state.room_id,
        payment_type: state.payment_type,
        contract_total: state.contract_total,
        start_date: state.start_date ? formatDate(state.start_date) : null,
        remark: state.remarks || null,
    };

    // deposit_amount is derived server-side from the room — do not send it.

    if (state.payment_type === 'installment') {
        payload.duration_months = state.duration_months;
    }

    return payload;
}
