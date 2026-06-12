<script setup>
import { nextTick, onBeforeUnmount, ref } from 'vue';

defineProps({
    visible: {
        type: Boolean,
        default: true,
    },
    contextLabel: {
        type: String,
        default: 'Property concierge',
    },
    question: {
        type: String,
        default: 'Have a question about this property?',
    },
    phone: {
        type: String,
        default: '+95 988 768 8367',
    },
});

const isOpen = ref(false);
const message = ref('');
const typing = ref(false);
const messagesPanel = ref(null);
const messages = ref([
    {
        id: 'welcome',
        sender: 'support',
        text: 'Welcome to Rosewood Royale. Tell us what kind of home, rental, or viewing support you need today.',
    },
]);

let typingTimer = null;

function openChat() {
    isOpen.value = true;
    scrollToLatestMessage();
}

function minimizeChat() {
    isOpen.value = false;
}

function scrollToLatestMessage() {
    nextTick(() => {
        if (messagesPanel.value) {
            messagesPanel.value.scrollTop = messagesPanel.value.scrollHeight;
        }
    });
}

function sendMessage() {
    const value = message.value.trim();

    if (!value || typing.value) {
        return;
    }

    messages.value.push({
        id: `guest-${Date.now()}`,
        sender: 'guest',
        text: value,
    });
    message.value = '';
    typing.value = true;
    scrollToLatestMessage();

    typingTimer = window.setTimeout(() => {
        messages.value.push({
            id: `support-${Date.now()}`,
            sender: 'support',
            text: 'Thank you. Our concierge team can help with availability, pricing, and viewing times. Please share your preferred township or move-in date.',
        });
        typing.value = false;
        scrollToLatestMessage();
    }, 950);
}

onBeforeUnmount(() => {
    if (typingTimer) {
        window.clearTimeout(typingTimer);
    }
});
</script>

<template>
    <div v-if="visible" class="fixed bottom-5 left-4 right-4 z-[70] sm:left-auto sm:right-6 sm:w-[22rem] md:right-8">
        <Transition name="chat-card">
            <button
                v-if="!isOpen"
                type="button"
                class="chat-float-card group w-full rounded-lg border border-[#d6b8c1]/80 bg-white/95 px-5 py-4 text-left shadow-[0_18px_55px_rgba(85,32,50,0.22)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#552032]/50 hover:shadow-[0_26px_70px_rgba(85,32,50,0.28)]"
                @click="openChat"
            >
                <div class="flex items-start gap-4">
                    <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#552032] text-lg text-white shadow-lg shadow-[#552032]/20 transition duration-300 group-hover:scale-105">
                        <img
                            src="@/assets/images/logo-dark.jpg"
                            alt="Rosewood Royale"
                            class="h-full w-full object-cover"
                        >
                    </span>

                    <span class="min-w-0 flex-1">
                        <span class="flex items-center justify-between gap-3">
                            <span class="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                                Need Help?
                            </span>
                            <span class="inline-flex items-center gap-1.5 px-3.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-green-600">
                                <span class="h-2 w-2 rounded-full bg-green-600" />
                                Online
                            </span>
                        </span>

                        <span class="mt-1 block text-base text-gray-950">
                            {{ question }}
                        </span>
                        <span class="mt-2 flex items-center gap-2 text-sm text-[#552032]">
                            <i class="fas fa-phone text-xs" />
                            {{ phone }}
                        </span>
                    </span>
                </div>
            </button>
        </Transition>

        <Transition name="chat-panel">
            <section
                v-if="isOpen"
                class="overflow-hidden rounded-lg border border-white/70 bg-white/90 shadow-[0_30px_90px_rgba(85,32,50,0.3)] backdrop-blur-2xl"
                aria-label="Live chat"
            >
                <header class="border-b-2 border-[#552032] bg-white/25 px-3 py-3 text-white">
                    <div class="flex items-start justify-between gap-2">
                        <div>           
                            <p class="mt-1 mb-0 text-lg font-semibold text-[#552032]">
                                Rosewood live chat
                            </p>
                            <span class="mt-2 mb-0 inline-flex items-center gap-2 text-xs text-green-600">
                                <span class="h-1.5 w-1.5 rounded-full bg-green-600" />
                                Online support available
                            </span>
                        </div>

                        <button
                            type="button"
                            class="flex h-7 w-7 items-center justify-center text-gray-400 transition duration-300 hover:text-[#552032]"
                            aria-label="Minimize chat"
                            @click="minimizeChat"
                        >
                            <i class="fas fa-minus" />
                        </button>
                    </div>
                </header>

                <div ref="messagesPanel" class="max-h-[21rem] space-y-4 overflow-y-auto px-5 py-5">
                    <div
                        v-for="item in messages"
                        :key="item.id"
                        class="flex"
                        :class="item.sender === 'guest' ? 'justify-end' : 'justify-start'"
                    >
                        <p
                            class="m-0 max-w-[82%] rounded-xl px-4 py-3 text-sm leading-6 shadow-sm"
                            :class="item.sender === 'guest'
                                ? 'bg-[#552032] text-white'
                                : 'bg-white text-gray-700 ring-1 ring-[#d6b8c1]/60'"
                        >
                            {{ item.text }}
                        </p>
                    </div>

                    <div v-if="typing" class="flex justify-start">
                        <div class="typing-indicator rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-[#d6b8c1]/60">
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                </div>

                <form class="border-t border-[#d6b8c1]/45 bg-white/80 p-4" @submit.prevent="sendMessage">
                    <div class="flex items-center gap-3 rounded-xl border border-[#d6b8c1]/80 bg-white px-3 py-2 shadow-inner shadow-[#552032]/5 transition duration-300 focus-within:border-[#552032]">
                        <input
                            v-model="message"
                            type="text"
                            class="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                            placeholder="Type your message..."
                        >
                        <button
                            type="submit"
                            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#552032] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#6d2a40] disabled:cursor-not-allowed disabled:opacity-45"
                            :disabled="!message.trim() || typing"
                            aria-label="Send message"
                        >
                            <i class="fas fa-paper-plane text-sm" />
                        </button>
                    </div>
                </form>
            </section>
        </Transition>
    </div>
</template>

<style scoped>
.chat-float-card {
    animation: luxuryFloat 4s ease-in-out infinite;
    transform-origin: bottom right;
}

.chat-card-enter-active,
.chat-card-leave-active,
.chat-panel-enter-active,
.chat-panel-leave-active {
    transition: opacity 360ms ease, transform 360ms ease;
}

.chat-card-enter-from,
.chat-card-leave-to {
    opacity: 0;
    transform: translateY(14px) scale(0.96);
}

.chat-panel-enter-from,
.chat-panel-leave-to {
    opacity: 0;
    transform: translateY(18px) scale(0.9);
}

.typing-indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
}

.typing-indicator span {
    width: 0.42rem;
    height: 0.42rem;
    border-radius: 999px;
    background: #552032;
    animation: typingPulse 1s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 120ms;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 240ms;
}

@keyframes typingPulse {
    0%,
    80%,
    100% {
        opacity: 0.35;
        transform: translateY(0);
    }

    40% {
        opacity: 1;
        transform: translateY(-4px);
    }
}

@keyframes luxuryFloat {
    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-7px);
    }
}

@media (prefers-reduced-motion: reduce) {
    .chat-float-card,
    .typing-indicator span {
        animation: none;
    }
}
</style>
