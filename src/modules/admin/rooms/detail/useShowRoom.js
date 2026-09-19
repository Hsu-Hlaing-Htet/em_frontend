import { reactive, ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRoomStore } from '../store';
import { formatCurrency } from '@/utils/formatter';
import { showApiErrorToast } from '@/utils/apiError';

export default function useShowRoom() {
    const store = useRoomStore();
    const route = useRoute();
    const router = useRouter();
    const isLoading = ref(true);
    const selectedImageId = ref(null);

    const state = reactive({
        id: null,
        building_id: null,
        building_name: '',
        room_number: '',
        floor_number: '',
        width_ft: '',
        length_ft: '',
        area_sqft: '',
        description: '',
        type: '',
        status: '',
        sale_price: '',
        rent_price: '',
        rent_deposit_price: '',
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

    const canCreateContract = computed(() => {
        const status = String(state.status || '').toLowerCase();
        const type = String(state.type || '').toLowerCase();

        return Boolean(state.id)
            && status === 'available'
            && ['sale', 'rent', 'both'].includes(type);
    });

    const goCreateContract = () => {
        if (!canCreateContract.value) {
            return;
        }

        router.push({
            name: 'createRoomContract',
            params: { id: state.id },
        });
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
        } catch (error) {
            showApiErrorToast(error, 'Unable to load room.');
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
        canCreateContract,
        goCreateContract,
        formatCurrency,
    };
}
