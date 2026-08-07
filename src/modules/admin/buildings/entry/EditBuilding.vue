<template>
        <!-- <div class="flex justify-end p-5">
            <Button
                type="button"
                icon="pi pi-trash"
                text
                severity="danger"
                @click="showConfirmDialog(state.id)"
            />
        </div> -->

        <div class="admin-panel relative mx-auto max-w-6xl">
        <form
            class="grid grid-cols-1 gap-4 md:grid-cols-2"
            @submit.prevent="handleSubmit"
        >
               
                <div class="field">
                    <label for="building_name" class="mb-2 block text-md">{{ $t('property.buildingName') }}</label>
                    <InputText id="building_name" v-model="state.building_name" class="w-full" />
                    <small v-if="errors.has('building_name')" class="p-error">
                        <div v-for="error in errors.get('building_name')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field">
                    <label for="location" class="mb-2 block text-md">{{ $t('property.location') }}</label>
                    <InputText id="location" v-model="state.location" class="w-full" />
                    <small v-if="errors.has('location')" class="p-error">
                        <div v-for="error in errors.get('location')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="field md:col-span-2">
                    <label for="description" class="mb-2 block text-md">{{ $t('property.description') }}</label>
                    <Textarea id="description" v-model="state.description" class="w-full" rows="4" />
                    <small v-if="errors.has('description')" class="p-error">
                        <div v-for="error in errors.get('description')" :key="error">{{ error }}</div>
                    </small>
                </div>

                <div class="flex justify-end md:col-span-2 gap-2">
                    <Button type="submit" :label="$t('common.save')" />
                    <router-link :to="{ name: 'buildingList' }">
                        <Button type="button" :label="$t('common.cancel')"/>
                    </router-link>
                </div>
            </form>
        </div>

        <Loading v-if="isLoading" />

</template>

<script>
import { defineComponent } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Loading from '@/components/global/Loading.vue';
import useEditBuilding from './useEditBuilding';

export default defineComponent({
    name: 'EditBuilding',
    components: { InputText, Textarea, Button, Loading },
    setup() {
        return useEditBuilding();
    },
});
</script>
