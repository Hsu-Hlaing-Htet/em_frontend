import { ref } from 'vue';
import { useRoomStore } from '../store';

let tempIdCounter = 0;

const clonePersistedSnapshot = (image) => ({
    description: image.description || '',
    is_primary: Boolean(image.is_primary),
    sort_order: Number(image.sort_order),
    image_path: image.image_path || '',
});

export default function useRoomImages() {
    const store = useRoomStore();
    const stagedImages = ref([]);
    const persistedImages = ref([]);

    const allImagesCount = () => stagedImages.value.length + persistedImages.value.length;

    const ensurePrimarySelection = () => {
        const hasPrimary = persistedImages.value.some((image) => image.is_primary)
            || stagedImages.value.some((image) => image.is_primary);

        if (!hasPrimary && allImagesCount() > 0) {
            if (persistedImages.value.length) {
                persistedImages.value[0].is_primary = true;
            } else {
                stagedImages.value[0].is_primary = true;
            }
        }
    };

    const setPrimary = (key) => {
        persistedImages.value.forEach((image) => {
            image.is_primary = image.id === key;
        });
        stagedImages.value.forEach((image) => {
            image.is_primary = image.tempId === key;
        });
        ensurePrimarySelection();
    };

    const addStagedFiles = (files) => {
        const fileList = Array.from(files || []);
        const startSort = allImagesCount();

        fileList.forEach((file, index) => {
            const tempId = `temp-${++tempIdCounter}`;

            stagedImages.value.push({
                tempId,
                file,
                previewUrl: URL.createObjectURL(file),
                description: '',
                is_primary: false,
                sort_order: startSort + index,
            });
        });

        if (allImagesCount() === fileList.length) {
            stagedImages.value[0].is_primary = true;
        }

        ensurePrimarySelection();
    };

    const removeStaged = (tempId) => {
        const index = stagedImages.value.findIndex((image) => image.tempId === tempId);

        if (index === -1) {
            return;
        }

        URL.revokeObjectURL(stagedImages.value[index].previewUrl);
        stagedImages.value.splice(index, 1);
        ensurePrimarySelection();
    };

    const loadPersistedFromRoom = (roomImages = []) => {
        persistedImages.value = roomImages.map((image) => ({
            id: image.id,
            room_id: image.room_id,
            image_path: image.image_path,
            image_url: image.image_url,
            description: image.description || '',
            is_primary: Boolean(image.is_primary),
            sort_order: Number(image.sort_order),
            _original: clonePersistedSnapshot(image),
        }));
    };

    const isPersistedDirty = (image) => {
        const original = image._original;

        return image.description !== original.description
            || image.is_primary !== original.is_primary
            || image.sort_order !== original.sort_order
            || image.image_path !== original.image_path;
    };

    const persistStagedImages = async (roomId) => {
        const total = stagedImages.value.length;
        const failures = [];

        for (const staged of [...stagedImages.value]) {
            try {
                const uploadResponse = await store.uploadImage(staged.file, roomId);

                await store.addImage({
                    room_id: roomId,
                    image_path: uploadResponse.data.image_path,
                    description: staged.description || null,
                    is_primary: staged.is_primary,
                    sort_order: staged.sort_order,
                });

                URL.revokeObjectURL(staged.previewUrl);
                stagedImages.value = stagedImages.value.filter((image) => image.tempId !== staged.tempId);
            } catch {
                failures.push(staged);
            }
        }

        return {
            success: failures.length === 0,
            partialFailure: failures.length > 0 && failures.length < total,
            failedCount: failures.length,
        };
    };

    const savePersistedChanges = async (roomId) => {
        const dirtyImages = persistedImages.value.filter(isPersistedDirty);

        for (const image of dirtyImages) {
            await store.updateImage({
                id: image.id,
                room_id: roomId,
                image_path: image.image_path,
                description: image.description || null,
                is_primary: image.is_primary,
                sort_order: image.sort_order,
            });

            image._original = clonePersistedSnapshot(image);
        }
    };

    const replacePersistedImage = async (imageId, file, roomId) => {
        const image = persistedImages.value.find((item) => item.id === imageId);

        if (!image || !file) {
            return;
        }

        const uploadResponse = await store.uploadImage(file, roomId);

        image.image_path = uploadResponse.data.image_path;
        image.image_url = uploadResponse.data.image_url;
    };

    const deletePersistedImage = async (imageId) => {
        await store.deleteImage({ id: imageId });
        persistedImages.value = persistedImages.value.filter((image) => image.id !== imageId);
        ensurePrimarySelection();
    };

    const resetImages = () => {
        stagedImages.value.forEach((image) => URL.revokeObjectURL(image.previewUrl));
        stagedImages.value = [];
        persistedImages.value = [];
    };

    return {
        stagedImages,
        persistedImages,
        addStagedFiles,
        removeStaged,
        setPrimary,
        loadPersistedFromRoom,
        persistStagedImages,
        savePersistedChanges,
        replacePersistedImage,
        deletePersistedImage,
        resetImages,
        isPersistedDirty,
    };
}
