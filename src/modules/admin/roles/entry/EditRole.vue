<template>
        <!-- <div class="admin-crud-header">
       
            <Button
                type="button"
                icon="pi pi-trash"
                @click="showConfirmDialog(state.id)"
            />
        </div> -->

        <div v-if="!isLoading" class="admin-panel relative">
            <form class="grid max-w-xl gap-4" @submit.prevent="handleSubmit">
                <div class="field">
                    <label for="name" class="mb-2 block text-sm font-semibold text-[var(--admin-text)]">Role Name</label>
                    <InputText id="name" v-model="state.name" class="w-full" />
                    <small v-if="errors.has('name')" class="p-error">
                        <div v-for="error in errors.get('name')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="flex gap-2">
                    <Button type="submit" label="Save"/>
                    <router-link :to="{ name: 'roleList' }">
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
                        class="mt-4"
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
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import useEditRole from './useEditRole';

export default defineComponent({
    name: 'EditRole',
    components: { ConfirmDialog, InputText, Button, Loading },
    setup() {
        return useEditRole();
    },
});
</script>
