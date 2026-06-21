<template>
    <div class="flex flex-col gap-3">
        <FileUpload
            mode="basic"
            name="image"
            accept="image/*"
            choose-label="Choose Image"
            class="w-full"
            :auto="true"
            custom-upload
            :disabled="isUploading || disabled"
            @uploader="onUpload"
        />

        <small v-if="disabled && !modelValue" class="text-[var(--admin-text-muted)]">
            Select a room before uploading an image.
        </small>

        <small v-if="errors.length" class="p-error">
            <div v-for="error in errors" :key="error">{{ error }}</div>
        </small>

        <div v-if="previewUrl" class="overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-solid)] p-2">
            <img :src="previewUrl" alt="Image preview" class="max-h-56 w-full object-contain">
        </div>
    </div>
</template>

<script>
import { computed, ref } from 'vue';
import FileUpload from 'primevue/fileupload';
import { resolveMediaUrl } from '@/utils/media';

export default {
    name: 'ImageUpload',
    components: { FileUpload },
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        imageUrl: {
            type: String,
            default: '',
        },
        uploadHandler: {
            type: Function,
            required: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue', 'update:imageUrl'],
    setup(props, { emit }) {
        const isUploading = ref(false);
        const errors = ref([]);

        const previewUrl = computed(() => {
            if (props.imageUrl) {
                return props.imageUrl;
            }

            return resolveMediaUrl(props.modelValue);
        });

        const onUpload = async (event) => {
            const file = event.files?.[0];

            if (!file || props.disabled) {
                return;
            }

            isUploading.value = true;
            errors.value = [];

            try {
                const response = await props.uploadHandler(file);

                if (response?.data?.image_path) {
                    emit('update:modelValue', response.data.image_path);
                }

                if (response?.data?.image_url) {
                    emit('update:imageUrl', response.data.image_url);
                }
            } catch (error) {
                if (error.status === 422 && error.data?.data) {
                    const validationErrors = error.data.data;
                    errors.value = [
                        ...(validationErrors.image || []),
                        ...(validationErrors.room_id || []),
                    ];
                }

                if (!errors.value.length) {
                    errors.value = ['Image upload failed. Please try again.'];
                }
            } finally {
                isUploading.value = false;
            }
        };

        return {
            isUploading,
            errors,
            previewUrl,
            onUpload,
        };
    },
};
</script>
