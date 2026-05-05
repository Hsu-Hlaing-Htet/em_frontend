<template>
    <div class="w-full h-screen flex justify-content-center align-items-center">
        <div class="grid">
            <div class="col-12 md:col-12 lg:col-12">
                <Card>
                    <template #content>
                        <p> Your password have been set! Please login again. </p>
                    </template>

                    <template #footer>
                        <Button 
                            label="Login"
                            @click="router.push('/login')"
                        />
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: "SetPasswordSuccess",
    setup() {

        const router = useRouter();

        return {
            router
        }
    }
});
</script>