<template>
        <!-- <div class="admin-crud-header">
            <Button
                type="button"
                icon="pi pi-trash"
                class="p-button-danger p-button-outlined"
                @click="showConfirmDialog(state.id)"
            />
        </div> -->

        <div v-if="!isLoading" class="admin-panel relative mx-auto max-w-6xl">
            <form
                class="grid grid-cols-1 gap-4 md:grid-cols-2"
                @submit.prevent="handleSubmit"
            >
                <div class="field">
                    <label class="mb-2 block text-md">Name</label>
                    <InputText v-model="state.name" class="w-full" />
                    <small v-if="errors.has('name')" class="p-error">
                        <div v-for="error in errors.get('name')" :key="error">{{ error }}</div>
                    </small>
                </div>
<div class="field">
                <GmailInput
                    v-model="state.email"
                        :original-email="state.original_email"
                        :errors="errors"
                    />
                </div>
                <div class="field"> <PhoneInput v-model="state.phone" :errors="errors" /></div>

                <div class="field"> <NrcInput v-model="state.nrc" :errors="errors" /></div>

                <div class="field">
                    <label class="mb-2 block text-md">Date of Birth</label>
                    <DateOfBirthSelect v-model="state.dob" />
                    <small v-if="errors.has('dob')" class="p-error">
                        <div v-for="error in errors.get('dob')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Gender</label>
                    <Dropdown
                        v-model="state.gender"
                        :options="genderOptions"
                        option-label="label"
                        option-value="value"
                        placeholder="Select gender"
                        class="w-full"
                    />
                    <small v-if="errors.has('gender')" class="p-error">
                        <div v-for="error in errors.get('gender')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field md:col-span-2">
                    <label class="mb-2 block text-md">Address</label>
                    <Textarea v-model="state.address" rows="4" class="w-full" />
                    <small v-if="errors.has('address')" class="p-error">
                        <div v-for="error in errors.get('address')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <!-- <div class="field md:col-span-2">
                    <label class="mb-2 block text-md">Avatar</label>
                    <InputText v-model="state.avatar_path" class="w-full" placeholder="Optional image path" />
                    <small v-if="errors.has('avatar_path')" class="p-error">
                        <div v-for="error in errors.get('avatar_path')" :key="error">{{ error }}</div>
                    </small>
                </div> -->

                <div class="col-span-1 flex gap-2 pt-2 md:col-span-2">
                    <Button type="submit" label="Save" />
                    <router-link :to="{ name: 'residentList' }">
                        <Button type="button" label="Cancel" />
                    </router-link>
                </div>
            </form>
        </div>

        <ConfirmDialog :show-header="false">
            <template #message="slotProps">
                <div class="w-full text-center">
                    <Button
                        type="button"
                        :icon="slotProps.message.icon"
                        class="p-button-lg p-button-danger p-button-rounded p-button-outlined mt-4"
                    />
                    <h4>{{ slotProps.message.message }}</h4>
                </div>
            </template>
        </ConfirmDialog>

        <Loading v-if="isLoading" />

</template>

<script>
import { defineComponent } from 'vue';
import ConfirmDialog from 'primevue/confirmdialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import DateOfBirthSelect from '@/components/admin/DateOfBirthSelect.vue';
import Loading from '@/components/global/Loading.vue';
import NrcInput from '@/components/admin/NrcInput.vue';
import PhoneInput from '@/components/admin/PhoneInput.vue';
import GmailInput from '@/components/admin/GmailInput.vue';
import useEditResident from './useEditResident';

export default defineComponent({
    name: 'EditResident',
    components: {
        ConfirmDialog,
        Dropdown,
        InputText,
        Textarea,
        Button,
        DateOfBirthSelect,
        Loading,
        NrcInput,
        PhoneInput,
        GmailInput,
    },
    setup() {
        return useEditResident();
    },
});
</script>
