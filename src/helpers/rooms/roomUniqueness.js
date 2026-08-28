import { service } from '@/modules/admin/rooms/service';

/**
 * Client-side duplicate check for room_number within a building.
 * Backend Rule::unique remains the source of truth.
 *
 * @param {{ buildingId: number|string|null, roomNumber: string, ignoreRoomId?: number|string|null }} params
 * @returns {Promise<string|null>} Error message when duplicate, otherwise null.
 */
export async function findDuplicateRoomNumberError({ buildingId, roomNumber, ignoreRoomId = null }) {
    const normalizedBuildingId = Number(buildingId);
    const normalizedRoomNumber = String(roomNumber || '').trim();

    if (!normalizedBuildingId || !normalizedRoomNumber) {
        return null;
    }

    const response = await service.getAll({
        building_id: normalizedBuildingId,
        per_page: 1000,
        search: normalizedRoomNumber,
    });

    const rows = Array.isArray(response?.data?.data) ? response.data.data : [];
    const ignoreId = ignoreRoomId == null ? null : Number(ignoreRoomId);

    const duplicate = rows.find((room) => {
        const sameNumber = String(room?.room_number || '').trim().toLowerCase()
            === normalizedRoomNumber.toLowerCase();
        const sameBuilding = Number(room?.building_id) === normalizedBuildingId;
        const isOtherRecord = ignoreId == null || Number(room?.id) !== ignoreId;

        return sameNumber && sameBuilding && isOtherRecord;
    });

    if (!duplicate) {
        return null;
    }

    return `Room ${normalizedRoomNumber} already exists in this building.`;
}
