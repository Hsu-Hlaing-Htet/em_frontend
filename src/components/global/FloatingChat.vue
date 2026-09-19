<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ChatPropertyCard from '@/components/global/ChatPropertyCard.vue';
import { askPropertyQuestion } from '@/modules/public/service';
import { service as customerService } from '@/modules/customer/service';
import { useAssistantChat } from '@/composables/shared/useAssistantChat';

const props = defineProps({
    visible: {
        type: Boolean,
        default: true,
    },
    mode: {
        type: String,
        default: 'property',
        validator: (value) => ['property', 'rent'].includes(value),
    },
    contextLabel: {
        type: String,
        default: 'Online Property Assistant',
    },
    question: {
        type: String,
        default: 'Ask the Rosewood AI Concierge about residences.',
    },
    phone: {
        type: String,
        default: '+95 988 768 8367',
    },
    listingPurpose: {
        type: String,
        default: 'sale',
        validator: (value) => ['rent', 'sale'].includes(value),
    },
    propertyId: {
        type: [Number, String],
        default: null,
    },
});

const PROPERTY_WELCOME = `Welcome to Rosewood Royale.

I'm your AI Property Concierge.`;

const WELCOME_CAPABILITIES = [
    'Find available properties',
    'Check rental prices',
    'Explore locations',
    'View property details',
    'Connect with our team',
];

const QUICK_ACTIONS = [
    {
        id: 'rentals',
        label: 'Find Rental Homes',
        icon: 'fa-house',
        message: 'I am looking for available rental homes at Rosewood Royale.',
        purpose: 'rent',
    },
    {
        id: 'sale',
        label: 'Properties For Sale',
        icon: 'fa-house-chimney',
        message: 'Please show me Rosewood Royale properties for sale.',
        purpose: 'sale',
    },
    {
        id: 'yangon',
        label: 'Properties in Yangon',
        icon: 'fa-location-dot',
        message: 'Show me available Rosewood Royale properties in Yangon.',
        purpose: null,
    },
    {
        id: 'pricing',
        label: 'Ask About Pricing',
        icon: 'fa-coins',
        message: 'Can you help me understand pricing for Rosewood Royale residences?',
        purpose: null,
    },
    {
        id: 'details',
        label: 'View Property Details',
        icon: 'fa-building',
        message: 'I would like to view details of available Rosewood Royale properties.',
        purpose: null,
    },
    {
        id: 'contact',
        label: 'Contact Agent',
        icon: 'fa-phone',
        message: 'I would like to connect with a Rosewood Royale agent.',
        purpose: null,
        navigateToContact: true,
    },
];

const route = useRoute();
const router = useRouter();
const isOpen = ref(false);
const message = ref('');
const typing = ref(false);
const loadingLabel = ref('');
const messagesPanel = ref(null);
const activePurpose = ref(props.listingPurpose);
const nearFooter = ref(false);
const { pendingOpen, consumeAssistantOpenRequest } = useAssistantChat();

let footerObserver = null;

