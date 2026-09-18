import { ref } from 'vue';

const pendingOpen = ref(false);

export function useAssistantChat() {
    function requestOpenAssistant() {
        pendingOpen.value = true;
    }

    function consumeAssistantOpenRequest() {
        if (!pendingOpen.value) {
            return false;
        }

        pendingOpen.value = false;

        return true;
    }

    return {
        pendingOpen,
        requestOpenAssistant,
        consumeAssistantOpenRequest,
    };
}
