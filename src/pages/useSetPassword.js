
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { authService } from "@/modules/auth/service";

export const useSetPassword = () => {

    const auth = authService;
    const route = useRoute();
    const router = useRouter();
    const isLoading = ref(false);
    const display = ref(null);
    const errors = ref([]);

    const state = reactive({
        password: "",
        password_confirmation: ""
    });

    const setPassword = async () => {
        isLoading.value = true;
        const response = await auth.setPassword(route.params.token, state);
        
        if(response.status === 422) {
            errors.value = response.data.data;
            isLoading.value = false;
            return;
        }

        isLoading.value = false;
        router.push("/set-password/success");
    }

    const back = async () => {
        router.push('/');
    }

    onMounted(async () => {
        isLoading.value = true;

        const response = await auth.verifyToken({ token : route.params.token });

        if(response.status === 422) {
            display.value = true;
            isLoading.value = false;
            return;
        }

        isLoading.value = false;
    });

    return {
        isLoading,
        errors,
        state,
        display,
        setPassword,
        back
    }
}