<template>
    <div class="customer-portal-page customer-maintenance-create-page">
        <CustomerPageHeader
            :title="$t('customer.createMaintenanceRequest')"
            :subtitle="$t('customer.createMaintenanceLead')"
        />

        <section class="customer-maintenance-create-card" aria-labelledby="customer-mr-request-info">
            <header class="customer-maintenance-create-card__head">
                <h2 id="customer-mr-request-info" class="customer-maintenance-create-card__title">
                    {{ $t('customer.requestInformation') }}
                </h2>
            </header>

            <form class="customer-maintenance-create-form" @submit.prevent="handleSubmit">
                <div class="customer-maintenance-field">
                    <label for="title" class="customer-maintenance-field__label">
                        {{ $t('customer.requestTitle') }}
                    </label>
                    <InputText
                        id="title"
                        v-model="state.title"
                        class="w-full"
                        :placeholder="$t('customer.enterRequestTitle')"
                        :disabled="isSaving"
                    />
                    <small v-if="errors.has('title')" class="p-error customer-maintenance-field__error">
                        <span v-for="error in errors.get('title')" :key="error">{{ error }}</span>
                    </small>
                </div>

                <div class="customer-maintenance-field">
                    <label for="category" class="customer-maintenance-field__label">
                        {{ $t('customer.category') }}
                    </label>
                    <Dropdown
                        id="category"
                        v-model="state.category"
                        :options="categoryOptions"
                        option-label="label"
                        option-value="value"
                        :placeholder="categoryOptions.length ? $t('customer.selectCategory') : $t('customer.noMaintenanceCategories')"
                        class="w-full"
                        :disabled="isSaving || isLoading || !categoryOptions.length"
                    />
                    <small
                        v-if="!isLoading && !categoryOptions.length"
                        class="customer-maintenance-field__hint"
                    >
                        {{ $t('customer.noMaintenanceCategories') }}
                    </small>
                    <small v-if="errors.has('category')" class="p-error customer-maintenance-field__error">
                        <span v-for="error in errors.get('category')" :key="error">{{ error }}</span>
                    </small>
                </div>

                <div class="customer-maintenance-field">
                    <label for="room_id" class="customer-maintenance-field__label">
                        {{ $t('customer.room') }}
                    </label>
                    <Dropdown
                        id="room_id"
                        v-model="state.room_id"
                        :options="roomOptions"
                        option-label="label"
                        option-value="value"
                        :placeholder="$t('customer.selectRoom')"
                        class="w-full"
                        :disabled="isSaving || !roomOptions.length"
                    />
                    <small
                        v-if="!roomOptions.length && !isLoading"
                        class="customer-maintenance-field__hint"
                    >
                        {{ $t('customer.noRoomsForMaintenance') }}
                    </small>
                    <small v-if="errors.has('room_id')" class="p-error customer-maintenance-field__error">
                        <span v-for="error in errors.get('room_id')" :key="error">{{ error }}</span>
                    </small>
                </div>

                <div class="customer-maintenance-field">
                    <label for="priority" class="customer-maintenance-field__label">
                        {{ $t('customer.priority') }}
                    </label>
                    <Dropdown
                        id="priority"
                        v-model="state.priority"
                        :options="priorityOptions"
                        option-label="label"
                        option-value="value"
                        :placeholder="$t('customer.selectPriority')"
                        class="w-full"
                        :disabled="isSaving"
                    />
                    <small v-if="errors.has('priority')" class="p-error customer-maintenance-field__error">
                        <span v-for="error in errors.get('priority')" :key="error">{{ error }}</span>
                    </small>
                </div>

                <div class="customer-maintenance-field customer-maintenance-field--full">
                    <label for="description" class="customer-maintenance-field__label">
                        {{ $t('customer.description') }}
                    </label>
                    <Textarea
                        id="description"
                        v-model="state.description"
                        class="w-full customer-maintenance-textarea"
                        :placeholder="$t('customer.describeIssue')"
                        :disabled="isSaving"
                        rows="6"
                    />
                    <small v-if="errors.has('description')" class="p-error customer-maintenance-field__error">
                        <span v-for="error in errors.get('description')" :key="error">{{ error }}</span>
                    </small>
                </div>

                <div class="customer-maintenance-field customer-maintenance-field--full">
                    <label class="customer-maintenance-field__label">
                        {{ $t('customer.uploadImageAttachment') }}
                    </label>

                    <div
                        class="customer-maintenance-upload"
                        :class="{
                            'is-dragging': isDragging,
                            'has-file': Boolean(photoPreviewUrl),
                        }"
                        role="button"
                        tabindex="0"
                        :aria-label="$t('customer.uploadImageOrAttachment')"
                        @click="openFilePicker"
                        @keydown.enter.prevent="openFilePicker"
                        @keydown.space.prevent="openFilePicker"
                        @dragenter.prevent="isDragging = true"
                        @dragover.prevent="isDragging = true"
                        @dragleave.prevent="isDragging = false"
                        @drop.prevent="onPhotoDrop"
                    >
                        <input
                            ref="fileInputEl"
                            type="file"
                            class="customer-maintenance-upload__input"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            :disabled="isSaving"
                            @change="onPhotoInputChange"
                        >

                        <template v-if="!photoPreviewUrl">
                            <i class="pi pi-cloud-upload customer-maintenance-upload__icon" aria-hidden="true" />
                            <span class="customer-maintenance-upload__text">
                                {{ $t('customer.uploadImageOrAttachment') }}
                            </span>
                        </template>

                        <div v-else class="customer-maintenance-upload__preview">
                            <img
                                :src="photoPreviewUrl"
                                alt="Selected attachment preview"
                                class="customer-maintenance-upload__image"
                            >
                            <button
                                type="button"
                                class="customer-maintenance-upload__remove"
                                :disabled="isSaving"
                                @click.stop="clearPhoto"
                            >
                                {{ $t('common.remove') }}
                            </button>
                        </div>
                    </div>

                    <small v-if="errors.has('photo')" class="p-error customer-maintenance-field__error">
                        <span v-for="error in errors.get('photo')" :key="error">{{ error }}</span>
                    </small>
                </div>

                <div class="customer-maintenance-create-form__actions">
                    <Button
                        type="button"
                        :label="$t('common.cancel')"
                        severity="secondary"
                        outlined
                        class="customer-maintenance-btn-cancel"
                        :disabled="isSaving"
                        @click="goBack"
                    />
                    <Button
                        type="submit"
                        :label="isSaving ? $t('common.submitting') : $t('common.submit')"
                        class="customer-maintenance-btn-submit"
                        :loading="isSaving"
                        :disabled="isSaving || !roomOptions.length || !categoryOptions.length"
                    />
                </div>
            </form>
        </section>

        <Loading v-if="isLoading" />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Dropdown from '@/components/global/AppDropdown.vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Loading from '@/components/global/Loading.vue';
import CustomerPageHeader from '@/components/customer/CustomerPageHeader.vue';
import useCustomerNewMaintenanceRequest from '@/composables/customer/useCustomerNewMaintenanceRequest';

export default defineComponent({
    name: 'CustomerNewMaintenanceRequest',
    components: {
        Button,
        Dropdown,
        InputText,
        Textarea,
        Loading,
        CustomerPageHeader,
    },
    setup() {
        return useCustomerNewMaintenanceRequest();
    },
});
</script>
