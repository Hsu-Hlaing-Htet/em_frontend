import { mapSaleDraftFromApi, toNumber } from './draft/mapSaleDraft';

export function mapSaleFromApi(data) {
    const mapped = mapSaleDraftFromApi(data);

    if (!mapped) {
        return null;
    }

    return {
        ...mapped,
        paid_amount: toNumber(data.paid_amount ?? 0),
        remaining_amount: toNumber(data.remaining_amount ?? data.remaining_balance ?? 0),
        rejection_reason: data.rejection_reason || data.remark || '',
        submitted_by: data.submitted_by || mapped.created_by,
        submitted_at: data.submitted_at || mapped.created_at,
        approved_by: data.approved_by_name || data.approved_by || '',
        approved_at: data.approved_at || '',
    };
}

export function mapSaleListItemFromApi(data) {
    const mapped = mapSaleFromApi(data);

    if (!mapped) {
        return null;
    }

    return {
        id: mapped.id,
        contract_no: mapped.contract_no,
        customer_name: mapped.customer_name,
        building_name: mapped.building_name,
        room_number: mapped.room_number,
        contract_total: mapped.contract_total,
        paid_amount: mapped.paid_amount,
        remaining_amount: mapped.remaining_amount,
        status: mapped.status,
        payment_type: mapped.payment_type,
        submitted_at: mapped.submitted_at,
        created_by: data.created_by_name || mapped.created_by || '',
        created_at: mapped.created_at,
    };
}

export function buildSaleTimeline(mapped) {
    if (!mapped) {
        return [];
    }

    const timeline = [];

    if (mapped.created_at) {
        timeline.push({
            label: 'Draft Created',
            date: mapped.created_at,
            actor: mapped.created_by,
        });
    }

    if (mapped.submitted_at || mapped.created_at) {
        timeline.push({
            label: 'Submitted for Approval',
            date: mapped.submitted_at || mapped.created_at,
            actor: mapped.submitted_by || mapped.created_by,
        });
    }

    if (mapped.approved_at) {
        timeline.push({
            label: 'Approved',
            date: mapped.approved_at,
            actor: mapped.approved_by,
        });
    }

    return timeline;
}
