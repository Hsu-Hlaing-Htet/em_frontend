import { useToast } from 'primevue/usetoast';
import { normalizeToastOptions } from '@/utils/toast';

export function useAppToast() {
    const toast = useToast();

    return {
        add(payload) {
            toast.add(normalizeToastOptions(payload));
        },
    };
}
