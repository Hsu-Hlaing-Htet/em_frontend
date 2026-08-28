import { service as roomService } from '@/modules/admin/rooms/service';

/**
 * Normalize dropdown / API entity ids (number, numeric string, or option object).
 * @param {unknown} value
 * @returns {number|null}
 */
export function resolveEntityId(value) {
    if (value == null || value === '') {
        return null;
    }

    if (typeof value === 'object') {
        return resolveEntityId(value.value ?? value.id ?? value.building_id ?? null);
    }

    const id = Number(value);

    return Number.isFinite(id) && id > 0 ? id : null;
}

/**
 * @param {unknown} left
 * @param {unknown} right
 * @returns {boolean}
 */
export function sameEntityId(left, right) {
    const a = resolveEntityId(left);
    const b = resolveEntityId(right);

    return a != null && b != null && a === b;
}

/**
 * @param {Array<Record<string, unknown>>} buildings
 * @returns {Array<{ label: string, value: number }>}
 */
export function mapDraftBuildingOptions(buildings) {
    return (buildings || [])
        .filter((building) => building.status === 'active')
        .map((building) => ({
            label: building.building_name,
            value: resolveEntityId(building.id),
        }))
        .filter((option) => option.value != null);
}

/**
 * @param {Array<Record<string, unknown>>} rooms
 * @param {{ selectedRoomId?: unknown, allowedTypes?: string[] }} [options]
 * @returns {Array<{ label: string, value: number }>}
 */
export function mapDraftRoomOptions(rooms, { selectedRoomId = null, allowedTypes = null } = {}) {
    return (rooms || [])
        .filter((room) => {
            if (sameEntityId(room.id, selectedRoomId)) {
                return true;
            }

            if (allowedTypes && !allowedTypes.includes(room.type)) {
                return false;
            }

            return room.status === 'available';
        })
        .map((room) => ({
            label: room.room_number,
            value: resolveEntityId(room.id),
        }))
        .filter((option) => option.value != null);
}

/**
 * Load rooms for a building by numeric building_id (not name).
 *
 * @param {unknown} buildingId
 * @param {{ allowedTypes?: string[] }} [options]
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export async function fetchRoomsForBuilding(buildingId, { allowedTypes = null } = {}) {
    const normalizedBuildingId = resolveEntityId(buildingId);

    if (!normalizedBuildingId) {
        return [];
    }

    const response = await roomService.getAll({
        building_id: normalizedBuildingId,
        per_page: 200,
    });

    const rows = Array.isArray(response?.data?.data) ? response.data.data : [];

    return rows.filter((room) => {
        if (!sameEntityId(room.building_id, normalizedBuildingId)) {
            return false;
        }

        if (allowedTypes && !allowedTypes.includes(room.type)) {
            return false;
        }

        return true;
    });
}
