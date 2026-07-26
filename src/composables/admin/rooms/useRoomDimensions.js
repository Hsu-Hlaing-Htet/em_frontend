import { watch } from 'vue';
import { calculateAreaSqft } from '@/utils/roomDimensions';

export default function useRoomDimensions(state) {
    watch(
        () => [state.width_ft, state.length_ft],
        ([width, length]) => {
            const area = calculateAreaSqft(width, length);

            if (area !== null) {
                state.area_sqft = area;
            }
        },
    );
}
