<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/modules/auth/store';
import { askPropertyQuestion, askRentQuestion } from '@/services/aiChatService';

const props = defineProps({
    visible: {
        type: Boolean,
        default: true,
    },
    propertyId: {
        type: [Number, String],
        default: null,
    },
    propertyName: {
        type: String,
        default: '',
    },
});

const router = useRouter();
const authStore = useAuthStore();

const isOpen = ref(false);
const activeTab = ref('property'); // 'property' | 'rent'
const inputMessage = ref('');
const isTyping = ref(false);
const messagesPanel = ref(null);
const errorMessage = ref('');

const isAuthenticated = computed(() => Boolean(authStore.isAuthenticated));
const isCustomer = computed(() => authStore.role === 'customer');

const defaultWelcome = {
    property: 'Hello! I am your Rosewood Royale Property Concierge. Ask me anything about available rentals, sales, unit sizes, deposits, or amenities.',
    rent: 'Welcome back! I am your Rent Assistant. Ask me about your active leases, upcoming rent due dates, invoices, or payment history.',
};

const messages = ref([
    {
        id: 'welcome-1',
        tab: 'property',
        sender: 'assistant',
        text: defaultWelcome.property,
        timestamp: new Date(),
    },
]);

const propertyPrompts = [
    'What rental units are currently available?',
    'What is the deposit requirement for rentals?',
    'Show me units under $2,000/month',
    'Are there any 2-bedroom residences?',
];

const rentPrompts = [
    'How much rent do I currently owe?',
    'When is my next rent payment due?',
    'Do I have any unpaid invoices?',
    'What is the status of my active contract?',
];

const activePrompts = computed(() => {
    return activeTab.value === 'property' ? propertyPrompts : rentPrompts;
});

const filteredMessages = computed(() => {
    return messages.value.filter((m) => !m.tab || m.tab === activeTab.value);
});

watch(activeTab, (newTab) => {
    const hasTabMessage = messages.value.some((m) => m.tab === newTab);
    if (!hasTabMessage) {
        messages.value.push({
            id: `welcome-${newTab}`,
            tab: newTab,
            sender: 'assistant',
            text: defaultWelcome[newTab],
            timestamp: new Date(),
        });
    }
    scrollToBottom();
});

function openChat() {
    isOpen.value = true;
    scrollToBottom();
}

function minimizeChat() {
    isOpen.value = false;
}

function selectTab(tab) {
    activeTab.value = tab;
    errorMessage.value = '';
}

function scrollToBottom() {
    nextTick(() => {
        if (messagesPanel.value) {
            messagesPanel.value.scrollTop = messagesPanel.value.scrollHeight;
        }
    });
}

function selectQuickPrompt(promptText) {
    inputMessage.value = promptText;
    sendMessage();
}

async function sendMessage() {
    const text = inputMessage.value.trim();
    if (!text || isTyping.value) return;

    errorMessage.value = '';

    // Check auth for rent tab
    if (activeTab.value === 'rent' && !isAuthenticated.value) {
        messages.value.push({
            id: `msg-${Date.now()}`,
            tab: 'rent',
            sender: 'user',
            text,
            timestamp: new Date(),
        });
        inputMessage.value = '';
        messages.value.push({
            id: `msg-auth-${Date.now()}`,
            tab: 'rent',
            sender: 'assistant',
            text: 'To access your rent, contract, and invoice information, please log in with your resident/customer account.',
            requiresLogin: true,
            timestamp: new Date(),
        });
        scrollToBottom();
        return;
    }

    messages.value.push({
        id: `user-${Date.now()}`,
        tab: activeTab.value,
        sender: 'user',
        text,
        timestamp: new Date(),
    });

    inputMessage.value = '';
    isTyping.value = true;
    scrollToBottom();

    try {
        let response;
        if (activeTab.value === 'property') {
            response = await askPropertyQuestion({
                question: text,
                propertyId: props.propertyId || null,
            });
        } else {
            response = await askRentQuestion({
                question: text,
                token: authStore.token,
            });
        }

        messages.value.push({
            id: `assistant-${Date.now()}`,
            tab: activeTab.value,
            sender: 'assistant',
            text: response?.answer || 'I could not retrieve an answer at this moment.',
            properties: response?.properties || [],
            profile: response?.profile || null,
            timestamp: new Date(),
        });
    } catch (err) {
        console.error('Chatbot request error:', err);
        const detail = err.response?.data?.detail || err.message;
        errorMessage.value = 'AI service temporarily unavailable. Make sure em_ai is running on port 8001.';
        messages.value.push({
            id: `error-${Date.now()}`,
            tab: activeTab.value,
            sender: 'assistant',
            text: 'I apologize, but I cannot connect to the AI assistant right now. Please ensure the AI service is running or try again in a moment.',
            isError: true,
            timestamp: new Date(),
        });
    } finally {
        isTyping.value = false;
        scrollToBottom();
    }
}

