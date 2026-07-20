import { reactive, ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRoomStore } from '../store';

export default function useShowRoom() {
    const store = useRoomStore();
    const route = useRoute();
    const isLoading = ref(true);
    const selectedImageId = ref(null);

    const state = reactive({
        id: null,
        building_id: null,
        building_name: '',
        room_number: '',
        floor_number: '',
        area_sqft: '',
        description: '',
        type: '',
        status: '',
        sale_price: '',
        rent_price: '',
        rent_deposit_price: '',
        booking_deposit_price: '',
        created_at: '',
        updated_at: '',
    });

    const roomImages = ref([]);

    const coverImage = computed(() => {
        if (!roomImages.value.length) {
            return null;
        }

        if (selectedImageId.value) {
            return roomImages.value.find((image) => image.id === selectedImageId.value) || null;
        }

        return roomImages.value.find((image) => image.is_primary)
            || roomImages.value[0];
    });

    const selectCoverImage = (imageId) => {
        selectedImageId.value = imageId;
    };

    watch(() => route.params.id, (newId) => {
        if (newId) {
            fetchRoom();
        }
    });

    onMounted(() => {
        fetchRoom();
    });

    onBeforeUnmount(() => {
        store.$reset();
        store.$dispose();
    });

    const fetchRoom = async () => {
        isLoading.value = true;

        try {
            await store.fetchOne({ id: route.params.id });
            const response = store.getOneResponse;

            if (response?.data) {
                Object.assign(state, response.data);
                roomImages.value = response.data.room_images || [];

                const primaryImage = roomImages.value.find((image) => image.is_primary)
                    || roomImages.value[0];

                selectedImageId.value = primaryImage?.id ?? null;
            }
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        state,
        roomImages,
        coverImage,
        selectCoverImage,
    };
}
