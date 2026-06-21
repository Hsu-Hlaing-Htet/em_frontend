<template>
    <div class="field md:col-span-2">
        <label class="mb-2 block text-md text-[var(--admin-text)]">Images</label>

        <div class="flex flex-col gap-4">
            <div>
                <p v-if="!persistedImages.length && !stagedImages.length" class="mb-2 text-sm">
                No images added yet.
                </p>

                <FileUpload
                    mode="basic"
                    name="images"
                    accept="image/*"
                    choose-label="Add Images"
                    class="w-auto"
                    :auto="true"
                    :multiple="true"
                    custom-upload
                    @uploader="onFilesSelected"
                />
            </div>


            <div
                v-for="image in persistedImages"
                :key="`persisted-${image.id}`"
                class="grid gap-3 p-3 md:grid-cols-[120px_1fr]"
            >
                <img
                    :src="image.image_url"
                    alt="Room image preview"
                    class="h-24 w-full object-cover"
                >

                <div class="grid gap-3 md:grid-cols-2">
                    <div class="field">
                        <label class="mb-1 block text-md">Caption</label>
                        <Dropdown
                            v-model="image.description"
                            :options="descriptionOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="Select caption"
                            class="w-full"
                            editable
                        />
                    </div>

                    <div class="field">
                        <label class="mb-1 block text-md">Sort Order</label>
                        <InputNumber v-model="image.sort_order" class="w-full" :min="0" />
                    </div>

                    <div class="field flex items-end">
                        <div class="flex items-center gap-2">
                            <RadioButton
                                :input-id="`primary-persisted-${image.id}`"
                                :value="image.id"
                                :model-value="primaryKey"
                                @update:model-value="setPrimary(image.id)"
                            />
                            <label :for="`primary-persisted-${image.id}`" class="text-md">Primary image</label>
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-2">
                        <FileUpload
                            mode="basic"
                            accept="image/*"
                            choose-label="Replace Image"
                            class="w-auto"
                            :auto="true"
                            custom-upload
                            @uploader="(event) => onReplaceImage(image.id, event)"
                        />
                        <Button
                            type="button"
                            label="Delete"
                            icon="pi pi-trash"
                            @click="$emit('delete-persisted', image.id)"
                        />
                    </div>
                </div>
            </div>

            <div
                v-for="image in stagedImages"
                :key="image.tempId"
                class="grid gap-3 rounded-md border-2 border-dashed p-3 md:grid-cols-4 bg-[var(--admin-surface-solid)]"
            >
                <img
                    :src="image.previewUrl"
                    alt="Staged room image preview"
                    class="h-56 w-56 rounded object-cover md:grid-cols-2"
                >

                <div class="grid gap-3 md:grid-cols-2">
                    <div class="md:grid-cols-2">
                        <label class="mb-1 block text-md">Caption</label>
                        <Dropdown
                            v-model="image.description"
                            :options="descriptionOptions"
                            option-label="label"
                            option-value="value"
                            placeholder="Select caption"
                            class="w-full"
                            editable
                        />
                    </div>

                    <div class="field">
                        <label class="mb-1 block text-md">Sort Order</label>
                        <InputNumber v-model="image.sort_order" class="w-full" :min="0" />
                    </div>

                    <div class="field flex items-end">
                        <div class="flex items-center gap-2">
                            <RadioButton
                                :input-id="`primary-staged-${image.tempId}`"
                                :value="image.tempId"
                                :model-value="primaryKey"
                                @update:model-value="setPrimary(image.tempId)"
                            />
                            <label :for="`primary-staged-${image.tempId}`" class="text-md">Primary image</label>
                        </div>
                    </div>

                    <div class="md:col-span-2 flex items-end">
                        <Button
                            type="button"
                            label="Remove"
                            icon="pi pi-times"
                            class="p-button-outlined p-button-danger"
                            @click="removeStaged(image.tempId)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';
import FileUpload from 'primevue/fileupload';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
import { ROOM_IMAGE_DESCRIPTION_OPTIONS } from '../constants';

export default {
    name: 'RoomImageManager',
    components: { FileUpload, Dropdown, InputNumber, RadioButton, Button },
    props: {
        stagedImages: {
            type: Array,
            required: true,
        },
        persistedImages: {
            type: Array,
            required: true,
        },
        roomId: {
            type: [Number, String],
            default: null,
        },
        addStagedFiles: {
            type: Function,
            required: true,
        },
        removeStaged: {
            type: Function,
            required: true,
        },
        setPrimary: {
            type: Function,
            required: true,
        },
        replacePersistedImage: {
            type: Function,
            required: true,
        },
    },
    emits: ['delete-persisted'],
    setup(props) {
        const descriptionOptions = ROOM_IMAGE_DESCRIPTION_OPTIONS;

        const primaryKey = computed(() => {
            const persistedPrimary = props.persistedImages.find((image) => image.is_primary);

            if (persistedPrimary) {
                return persistedPrimary.id;
            }

            const stagedPrimary = props.stagedImages.find((image) => image.is_primary);

            return stagedPrimary?.tempId ?? null;
        });

        const onFilesSelected = (event) => {
            props.addStagedFiles(event.files);
        };

        const onReplaceImage = async (imageId, event) => {
            const file = event.files?.[0];

            if (!file || !props.roomId) {
                return;
            }

            await props.replacePersistedImage(imageId, file, props.roomId);
        };

        return {
            descriptionOptions,
            primaryKey,
            onFilesSelected,
            onReplaceImage,
        };
    },
};
</script>
