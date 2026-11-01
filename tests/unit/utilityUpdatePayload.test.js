import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUtilityUpdatePayload } from '../../src/modules/admin/utilities/utils/utilityFormHelpers.js';

test('editing a fetched rejected utility sends only editable fields and preserves item IDs', () => {
    const state = {
        id: 50, room_id: 26, contract_id: 37, billing_month: '2026-08-01', reading_date: '2026-09-01',
        status: 'rejected', created_by: 1, approved_by: 3, approved_at: '2026-09-01',
        total_amount: 1, rejection_reason: 'Check the reading', customer_email: 'fixture@example.test',
    };
    const payload = buildUtilityUpdatePayload(state, [{
        id: 106, utility_type_id: 1, previous_reading: 100, current_reading: 150, unit_price: 125.5,
        usage: 999, amount: 1, rowError: '',
    }]);
    assert.deepEqual(payload, {
        room_id: 26, contract_id: 37, billing_month: '2026-08-01', reading_date: '2026-09-01',
        utility_items: [{ id: 106, utility_type_id: 1, previous_reading: 100, current_reading: 150, unit_price: 125.5 }],
    });
});