function formatMarkdown(text) {
    if (!text) return '';
    // Basic safe formatting for bold, bullets, and line breaks
    let formatted = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        .replace(/^• (.*?)$/gm, '<span class="chat-bullet">• $1</span>')
        .replace(/\n/g, '<br />');

    return formatted;
}

function goToLogin() {
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } });
}
</script>

<template>
    <div v-if="visible" class="floating-chat-container fixed bottom-5 left-4 right-4 z-[70] sm:left-auto sm:right-6 sm:w-[26rem] md:right-8">
        <!-- Floating Launcher Pill -->
        <Transition name="chat-card">
            <button
                v-if="!isOpen"
                type="button"
                class="chat-float-card group w-full rounded-2xl border border-[var(--rw-border)] bg-rw-surface px-5 py-3.5 text-left shadow-[var(--rw-shadow)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[var(--rw-primary-deep)]/60 hover:shadow-2xl"
                @click="openChat"
            >
                <div class="flex items-center gap-4">
                    <span class="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--rw-brand)] text-white shadow-md shadow-[var(--rw-brand)]/25 transition duration-300 group-hover:scale-105">
                        <i class="fas fa-robot text-lg text-white" />
                        <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 ring-2 ring-white" />
                        </span>
                    </span>

                    <span class="min-w-0 flex-1">
                        <span class="flex items-center justify-between gap-2">
                            <span class="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-rw-muted">
                                AI Concierge & Rent
                            </span>
                            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 rounded-full">
                                <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Online
                            </span>
                        </span>

                        <span class="mt-0.5 block text-sm font-semibold text-rw truncate">
                            {{ propertyName ? `Ask about ${propertyName}` : 'Ask about properties or your rent' }}
                        </span>
                    </span>
                </div>
            </button>
        </Transition>

        <!-- Expanded Chat Box -->
        <Transition name="chat-panel">
            <section
                v-if="isOpen"
                class="chat-panel-box flex flex-col h-[32rem] overflow-hidden rounded-2xl border border-[var(--rw-border)] bg-rw-surface shadow-2xl backdrop-blur-2xl transition-all duration-300"
                aria-label="Rosewood AI Assistant"
            >
                <!-- Header -->
                <header class="border-b border-[var(--rw-border)] bg-gradient-to-r from-[var(--rw-brand)] to-[var(--rw-primary-deep)] px-4 py-3.5 text-white shadow-sm">
                    <div class="flex items-center justify-between gap-3">
                        <div class="flex items-center gap-3 min-w-0">
                            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white shadow-inner">
                                <i class="fas fa-sparkles text-sm text-amber-300" />
                            </span>
                            <div class="min-w-0">
                                <h3 class="m-0 text-sm font-bold text-white tracking-wide truncate">
                                    Rosewood AI Concierge
                                </h3>
                                <p class="m-0 text-[0.7rem] text-white/80 flex items-center gap-1.5">
                                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    Property & Rent Assistant
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center gap-1">
                            <button
                                type="button"
                                class="flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white"
                                aria-label="Minimize chat"
                                @click="minimizeChat"
                            >
                                <i class="fas fa-minus text-xs" />
                            </button>
                        </div>
                    </div>

                    <!-- Mode Tabs -->
                    <div class="mt-3 flex gap-2 rounded-xl bg-black/20 p-1">
                        <button
                            type="button"
                            class="flex-1 rounded-lg py-1.5 px-3 text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5"
                            :class="activeTab === 'property' ? 'bg-white text-[var(--rw-brand)] shadow-sm' : 'text-white/80 hover:text-white'"
                            @click="selectTab('property')"
                        >
                            <i class="fas fa-building text-[0.7rem]" />
                            <span>Properties</span>
                        </button>
                        <button
                            type="button"
                            class="flex-1 rounded-lg py-1.5 px-3 text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5"
                            :class="activeTab === 'rent' ? 'bg-white text-[var(--rw-brand)] shadow-sm' : 'text-white/80 hover:text-white'"
                            @click="selectTab('rent')"
                        >
                            <i class="fas fa-key text-[0.7rem]" />
                            <span>My Rent</span>
                            <span v-if="isAuthenticated && isCustomer" class="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </button>
                    </div>
                </header>

                <!-- Messages Panel -->
                <div
                    ref="messagesPanel"
                    class="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-rw-surface text-rw scroll-smooth"
                >
                    <div
                        v-for="item in filteredMessages"
                        :key="item.id"
                        class="flex flex-col"
                        :class="item.sender === 'user' ? 'items-end' : 'items-start'"
                    >
                        <div
                            class="max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm transition"
                            :class="item.sender === 'user'
                                ? 'bg-[var(--rw-primary-deep)] text-white rounded-tr-none'
                                : item.isError
                                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 rounded-tl-none'
                                    : 'bg-rw-surface-soft text-rw border border-[var(--rw-border)] rounded-tl-none'"
                        >
                            <!-- Render Markdown -->
                            <div class="chat-message-content" v-html="formatMarkdown(item.text)" />

                            <!-- Login CTA if needed -->
                            <div v-if="item.requiresLogin" class="mt-3 pt-2 border-t border-[var(--rw-border)]">
                                <button
                                    type="button"
                                    class="w-full py-1.5 px-3 rounded-lg bg-[var(--rw-primary-deep)] text-white font-semibold text-xs transition hover:opacity-90 flex items-center justify-center gap-1.5"
                                    @click="goToLogin"
                                >
                                    <i class="fas fa-sign-in-alt text-xs" />
                                    <span>Sign in to Customer Portal</span>
                                </button>
                            </div>
                        </div>

                        <span class="mt-1 px-1 text-[0.65rem] text-rw-muted">
                            {{ item.sender === 'user' ? 'You' : 'Concierge AI' }}
                        </span>
                    </div>

                    <!-- Typing Indicator -->
                    <div v-if="isTyping" class="flex items-center gap-2 text-rw-muted text-xs py-1">
                        <div class="typing-indicator rounded-xl bg-rw-surface-soft px-3.5 py-2.5 border border-[var(--rw-border)] shadow-sm">
                            <span />
                            <span />
                            <span />
                        </div>
                        <span class="text-[0.7rem]">Gathering details...</span>
                    </div>
                </div>

                <!-- Quick Prompts Chips -->
                <div class="border-t border-[var(--rw-border)]/60 bg-rw-surface-soft/60 px-3 py-2 overflow-x-auto no-scrollbar">
                    <div class="flex items-center gap-1.5 w-max">
                        <button
                            v-for="(prompt, idx) in activePrompts"
                            :key="idx"
                            type="button"
                            class="rounded-full border border-[var(--rw-border)] bg-rw-surface px-3 py-1 text-[0.7rem] text-rw-muted font-medium transition hover:border-[var(--rw-primary-deep)] hover:text-[var(--rw-primary-deep)] hover:bg-[var(--rw-primary-deep)]/5 whitespace-nowrap"
                            :disabled="isTyping"
                            @click="selectQuickPrompt(prompt)"
                        >
                            {{ prompt }}
                        </button>
                    </div>
                </div>

                <!-- Input Footer -->
                <footer class="border-t border-[var(--rw-border)] bg-rw-surface p-3">
                    <form class="flex items-center gap-2" @submit.prevent="sendMessage">
                        <div class="relative flex-1 flex items-center rounded-xl border border-[var(--rw-border)] bg-rw-surface px-3 py-1.5 shadow-inner transition focus-within:border-[var(--rw-primary-deep)] focus-within:ring-1 focus-within:ring-[var(--rw-primary-deep)]/30">
                            <input
                                v-model="inputMessage"
                                type="text"
                                class="w-full bg-transparent py-1 text-xs sm:text-sm text-rw outline-none placeholder:text-rw-muted"
                                :placeholder="activeTab === 'property' ? 'Ask about rooms, prices, amenities...' : 'Ask about your rent, balance, due dates...'"
                                :disabled="isTyping"
                            >
                        </div>
                        <button
                            type="submit"
                            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--rw-primary-deep)] text-white shadow transition duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                            :disabled="!inputMessage.trim() || isTyping"
                            aria-label="Send message"
                        >
                            <i class="fas fa-paper-plane text-xs" />
                        </button>
                    </form>
                </footer>
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
    transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1), transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.chat-card-enter-from,
.chat-card-leave-to {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
}

.chat-panel-enter-from,
.chat-panel-leave-to {
    opacity: 0;
    transform: translateY(16px) scale(0.94);
}

.typing-indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
}

.typing-indicator span {
    width: 0.38rem;
    height: 0.38rem;
    border-radius: 999px;
    background: var(--rw-primary-deep);
    animation: typingPulse 1s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 150ms;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 300ms;
}

@keyframes typingPulse {
    0%, 80%, 100% {
        opacity: 0.3;
        transform: translateY(0);
    }
    40% {
        opacity: 1;
        transform: translateY(-3px);
    }
}

@keyframes luxuryFloat {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-5px);
    }
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

:deep(.chat-bullet) {
    display: block;
    margin-left: 0.35rem;
    margin-top: 0.15rem;
}
</style>
