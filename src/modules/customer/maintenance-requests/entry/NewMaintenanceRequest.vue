<template>
    <div>
        <div class="customer-detail-actions mb-4">
            <router-link :to="{ name: 'customerMaintenanceRequestList' }">
                <Button
                    :label="$t('common.back')"
                    icon="pi pi-arrow-left"
                    class="btn-outline"
                />
            </router-link>
        </div>

        <div class="admin-panel relative mx-auto max-w-3xl p-5">
            <h1 class="customer-page-heading">{{ $t('customer.newMaintenanceRequest') }}</h1>
            <p class="customer-page-lead mb-6">
                {{ $t('customer.newMaintenanceLead') }}
            </p>

            <form class="grid grid-cols-1 gap-4" @submit.prevent="handleSubmit">
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
                    <label for="title" class="mb-2 block text-md">{{ $t('customer.title') }}</label>
                    <InputText id="title" v-model="state.title" class="w-full" />
                    <small v-if="errors.has('title')" class="p-error">
                        <div v-for="error in errors.get('title')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div>
                    <label for="category" class="mb-2 block text-md">{{ $t('customer.category') }}</label>
                    <Dropdown
                        id="category"
                        v-model="state.category"
                        :options="categoryOptions"
                        option-label="label"
                        option-value="value"
                        :placeholder="$t('customer.selectCategory')"
                        class="w-full"
                    />
                    <small v-if="errors.has('category')" class="p-error">
                        <div v-for="error in errors.get('category')" :key="error">{{ error }}</div>
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

                <div>
                    <label for="description" class="mb-2 block text-md">{{ $t('customer.description') }}</label>
                    <Textarea id="description" v-model="state.description" rows="5" class="w-full" />
                    <small v-if="errors.has('description')" class="p-error">
                        <div v-for="error in errors.get('description')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <Button
                    type="submit"
                    :label="$t('customer.submitRequest')"
                    class="customer-btn-block"
                    :loading="isSaving"
                    :disabled="!roomOptions.length"
                />
            </form>
        </div>

        <Loading v-if="isLoading" />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Loading from '@/components/global/Loading.vue';
import useCustomerNewMaintenanceRequest from '@/composables/customer/useCustomerNewMaintenanceRequest';

export default defineComponent({
    name: 'CustomerNewMaintenanceRequest',
    components: { Button, Dropdown, InputText, Textarea, Loading },
    setup() {
        return useCustomerNewMaintenanceRequest();
    },
});
</script>
