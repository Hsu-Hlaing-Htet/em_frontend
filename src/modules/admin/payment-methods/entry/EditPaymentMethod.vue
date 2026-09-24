<template>
    <div class="admin-panel relative mx-auto max-w-6xl">
        <form
            class="grid grid-cols-1 gap-4 md:grid-cols-2"
            @submit.prevent="handleSubmit"
        >
            <div class="field">
                <label for="name" class="mb-2 block text-md">Name</label>
                <InputText id="name" v-model="state.name" class="w-full" />
                <small v-if="errors.has('name')" class="p-error">
                    <div v-for="error in errors.get('name')" :key="error">{{ error }}</div>
                </small>
            </div>

            <div class="field">
                <label for="type" class="mb-2 block text-md">Type</label>
                <Dropdown
                    id="type"
                    v-model="state.type"
                    :options="typeOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Select payment method type"
                    class="w-full"
                />
                <small v-if="errors.has('type')" class="p-error">
                    <div v-for="error in errors.get('type')" :key="error">{{ error }}</div>
                </small>
            </div>

            <div class="field">
                <label for="status" class="mb-2 block text-md">Status</label>
                <Dropdown
                    id="status"
                    v-model="state.status"
                    :options="statusOptions"
                    option-label="label"
                    option-value="value"
                    placeholder="Select status"
                    class="w-full"
                />
                <small v-if="errors.has('status')" class="p-error">
                    <div v-for="error in errors.get('status')" :key="error">{{ error }}</div>
                </small>
            </div>

            <template v-if="isWalletType">
                <div class="field md:col-span-2">
                    <label for="phone_number" class="mb-2 block text-md">Phone Number</label>
                    <InputText id="phone_number" v-model="state.phone_number" class="w-full" />
                    <small v-if="errors.has('phone_number')" class="p-error">
                        <div v-for="error in errors.get('phone_number')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field md:col-span-2">
                    <label for="instructions" class="mb-2 block text-md">Customer Instructions</label>
                    <Textarea
                        id="instructions"
                        v-model="state.instructions"
                        class="w-full"
                        rows="3"
                    />
                    <small v-if="errors.has('instructions')" class="p-error">
                        <div v-for="error in errors.get('instructions')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field md:col-span-2">
                    <label class="mb-2 block text-md">QR Image</label>
                    <AdminImageUpload
                        :preview-url="qrPreviewUrl"
                        :file-name="qrFileName"
                        empty-label="Upload QR image"
                        remove-label="Remove QR"
                        hint="JPG, PNG, or WebP. Max 5 MB. Leave unchanged to keep the current QR."
                        preview-alt="Payment method QR preview"
                        :disabled="isLoading"
                        @select="onQrSelected"
                        @clear="clearQr"
                    />
                    <small v-if="errors.has('qr_image')" class="p-error">
                        <div v-for="error in errors.get('qr_image')" :key="error">{{ error }}</div>
                    </small>
                </div>
            </template>

            <template v-else-if="isBankTransferType">
                <div class="field">
                    <label for="account_name" class="mb-2 block text-md">Account Name</label>
                    <InputText id="account_name" v-model="state.account_name" class="w-full" />
                    <small v-if="errors.has('account_name')" class="p-error">
                        <div v-for="error in errors.get('account_name')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field">
                    <label for="account_number" class="mb-2 block text-md">Account Number</label>
                    <InputText id="account_number" v-model="state.account_number" class="w-full" />
                    <small v-if="errors.has('account_number')" class="p-error">
                        <div v-for="error in errors.get('account_number')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field md:col-span-2">
                    <label for="instructions" class="mb-2 block text-md">Customer Instructions</label>
                    <Textarea
                        id="instructions"
                        v-model="state.instructions"
                        class="w-full"
                        rows="3"
                    />
                    <small v-if="errors.has('instructions')" class="p-error">
                        <div v-for="error in errors.get('instructions')" :key="error">{{ error }}</div>
                    </small>
                </div>
            </template>

            <div class="flex justify-end gap-2 md:col-span-2">
                <Button type="submit" label="Save" />
                <router-link :to="{ name: 'paymentMethodList' }">
                    <Button type="button" label="Cancel" />
                </router-link>
            </div>
        </form>
    </div>

    <Loading v-if="isLoading" />
</template>

<script>
import { defineComponent } from 'vue';
import Dropdown from '@/components/global/AppDropdown.vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import AdminImageUpload from '@/components/admin/AdminImageUpload.vue';
import useEditPaymentMethod from './useEditPaymentMethod';

export default defineComponent({
    name: 'EditPaymentMethod',
    components: {
        Dropdown,
        InputText,
        Textarea,
        Button,
        Loading,
        AdminImageUpload,
    },
    setup() {
        return useEditPaymentMethod();
    },
});
</script>
