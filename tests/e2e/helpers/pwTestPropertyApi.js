import { adminCredentials } from './credentials.js';

export const PW_TEST_BULK_PREFIX = 'PW_TEST_BULK';

function apiBase() {
    return (process.env.PLAYWRIGHT_API_BASE_URL || 'http://localhost:8000/api').replace(/\/$/, '');
}

async function api(pathname, { method = 'GET', token, body } = {}) {
    const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${apiBase()}${pathname}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    let json = null;
    try {
        json = await response.json();
    } catch {
        json = null;
    }

    if (!response.ok && response.status !== 404) {
        throw new Error(`API ${method} ${pathname} failed with ${response.status}: ${JSON.stringify(json)}`);
    }

    return { ok: response.ok, status: response.status, json };
}

function listItems(json) {
    return json?.data?.data ?? json?.data ?? [];
}

export async function loginAdminToken() {
    const { email, password } = adminCredentials();
    const { json } = await api('/auth/login', {
        method: 'POST',
        body: { email, password },
    });

    const token = json?.token ?? json?.data?.token;
    if (!token) {
        throw new Error('PW_TEST bulk cleanup: admin login failed.');
    }

    return token;
}

export async function createPwTestBuilding(token, suffix) {
    const { json } = await api('/buildings', {
        method: 'POST',
        token,
        body: {
            building_name: `${PW_TEST_BULK_PREFIX}_BUILDING_${suffix}`,
            location: `${PW_TEST_BULK_PREFIX} Location`,
            description: `${PW_TEST_BULK_PREFIX} temporary e2e building`,
        },
    });

    return json.data;
}

export async function createPwTestRoom(token, buildingId, suffix) {
    const { json } = await api('/rooms', {
        method: 'POST',
        token,
        body: {
            building_id: buildingId,
            room_number: `${PW_TEST_BULK_PREFIX}_ROOM_${suffix}`,
            floor_number: 1,
            area_sqft: 500,
            type: 'rent',
            status: 'available',
            sale_price: 0,
            rent_price: 500000,
            rent_deposit_price: 500000,
            booking_deposit_price: 0,
            description: `${PW_TEST_BULK_PREFIX} temporary e2e room`,
        },
    });

    return json.data;
}

export async function cleanupPwTestBulkRecords() {
    const token = await loginAdminToken();

    const roomsRes = await api(`/rooms?search=${encodeURIComponent(PW_TEST_BULK_PREFIX)}&per_page=100`, { token });
    for (const room of listItems(roomsRes.json)) {
        await api(`/rooms/${room.id}`, { method: 'DELETE', token });
    }

    const buildingsRes = await api(`/buildings?search=${encodeURIComponent(PW_TEST_BULK_PREFIX)}&per_page=100`, { token });
    for (const building of listItems(buildingsRes.json)) {
        await api(`/buildings/${building.id}`, { method: 'DELETE', token });
    }
}
