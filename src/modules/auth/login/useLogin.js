import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/modules/auth/store';

export function useLogin() {
    const router = useRouter();
    const toast = useToast();
    const auth = useAuthStore();

    const loading = ref(false);
    const showPassword = ref(false);

    const form = reactive({
        email: '',
        password: '',
    });

    async function submit() {
        loading.value = true;

        try {
            const response = await auth.login(
                form.email,
                form.password
            );

            toast.add({
                severity: 'success',
                summary: 'Welcome',
                detail: 'Login successful.',
                life: 2500,
            });

            const navResult = await router.push(response.redirect_to);

            // #region agent log
            fetch('http://127.0.0.1:7923/ingest/23465e0c-eb0a-42c6-a1cf-6932802664b7',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'516e3b'},body:JSON.stringify({sessionId:'516e3b',location:'useLogin.js:afterPush',message:'after router.push',data:{navResult,currentRoute:router.currentRoute.value.fullPath},timestamp:Date.now(),hypothesisId:'H4'})}).catch(()=>{});
        } catch (error) {
            toast.add({
                severity: 'error',
                summary: 'Login Failed',
                detail:
                    error.response?.data?.message ||
                    'Invalid credentials.',
                life: 3500,
            });
        } finally {
            loading.value = false;
        }
    }

    return {
        form,
        loading,
        showPassword,
        submit,
    };
}