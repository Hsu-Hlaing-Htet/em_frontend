<template>
    <div
        class="admin-image-upload"
        :class="{
            'is-dragging': isDragging,
            'has-file': Boolean(previewUrl),
        }"
        role="button"
        tabindex="0"
        :aria-label="emptyLabel"
        :aria-disabled="disabled ? 'true' : 'false'"
        @click="openPicker"
        @keydown.enter.prevent="openPicker"
        @keydown.space.prevent="openPicker"
        @dragenter.prevent="onDragEnter"
        @dragover.prevent="onDragEnter"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
    >
        <input
            ref="fileInputEl"
            type="file"
            class="admin-image-upload__input"
            :accept="accept"
            :disabled="disabled"
            @change="onInputChange"
        >

        <template v-if="!previewUrl">
            <i class="pi pi-cloud-upload admin-image-upload__icon" aria-hidden="true" />
            <span class="admin-image-upload__text">{{ emptyLabel }}</span>
            <span v-if="hint" class="admin-image-upload__hint">{{ hint }}</span>
        </template>

        <div v-else class="admin-image-upload__preview">
            <img
                :src="previewUrl"
                :alt="previewAlt"
                class="admin-image-upload__image"
            >
            <span v-if="fileName" class="admin-image-upload__filename">{{ fileName }}</span>
            <button
                type="button"
                class="admin-image-upload__remove"
                :disabled="disabled"
                @click.stop="$emit('clear')"
            >
                {{ removeLabel }}
            </button>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'AdminImageUpload',
    props: {
        previewUrl: { type: String, default: '' },
        fileName: { type: String, default: '' },
        emptyLabel: { type: String, default: 'Upload image' },
        removeLabel: { type: String, default: 'Remove' },
        hint: { type: String, default: '' },
        accept: {
            type: String,
            default: 'image/png,image/jpeg,image/jpg,image/webp',
        },
        previewAlt: { type: String, default: 'Selected image preview' },
        disabled: { type: Boolean, default: false },
    },
    emits: ['select', 'clear'],
    setup(props, { emit }) {
        const fileInputEl = ref(null);
        const isDragging = ref(false);

        const openPicker = () => {
            if (props.disabled) {
                return;
            }

            fileInputEl.value?.click();
        };

        const onDragEnter = () => {
            if (!props.disabled) {
                isDragging.value = true;
            }
        };

        const onDragLeave = () => {
            isDragging.value = false;
        };

        const onInputChange = (event) => {
            emit('select', event);
        };

        const onDrop = (event) => {
            isDragging.value = false;

            if (props.disabled) {
                return;
            }

            const file = event.dataTransfer?.files?.[0] || null;
            emit('select', {
                target: {
                    files: file ? [file] : [],
                },
            });
        };

        const resetInput = () => {
            if (fileInputEl.value) {
                fileInputEl.value.value = '';
            }
        };

        return {
            fileInputEl,
            isDragging,
            openPicker,
            onDragEnter,
            onDragLeave,
            onInputChange,
            onDrop,
            resetInput,
        };
    },
});
</script>