function createSupportMessage(text, id = null, properties = []) {
    return {
        id: id || `support-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sender: 'support',
        text,
        properties: Array.isArray(properties) ? properties : [],
        createdAt: new Date(),
    };
}

function createGuestMessage(text) {
    return {
        id: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sender: 'guest',
        text,
        properties: [],
        createdAt: new Date(),
    };
}

const welcomeText = computed(() => {
    if (props.mode === 'rent') {
        return 'Welcome to Rosewood Royale. Ask about your lease, invoices, payments, or account details and I will answer from your portal data.';
    }

    return PROPERTY_WELCOME;
});

const headerTitle = computed(() => (
    props.mode === 'rent' ? 'Rosewood Rent Assistant' : 'Rosewood AI Concierge'
));

const headerSubtitle = computed(() => (
    props.mode === 'rent' ? props.contextLabel : 'Online Property Assistant'
));

const messages = ref([
    createSupportMessage(
        props.mode === 'rent'
            ? 'Welcome to Rosewood Royale. Ask about your lease, invoices, payments, or account details and I will answer from your portal data.'
            : PROPERTY_WELCOME,
        'welcome',
    ),
]);

const showQuickActions = computed(() => (
    props.mode === 'property'
    && !typing.value
    && !messages.value.some((item) => item.sender === 'guest')
));

watch(welcomeText, (text) => {
    const welcome = messages.value.find((item) => item.id === 'welcome');
    if (welcome) {
        welcome.text = text;
    }
});

watch(
    () => props.listingPurpose,
    (value) => {
        activePurpose.value = value;
    },
);

watch(pendingOpen, (shouldOpen) => {
    if (shouldOpen) {
        consumeAssistantOpenRequest();
        openChat();
    }
});

watch(
    () => route.query.openAssistant,
    (value) => {
        if (value) {
            openChat();
            const nextQuery = { ...route.query };
            delete nextQuery.openAssistant;
            router.replace({ query: nextQuery });
        }
    },
    { immediate: true },
);

function formatTimestamp(value) {
    if (!(value instanceof Date)) {
        return '';
    }

    return new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit',
    }).format(value);
}

function openChat() {
    isOpen.value = true;
    scrollToLatestMessage();
}

function minimizeChat() {
    isOpen.value = false;
}

function onEscape(event) {
    if (event.key === 'Escape' && isOpen.value) {
        minimizeChat();
    }
}

function scrollToLatestMessage() {
    nextTick(() => {
        if (messagesPanel.value) {
            messagesPanel.value.scrollTop = messagesPanel.value.scrollHeight;
        }
    });
}

function friendlyErrorMessage() {
    return 'Sorry, I’m unable to access property information at the moment.\n\nPlease try again shortly.';
}

function resolvePurposeForQuestion(questionText, actionPurpose = null) {
    if (actionPurpose === 'rent' || actionPurpose === 'sale') {
        return actionPurpose;
    }

    const lowered = questionText.toLowerCase();
    if (/(rent|rental|lease|monthly)/.test(lowered)) {
        return 'rent';
    }
    if (/(sale|buy|purchase|for sale)/.test(lowered)) {
        return 'sale';
    }

    return activePurpose.value || props.listingPurpose || 'sale';
}

async function sendMessage(rawValue = null, options = {}) {
    const value = (rawValue ?? message.value).trim();

    if (!value || typing.value) {
        return;
    }

    if (options.navigateToContact) {
        messages.value.push(createGuestMessage(value));
        message.value = '';
        scrollToLatestMessage();
        router.push({ name: 'contact' });
        return;
    }

    const purpose = resolvePurposeForQuestion(value, options.purpose);
    activePurpose.value = purpose;

    messages.value.push(createGuestMessage(value));
    message.value = '';
    typing.value = true;
    loadingLabel.value = props.mode === 'property'
        ? 'Rosewood Concierge is searching for suitable residences...'
        : 'Rosewood assistant is reviewing your account...';
    scrollToLatestMessage();

    try {
        if (props.mode === 'rent') {
            const response = await customerService.askRentQuestion({ question: value });
            const answer = response?.data?.answer || response?.answer || '';

            messages.value.push(createSupportMessage(
                answer || 'I could not generate an answer. Please try rephrasing your question.',
            ));
        } else {
            const payload = {
                question: value,
                purpose,
            };

            if (props.propertyId !== null && props.propertyId !== '') {
                payload.property_id = Number(props.propertyId);
            }

            const response = await askPropertyQuestion(payload);
            const payloadData = response?.data?.data || response?.data || {};
            const answer = payloadData.answer || '';
            const properties = Array.isArray(payloadData.properties)
                ? payloadData.properties.slice(0, 4)
                : [];

            messages.value.push(createSupportMessage(
                answer || 'I could not generate an answer. Please try rephrasing your question.',
                null,
                properties,
            ));
        }
    } catch (error) {
        const exactMessage = error?.response?.data?.message
            || error?.data?.message
            || error?.response?.data?.detail
            || error?.data?.detail
            || null;

        messages.value.push(createSupportMessage(
            props.mode === 'property'
                ? (typeof exactMessage === 'string' && exactMessage.trim() !== ''
                    ? exactMessage
                    : friendlyErrorMessage())
                : 'Sorry, I’m unable to access your account information at the moment.\n\nPlease try again shortly.',
        ));
    } finally {
        typing.value = false;
        loadingLabel.value = '';
        scrollToLatestMessage();
    }
}

function onQuickAction(action) {
    sendMessage(action.message, {
        purpose: action.purpose,
        navigateToContact: Boolean(action.navigateToContact),
    });
}

onMounted(() => {
    document.addEventListener('keydown', onEscape);

    const footer = document.querySelector('[data-rosewood-footer], [data-public-footer]');
    if (footer && typeof IntersectionObserver !== 'undefined') {
        footerObserver = new IntersectionObserver(
            ([entry]) => {
                nearFooter.value = Boolean(entry?.isIntersecting);
            },
            { threshold: 0.08, rootMargin: '0px 0px 0px 0px' }
        );
        footerObserver.observe(footer);
    }
});

onBeforeUnmount(() => {
    typing.value = false;
    document.removeEventListener('keydown', onEscape);
    footerObserver?.disconnect();
    footerObserver = null;
});
</script>

<template>
    <div
        v-if="visible"
        class="rw-chat"
        :class="{ 'is-open': isOpen, 'is-near-footer': nearFooter }"
    >
        <Transition name="rw-chat-float">
            <button
                v-if="!isOpen"
                type="button"
                class="rw-chat__trigger"
                aria-label="Open Rosewood AI Concierge"
                title="Rosewood AI Concierge"
                @click="openChat"
            >
                <span class="rw-chat__trigger-logo">
                    <img
                        src="@/assets/images/logo-dark.jpg"
                        alt=""
                    >
                </span>
                <span class="rw-chat__trigger-copy">
                    <span class="rw-chat__trigger-title">Rosewood AI Concierge</span>
                    <span class="rw-chat__trigger-status">
                        <span class="rw-chat__dot" aria-hidden="true" />
                        Online
                    </span>
                </span>
            </button>
        </Transition>

        <Transition name="rw-chat-panel">
            <section
                v-if="isOpen"
                class="rw-chat__panel"
                aria-label="Rosewood AI Concierge"
            >
                <header class="rw-chat__header">
                    <div class="rw-chat__header-left">
                        <span class="rw-chat__avatar">
                            <img
                                src="@/assets/images/logo-dark.jpg"
                                alt=""
                            >
                        </span>
                        <div>
                            <h2>{{ headerTitle }}</h2>
                            <p>
                                <span class="rw-chat__dot" aria-hidden="true" />
                                {{ headerSubtitle }}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        class="rw-chat__minimize"
                        aria-label="Minimize chat"
                        @click="minimizeChat"
                    >
                        <i class="fas fa-minus" aria-hidden="true" />
                    </button>
                </header>

                <div
                    ref="messagesPanel"
                    class="rw-chat__messages"
                >
                    <div
                        v-for="item in messages"
                        :key="item.id"
                        class="rw-chat__message"
                        :class="item.sender === 'guest' ? 'is-user' : 'is-ai'"
                    >
                        <div
                            v-if="item.id === 'welcome' && mode === 'property'"
                            class="rw-chat__welcome"
                        >
                            <p class="rw-chat__welcome-title">I can help you</p>
                            <ul>
                                <li
                                    v-for="capability in WELCOME_CAPABILITIES"
                                    :key="capability"
                                >
                                    <i class="fas fa-check" aria-hidden="true" />
                                    <span>{{ capability }}</span>
                                </li>
                            </ul>
                        </div>

                        <div
                            v-else
                            class="rw-chat__bubble"
                        >
                            {{ item.text }}
                        </div>

                        <div
                            v-if="item.properties?.length"
                            class="rw-chat__properties"
                        >
                            <ChatPropertyCard
                                v-for="property in item.properties"
                                :key="`${item.id}-${property.id}`"
                                :property="property"
                            />
                        </div>

                        <span
                            v-if="item.createdAt"
                            class="rw-chat__time"
                        >
                            {{ formatTimestamp(item.createdAt) }}
                        </span>
                    </div>

                    <div
                        v-if="showQuickActions"
                        class="rw-chat__actions"
                    >
                        <button
                            v-for="action in QUICK_ACTIONS"
                            :key="action.id"
                            type="button"
                            class="rw-chat__action"
                            @click="onQuickAction(action)"
                        >
                            <i
                                class="fas"
                                :class="action.icon"
                                aria-hidden="true"
                            />
                            <span>{{ action.label }}</span>
                            <i
                                class="fas fa-arrow-right rw-chat__action-arrow"
                                aria-hidden="true"
                            />
                        </button>
                    </div>

                    <div
                        v-if="typing"
                        class="rw-chat__typing"
                    >
                        <div class="rw-chat__typing-dots" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                        </div>
                        <p>{{ loadingLabel }}</p>
                    </div>
                </div>

                <form
                    class="rw-chat__composer"
                    @submit.prevent="sendMessage()"
                >
                    <input
                        v-model="message"
                        type="text"
                        placeholder="Ask about residences, pricing, or locations..."
                        enterkeyhint="send"
                        autocomplete="off"
                        aria-label="Message"
                    >
                    <button
                        type="submit"
                        class="rw-chat__send"
                        :disabled="!message.trim() || typing"
                        aria-label="Send message"
                    >
                        <i class="fas fa-paper-plane" aria-hidden="true" />
                    </button>
                </form>
            </section>
        </Transition>
    </div>
</template>

<style scoped>
.rw-chat {
    --chat-bg: rgba(18, 18, 20, 0.94);
    --chat-surface: #17181b;
    --chat-raised: #202226;
    --chat-text: #f5f2ee;
    --chat-muted: #a9adb5;
    --chat-dim: #777b82;
    --chat-brand: #8f2338;
    --chat-brand-hover: #a92b47;
    --chat-border: rgba(255, 255, 255, 0.12);
    --chat-glass-border: rgba(255, 255, 255, 0.14);
    --chat-bottom: 24px;

    position: fixed;
    z-index: 70;
    right: 20px;
    bottom: var(--chat-bottom);
    width: auto;
    font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    transition: bottom 0.28s ease;
}

.rw-chat.is-open {
    width: min(360px, calc(100vw - 32px));
}

.rw-chat.is-near-footer {
    --chat-bottom: 140px;
}

.rw-chat__trigger {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    width: 240px;
    min-height: 58px;
    max-width: min(240px, calc(100vw - 40px));
    margin-left: auto;
    padding: 0.45rem 0.7rem 0.45rem 0.5rem;
    border-radius: 16px;
    border: 1px solid var(--chat-glass-border);
    background: var(--chat-bg);
    color: var(--chat-text);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    cursor: pointer;
    text-align: left;
    transition: border-color 0.25s ease, transform 0.25s ease, background 0.25s ease;
}

.rw-chat__trigger:hover,
.rw-chat__trigger:focus-visible {
    border-color: rgba(143, 35, 56, 0.55);
    transform: translateY(-1px);
    outline: none;
}

.rw-chat__trigger-logo,
.rw-chat__avatar {
    display: grid;
    place-items: center;
    overflow: hidden;
    border-radius: 10px;
    border: 1px solid rgba(143, 35, 56, 0.45);
    background: var(--chat-raised);
    flex-shrink: 0;
}

.rw-chat__trigger-logo {
    width: 32px;
    height: 32px;
}

.rw-chat__avatar {
    width: 36px;
    height: 36px;
}

.rw-chat__trigger-logo img,
.rw-chat__avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.rw-chat__trigger-copy {
    display: grid;
    gap: 0.12rem;
    min-width: 0;
}

.rw-chat__trigger-title {
    display: block;
    overflow: hidden;
    max-width: 100%;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    line-height: 1.25;
    color: var(--chat-text);
    white-space: nowrap;
    text-overflow: ellipsis;
    text-transform: none;
}

.rw-chat__trigger-status {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.62rem;
    color: var(--chat-muted);
}

.rw-chat__dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #22c55e;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
}

.rw-chat__panel {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: min(660px, 78vh);
    overflow: hidden;
    border-radius: 18px;
    border: 1px solid var(--chat-glass-border);
    background: var(--chat-bg);
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(22px);
    -webkit-backdrop-filter: blur(22px);
}

.rw-chat__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.9rem 1rem;
    border-bottom: 1px solid var(--chat-border);
    background: rgba(23, 24, 27, 0.72);
}

.rw-chat__header-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
}

.rw-chat__header h2 {
    margin: 0;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--chat-text);
    line-height: 1.15;
}

.rw-chat__header p {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin: 0.2rem 0 0;
    font-size: 0.72rem;
    color: var(--chat-muted);
}

.rw-chat__minimize {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: 8px;
    border: 1px solid var(--chat-border);
    background: transparent;
    color: var(--chat-muted);
    cursor: pointer;
    transition: color 0.25s ease, border-color 0.25s ease, background 0.25s ease;
}

.rw-chat__minimize:hover,
.rw-chat__minimize:focus-visible {
    color: var(--chat-text);
    border-color: rgba(255, 255, 255, 0.22);
    background: rgba(255, 255, 255, 0.04);
    outline: none;
}

.rw-chat__messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    max-height: min(420px, 48vh);
}

.rw-chat__message {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    animation: rw-chat-msg 0.28s ease both;
}

.rw-chat__message.is-user {
    align-items: flex-end;
}

.rw-chat__message.is-ai {
    align-items: flex-start;
}

.rw-chat__bubble {
    max-width: 88%;
    padding: 0.7rem 0.85rem;
    border-radius: 13px;
    font-size: 0.84rem;
    line-height: 1.55;
    white-space: pre-line;
}

.rw-chat__message.is-user .rw-chat__bubble {
    background: rgba(143, 35, 56, 0.88);
    color: #fff;
}

.rw-chat__message.is-ai .rw-chat__bubble {
    background: var(--chat-surface);
    color: var(--chat-muted);
    border: 1px solid var(--chat-border);
}

.rw-chat__welcome {
    width: 100%;
    max-width: 100%;
    padding: 0.9rem 0.95rem;
    border-radius: 13px;
    border: 1px solid var(--chat-border);
    background: var(--chat-surface);
}

.rw-chat__welcome-title {
    margin: 0 0 0.65rem;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.15rem;
    font-weight: 500;
    color: var(--chat-text);
}

.rw-chat__welcome ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.4rem;
}

.rw-chat__welcome li {
    display: flex;
    align-items: flex-start;
    gap: 0.55rem;
    color: var(--chat-muted);
    font-size: 0.8rem;
    line-height: 1.4;
}

.rw-chat__welcome i {
    margin-top: 0.15rem;
    color: var(--chat-brand);
    font-size: 0.62rem;
}

.rw-chat__properties {
    width: 100%;
    max-width: 100%;
    display: grid;
    gap: 0.65rem;
}

.rw-chat__time {
    font-size: 0.62rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--chat-dim);
}

.rw-chat__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.55rem;
}

.rw-chat__action {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 0.55rem;
    min-height: 68px;
    padding: 0.8rem 0.85rem;
    border-radius: 13px;
    border: 1px solid var(--chat-border);
    background: rgba(255, 255, 255, 0.02);
    color: var(--chat-text);
    text-align: left;
    cursor: pointer;
    transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
}

.rw-chat__action > i:first-child {
    color: var(--chat-brand);
    font-size: 0.82rem;
}

.rw-chat__action span {
    font-size: 0.78rem;
    font-weight: 500;
    line-height: 1.3;
}

.rw-chat__action-arrow {
    color: var(--chat-dim);
    font-size: 0.62rem;
    transition: transform 0.25s ease, color 0.25s ease;
}

.rw-chat__action:hover,
.rw-chat__action:focus-visible {
    transform: translateY(-2px);
    border-color: rgba(143, 35, 56, 0.55);
    background: rgba(255, 255, 255, 0.04);
    outline: none;
}

.rw-chat__action:hover .rw-chat__action-arrow,
.rw-chat__action:focus-visible .rw-chat__action-arrow {
    color: var(--chat-text);
    transform: translateX(3px);
}

.rw-chat__typing {
    display: grid;
    gap: 0.4rem;
}

.rw-chat__typing-dots {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    width: fit-content;
    padding: 0.65rem 0.8rem;
    border-radius: 13px;
    border: 1px solid var(--chat-border);
    background: var(--chat-surface);
}

.rw-chat__typing-dots span {
    width: 5px;
    height: 5px;
    border-radius: 999px;
    background: var(--chat-brand);
    opacity: 0.4;
    animation: rw-chat-typing 1s ease-in-out infinite;
}

.rw-chat__typing-dots span:nth-child(2) { animation-delay: 120ms; }
.rw-chat__typing-dots span:nth-child(3) { animation-delay: 240ms; }

.rw-chat__typing p {
    margin: 0;
    max-width: 92%;
    font-size: 0.72rem;
    line-height: 1.45;
    color: var(--chat-dim);
}

.rw-chat__composer {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.85rem 0.9rem 1rem;
    border-top: 1px solid var(--chat-border);
    background: rgba(23, 24, 27, 0.55);
}

.rw-chat__composer input {
    flex: 1;
    min-width: 0;
    min-height: 44px;
    padding: 0.65rem 0.9rem;
    border-radius: 14px;
    border: 1px solid var(--chat-border);
    background: rgba(255, 255, 255, 0.03);
    color: var(--chat-text);
    font-size: 0.84rem;
    outline: none;
    transition: border-color 0.25s ease, background 0.25s ease;
}

.rw-chat__composer input::placeholder {
    color: var(--chat-dim);
}

.rw-chat__composer input:focus {
    border-color: rgba(143, 35, 56, 0.65);
    background: rgba(255, 255, 255, 0.045);
}

.rw-chat__send {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 999px;
    background: var(--chat-brand);
    color: #fff;
    cursor: pointer;
    transition: background 0.25s ease, transform 0.25s ease;
}

.rw-chat__send:hover:not(:disabled),
.rw-chat__send:focus-visible:not(:disabled) {
    background: var(--chat-brand-hover);
    transform: scale(1.03);
    outline: none;
}

.rw-chat__send:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.rw-chat-float-enter-active,
.rw-chat-float-leave-active,
.rw-chat-panel-enter-active,
.rw-chat-panel-leave-active {
    transition: opacity 0.26s ease, transform 0.26s ease;
}

.rw-chat-float-enter-from,
.rw-chat-float-leave-to,
.rw-chat-panel-enter-from,
.rw-chat-panel-leave-to {
    opacity: 0;
    transform: translateY(10px) scale(0.985);
}

@keyframes rw-chat-msg {
    from {
        opacity: 0;
        transform: translateY(8px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes rw-chat-typing {
    0%, 80%, 100% {
        opacity: 0.35;
        transform: translateY(0);
    }
    40% {
        opacity: 1;
        transform: translateY(-2px);
    }
}

@media (max-width: 900px) {
    .rw-chat {
        right: 16px;
        --chat-bottom: 18px;
    }

    .rw-chat.is-open {
        width: min(340px, calc(100vw - 28px));
    }

    .rw-chat.is-near-footer {
        --chat-bottom: 130px;
    }

    .rw-chat__trigger {
        width: 220px;
        min-height: 54px;
    }
}

@media (max-width: 640px) {
    .rw-chat {
        left: auto;
        right: 12px;
        --chat-bottom: 16px;
        width: auto;
    }

    .rw-chat.is-open {
        left: 12px;
        right: 12px;
        width: auto;
    }

    .rw-chat.is-near-footer {
        --chat-bottom: 128px;
    }

    .rw-chat__trigger {
        width: auto;
        max-width: 200px;
        min-height: 52px;
        margin-left: auto;
        padding: 0.4rem 0.65rem 0.4rem 0.4rem;
    }

    .rw-chat__trigger-title {
        font-size: 0.68rem;
    }

    .rw-chat.is-open .rw-chat__panel {
        max-height: 82vh;
        height: min(82vh, 40rem);
    }

    .rw-chat__messages {
        max-height: none;
        flex: 1;
    }

    .rw-chat__actions {
        grid-template-columns: 1fr;
    }
}

@media (prefers-reduced-motion: reduce) {
    .rw-chat__trigger,
    .rw-chat__action,
    .rw-chat__send,
    .rw-chat__message,
    .rw-chat__typing-dots span,
    .rw-chat-float-enter-active,
    .rw-chat-float-leave-active,
    .rw-chat-panel-enter-active,
    .rw-chat-panel-leave-active {
        animation: none !important;
        transition: none !important;
        transform: none !important;
    }
}
</style>
