<template>
    <div class="customer-portal-page customer-maintenance-create-page">
        <CustomerPageHeader
            :title="$t('customer.createMaintenanceRequest')"
            :subtitle="$t('customer.createMaintenanceLead')"
        />

        <div class="admin-panel customer-maintenance-create-card">
            <h2 class="m-0 mb-3 text-base font-semibold">{{ $t('customer.requestInformation') }}</h2>
            <div class="mb-4 border-b border-[var(--admin-border)]" />

            <form class="customer-maintenance-create-form" @submit.prevent="handleSubmit">
                <div>
                    <label for="title" class="mb-2 block text-md">{{ $t('customer.requestTitle') }}</label>
                    <InputText
                        id="title"
                        v-model="state.title"
                        class="w-full"
                        :placeholder="$t('customer.enterRequestTitle')"
                    />
                    <small v-if="errors.has('title')" class="p-error">
                        <div v-for="error in errors.get('title')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div>
                    <label for="maintenance_category_id" class="mb-2 block text-md">{{ $t('customer.category') }}</label>
                    <Dropdown
                        id="maintenance_category_id"
                        v-model="state.maintenance_category_id"
                        :options="categoryOptions"
                        option-label="label"
                        option-value="value"
                        :placeholder="$t('customer.selectCategory')"
                        class="w-full"
                    />
                    <small v-if="errors.has('maintenance_category_id')" class="p-error">
                        <div v-for="error in errors.get('maintenance_category_id')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div>
                    <label for="room_id" class="mb-2 block text-md">{{ $t('customer.room') }}</label>
                    <Dropdown
                        id="room_id"
                        v-model="state.room_id"
                        :options="roomOptions"
                        option-label="label"
                        option-value="value"
                        :placeholder="$t('customer.selectRoom')"
                        class="w-full"
                        :disabled="!roomOptions.length"
                    />
                    <small v-if="!roomOptions.length && !isLoading" class="text-[var(--admin-text-muted)]">
                        {{ $t('customer.noRoomsForMaintenance') }}
                    </small>
                    <small v-if="errors.has('room_id')" class="p-error">
                        <div v-for="error in errors.get('room_id')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div>
                    <label for="priority" class="mb-2 block text-md">{{ $t('customer.priority') }}</label>
                    <Dropdown
                        id="priority"
                        v-model="state.priority"
                        :options="priorityOptions"
                        option-label="label"
                        option-value="value"
                        :placeholder="$t('customer.selectPriority')"
                        class="w-full"
                    />
                    <small v-if="errors.has('priority')" class="p-error">
                        <div v-for="error in errors.get('priority')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="customer-maintenance-create-form__full">
                    <label for="description" class="mb-2 block text-md">{{ $t('customer.description') }}</label>
                    <Textarea
                        id="description"
                        v-model="state.description"
                        rows="5"
                        class="w-full"
                        :placeholder="$t('customer.describeIssue')"
                    />
                    <small v-if="errors.has('description')" class="p-error">
                        <div v-for="error in errors.get('description')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="customer-maintenance-create-form__full">
                    <label class="mb-2 block text-md">{{ $t('customer.uploadPhoto') }}</label>
                    <div
                        class="flex min-h-[140px] flex-col items-center justify-center gap-3 rounded-md border border-dashed border-[var(--admin-border)] p-4"
                    >
                        <FileUpload
                            mode="basic"
                            accept="image/*"
                            :auto="false"
                            choose-label="Upload image or attachment"
                            custom-upload
                            @select="onPhotoSelect"
                        />
                        <div v-if="photoPreviewUrl" class="flex w-full flex-col items-center gap-2">
                            <img
                                :src="photoPreviewUrl"
                                alt="Selected attachment preview"
                                class="max-h-48 max-w-full rounded object-contain"
                            >
                            <Button
                                type="button"
                                label="Remove"
                                severity="secondary"
                                text
                                @click="clearPhoto"
                            />
                        </div>
                    </div>
                    <small v-if="errors.has('photo')" class="p-error">
                        <div v-for="error in errors.get('photo')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="customer-maintenance-create-form__actions">
                    <router-link :to="{ name: 'customerMaintenanceRequestList' }">
                        <Button
                            type="button"
                            :label="$t('common.cancel')"
                            severity="secondary"
                            outlined
                        />
                    </router-link>
                    <Button
                        type="submit"
                        :label="$t('common.submit')"
                        :loading="isSaving"
                        :disabled="!roomOptions.length"
                    />
                </div>
            </form>
        </div>

        <Loading v-if="isLoading" />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Dropdown from '@/components/global/AppDropdown.vue';
import FileUpload from 'primevue/fileupload';
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
        FileUpload,
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
