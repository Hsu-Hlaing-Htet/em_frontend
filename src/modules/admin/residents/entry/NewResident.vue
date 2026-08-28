<template>
        <div class="admin-panel relative mx-auto max-w-6xl">
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

                <GmailInput v-model="state.email" :errors="errors" />

                <PhoneInput v-model="state.phone" :errors="errors" />

                <div class="field">
                    <NrcInput v-model="state.nrc" :errors="errors" />
                </div>

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
                <div class="col-span-1 flex gap-2 pt-2 md:col-span-2">
                    <Button type="submit" label="Save" />
                    <router-link :to="{ name: 'residentList' }">
                        <Button type="button" label="Cancel" />
                    </router-link>
                </div>
            </form>

            <Loading v-if="isLoading" />
        </div>
</template>

<script>
import { defineComponent } from 'vue';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import DateOfBirthSelect from '@/components/admin/DateOfBirthSelect.vue';
import NrcInput from '@/components/admin/NrcInput.vue';
import PhoneInput from '@/components/admin/PhoneInput.vue';
import GmailInput from '@/components/admin/GmailInput.vue';
import Loading from '@/components/global/Loading.vue';
import useNewResident from './useNewResident';

export default defineComponent({
    name: 'NewResident',
    components: {
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
        return useNewResident();
    },
});
</script>
