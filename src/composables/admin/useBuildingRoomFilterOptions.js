import { ref, watch } from 'vue';
import { service as buildingService } from '@/modules/admin/buildings/service';
import { service as roomService } from '@/modules/admin/rooms/service';

export function useBuildingRoomFilterOptions(buildingIdRef) {
    const buildingOptions = ref([]);
    const roomOptions = ref([]);
    const isLoadingBuildings = ref(false);
    const isLoadingRooms = ref(false);

    const loadBuildings = async () => {
        isLoadingBuildings.value = true;

        try {
            const response = await buildingService.getAll({ per_page: 100 });
            buildingOptions.value = (response?.data?.data || []).map((building) => ({
                label: building.building_name,
                value: building.id,
            }));
        } finally {
            isLoadingBuildings.value = false;
        }
    };

    const loadRooms = async (buildingId) => {
        if (!buildingId) {
            roomOptions.value = [];

            return;
        }

        isLoadingRooms.value = true;

        try {
            const response = await roomService.getAll({
                building_id: buildingId,
                per_page: 200,
            });
            roomOptions.value = (response?.data?.data || []).map((room) => ({
                label: room.room_number,
                value: room.id,
            }));
        } finally {
            isLoadingRooms.value = false;
        }
    };

    watch(buildingIdRef, async (buildingId, previousBuildingId) => {
        if (buildingId === previousBuildingId) {
            return;
        }

        await loadRooms(buildingId);
    });

    return {
        buildingOptions,
        roomOptions,
        isLoadingBuildings,
        isLoadingRooms,
        loadBuildings,
        loadRooms,
    };
}
