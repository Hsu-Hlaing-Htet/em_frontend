<template>
    <div class="w-full h-screen flex justify-content-center align-items-center">
        <div class="grid">
            <div class="col-12 md:col-12 lg:col-12">
                <Card v-if="!display">
                    <template #title> Set Password </template>
                    <template #content> 
                        <div class="form-grid">
                            <div class="col-12 mt-3">
                                <label class="text-bolder"> Password </label>
                                <InputText 
                                    class="w-full"
                                    type="password"
                                    placeholder="New password"
                                    v-model="state.password"
                                />
                                <small v-if="errors" class="p-error">
                                    <div v-for="error in errors.password" :key="error"> {{ error }} </div>
                                </small>
                            </div>

                            <div class="col-12 mt-3">
                                <label class="text-bolder"> Confirmation Password </label>
                                <InputText 
                                    class="w-full"
                                    type="password"
                                    placeholder="Confirm password"
                                    v-model="state.password_confirmation"
                                />
                                <small v-if="errors" class="p-error">
                                    <div v-for="error in errors.password_confirmation" :key="error"> {{ error }} </div>
                                </small>
                            </div>

                            <div class="col-12">
                                <Button 
                                    class="mt-label-adjustment"
                                    label="Set Password"
                                    @click="setPassword"
                                />
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
        </div>
    </div>

    <Dialog 
        class="col-12 md:col-6 lg:col-6"
        header="Invalid User" 
        v-model:visible="display" 
        :breakpoints="{'960px': '75vw', '640px': '100vw'}"
        :closable="false"
    >
        <div class="grid">
            <div class="col-12"> 
                <p> User is not verify. Please try again. </p>
            </div>

            <div class="col-12">
                <Button 
                    label="Back" 
                    @click="back()"
                />
            </div>
        </div>
	    
    </Dialog>
    <Loading v-if="isLoading"></Loading>
</template>

<script>
import { defineComponent } from 'vue';
import { useSetPassword } from '@/pages/useSetPassword';

export default defineComponent({
    name: "SetPassword",
    setup() {
        
        const {
            isLoading,
            state,
            errors,
            display,
            setPassword,
            back,
        } = useSetPassword();

        return {
            isLoading,
            state,
            errors,
            display,
            back,
            setPassword
        }
    }
});
</script>

<style>
.text-bolder {
    font-weight: bolder;
}

.mt-label-adjustment {
    margin-top: 30px;
}
</style>