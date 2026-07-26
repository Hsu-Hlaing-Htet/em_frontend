import { CURRENCY_LOCALE } from '@/utils/formatter';

export const ROOM_CURRENCY_INPUT_PROPS = {
    min: 0,
    mode: 'currency',
    currency: 'MMK',
    locale: CURRENCY_LOCALE,
};

export function buildRoomPayload(state, { includeId = false } = {}) {
    const payload = {
        building_id: state.building_id,
        room_number: state.room_number,
        floor_number: Number(state.floor_number) || 0,
        width_ft: state.width_ft,
        length_ft: state.length_ft,
        area_sqft: Number(state.area_sqft) || 0,
        description: state.description || null,
        type: state.type,
        status: state.status,
        sale_price: Number(state.sale_price) || 0,
        rent_price: Number(state.rent_price) || 0,
        rent_deposit_price: Number(state.rent_deposit_price) || 0,
        booking_deposit_price: Number(state.booking_deposit_price) || 0,
    };

    if (includeId) {
        payload.id = state.id;
    }

    return payload;
}
