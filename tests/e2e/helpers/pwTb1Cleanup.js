/**
 * API cleanup for temporary Timebox 1 demo records prefixed with PW_TB1.
 * Order: room images → rooms → buildings. Leaves seeded/demo data alone.
 */
import { adminCredentials } from './credentials.js';

export const PW_TB1 = {
    buildingName: 'PW_TB1_BUILDING',
    roomNumber: 'PW_TB1_ROOM_101',
    location: 'PW_TB1 Location',
    updatedLocation: 'PW_TB1 Updated Location',
    prefix: 'PW_TB1',
};

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

    return { ok: response.ok, status: response.status, json };
}

export async function loginAdminToken() {
    const { email, password } = adminCredentials();
    const { ok, json } = await api('/auth/login', {
        method: 'POST',
        body: { email, password },
    });

    if (!ok || !json?.token) {
        throw new Error(`PW_TB1 cleanup: admin login failed (${json?.message || 'no token'})`);
    }

    return json.token;
}

function listItems(json) {
    return json?.data?.data ?? json?.data ?? [];
}

/**
 * Deletes all buildings/rooms/images whose names match the PW_TB1 prefix.
 * Safe to call repeatedly; ignores missing records.
 */
export async function cleanupPwTb1Records() {
    const token = await loginAdminToken();
    const summary = {
        imagesDeleted: 0,
        roomsDeleted: 0,
        buildingsDeleted: 0,
    };

    // Rooms matching PW_TB1 (room number or building name contains prefix)
    const roomsRes = await api(`/rooms?search=${encodeURIComponent(PW_TB1.prefix)}&per_page=100`, { token });
    const rooms = listItems(roomsRes.json).filter((room) => {
        const number = String(room.room_number || '');
        const building = String(room.building?.building_name || room.building_name || '');
        return number.includes(PW_TB1.prefix) || building.includes(PW_TB1.prefix);
    });

    for (const room of rooms) {
        const detail = await api(`/rooms/${room.id}`, { token });
        const images = detail.json?.data?.room_images
            || detail.json?.data?.roomImages
            || room.room_images
            || [];

        for (const image of images) {
            const id = image.id;
            if (!id) continue;
            const del = await api(`/room-images/${id}`, { method: 'DELETE', token });
            if (del.ok || del.status === 404) {
                summary.imagesDeleted += 1;
            }
        }

        const delRoom = await api(`/rooms/${room.id}`, { method: 'DELETE', token });
        if (delRoom.ok || delRoom.status === 404) {
            summary.roomsDeleted += 1;
        }
    }

    // Buildings matching PW_TB1
    const buildingsRes = await api(`/buildings?search=${encodeURIComponent(PW_TB1.prefix)}&per_page=100`, { token });
    const buildings = listItems(buildingsRes.json).filter((building) =>
        String(building.building_name || '').includes(PW_TB1.prefix),
    );

    for (const building of buildings) {
        // Any leftover rooms under this building (belt and suspenders)
        const leftover = await api(`/rooms?building_id=${building.id}&per_page=100`, { token });
        for (const room of listItems(leftover.json)) {
            const detail = await api(`/rooms/${room.id}`, { token });
            const images = detail.json?.data?.room_images || detail.json?.data?.roomImages || [];
            for (const image of images) {
                if (!image.id) continue;
                const del = await api(`/room-images/${image.id}`, { method: 'DELETE', token });
                if (del.ok || del.status === 404) summary.imagesDeleted += 1;
            }
            const delRoom = await api(`/rooms/${room.id}`, { method: 'DELETE', token });
            if (delRoom.ok || delRoom.status === 404) summary.roomsDeleted += 1;
        }

        const delBuilding = await api(`/buildings/${building.id}`, { method: 'DELETE', token });
        if (delBuilding.ok || delBuilding.status === 404) {
            summary.buildingsDeleted += 1;
        }
    }

    return summary;
}
