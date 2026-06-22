<template>
        <div class="admin-panel relative mx-auto max-w-6xl">
            <form
                class="grid grid-cols-1 gap-4 md:grid-cols-2"
                @submit.prevent="handleSubmit"
            >
                <div class="field">
                    <label class="mb-2 block text-md">Role</label>
                    <Dropdown
                        v-model="state.role_id"
                        :options="roleOptions"
                        option-label="label"
                        option-value="value"
                        placeholder="Select role"
                        class="w-full"
                    />
                    <small v-if="errors.has('role_id')" class="p-error">
                        <div v-for="error in errors.get('role_id')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Name</label>
                    <InputText v-model="state.name" class="w-full" />
                    <small v-if="errors.has('name')" class="p-error">
                        <div v-for="error in errors.get('name')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Email</label>
                    <InputText v-model="state.email" type="email" class="w-full" />
                    <small v-if="errors.has('email')" class="p-error">
                        <div v-for="error in errors.get('email')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Password</label>
                    <Password
                        v-model="state.password"
                        toggle-mask
                        :feedback="false"
                        class="w-full"
                        input-class="w-full"
                    />
                    <small v-if="errors.has('password')" class="p-error">
                        <div v-for="error in errors.get('password')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Phone</label>
                    <InputText v-model="state.phone" class="w-full" />
                    <small v-if="errors.has('phone')" class="p-error">
                        <div v-for="error in errors.get('phone')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">NRC</label>
                    <InputText v-model="state.nrc" class="w-full" />
                    <small v-if="errors.has('nrc')" class="p-error">
                        <div v-for="error in errors.get('nrc')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field">
                    <label class="mb-2 block text-md">Date of Birth</label>
                    <Calendar v-model="state.dob" date-format="yy-mm-dd" class="w-full" show-icon />
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
                    <Button type="submit" label="Save"/>
                    <router-link :to="{ name: 'staffList' }">
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
import Calendar from 'primevue/calendar';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Loading from '@/components/Loading.vue';
import useNewStaff from './useNewStaff';

export default defineComponent({
    name: 'NewStaff',
    components: { Dropdown, InputText, Textarea, Calendar, Password, Button, Loading },
    setup() {
        return useNewStaff();
    },
});
</script>
