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

const PROPERTY_WELCOME = 'Welcome to Rosewood Royale. I can help you explore available properties, rental and sale options, pricing, locations, and property details.';

const PROPERTY_QUESTION_PREVIEW_COUNT = 3;

const PROPERTY_MAIN_CATEGORIES = [
    { id: 'rent', label: 'Rent' },
    { id: 'sale', label: 'Sale' },
    { id: 'locations', label: 'Locations' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'more', label: 'More' },
];

const PROPERTY_MORE_CATEGORIES = [
    { id: 'details', label: 'Property Details' },
    { id: 'contact', label: 'Contact' },
];

const PROPERTY_CATEGORY_QUESTIONS = {
    rent: [
        'What properties are available for rent?',
        'Show me available rental homes.',
        'What are the rental prices?',
        'Which areas have rental properties?',
        'Show me rental properties in Yangon.',
    ],
    sale: [
        'What properties are available for sale?',
        'Show me properties for sale.',
        'What are the sale prices?',
        'Which locations have properties for sale?',
        'Show me available residences for sale.',
    ],
    locations: [
        'What locations are available?',
        'Show me properties in Yangon.',
        'Show me properties in Mandalay.',
        'Which locations have rental properties?',
        'Which locations have properties for sale?',
    ],
    pricing: [
        'What are the current rental prices?',
        'What are the current sale prices?',
        'Show me properties within my budget.',
        'What is the lowest rental price?',
        'What is the highest rental price?',
    ],
    details: [
        'Tell me about this property.',
        'What room is available?',
        'What is the property size?',
        'What is the rental or sale price?',
        'Where is this property located?',
        'Is this property currently available?',
    ],
    contact: [
        'How can I contact Rosewood Royale?',
        'What is your phone number?',
        'What is your email address?',
        'How can I ask about a property?',
    ],
};

const PROPERTY_MORE_CATEGORY_IDS = new Set(['details', 'contact']);

const RENT_WELCOME = 'Welcome to Rosewood Royale. Ask about your lease, bills, payments, maintenance, or account.';

const RENT_CONTACT_FALLBACK = 'Please contact our team for assistance.\nPhone: +95 9 55000001\nEmail: hello@rosewoodroyale.com';

const RENT_QUESTION_PREVIEW_COUNT = 3;

const RENT_FIELD_LABELS = {
    status: 'Status',
    room: 'Room',
    residence: 'Residence',
    rent: 'Rent',
    start: 'Start',
    end: 'End',
    due: 'Due',
    balance: 'Balance',
    amount: 'Amount',
    invoice: 'Invoice',
    payment: 'Payment',
    receipt: 'Receipt',
    building: 'Building',
    email: 'Email',
};

const RENT_MAIN_CATEGORIES = [
    { id: 'contracts', label: 'Contracts' },
    { id: 'invoices', label: 'Invoices' },
    { id: 'payments', label: 'Payments' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'more', label: 'More' },
];

const RENT_MORE_CATEGORIES = [
    { id: 'receipts', label: 'Receipts' },
    { id: 'utilities', label: 'Utilities' },
    { id: 'account', label: 'Account' },
];

const RENT_CATEGORY_QUESTIONS = {
    contracts: [
        'What is my active contract?',
        'When does my contract start?',
        'When does my contract end?',
        'What is my contract status?',
        'Which room am I renting?',
        'Which residence am I staying in?',
        'How much is my rent?',
        'What contract documents are available?',
    ],
    invoices: [
        'Do I have unpaid invoices?',
        'What is my outstanding balance?',
        'What is my latest invoice?',
        'When is my next payment due?',
        'Do I have overdue invoices?',
        'What invoice documents are available?',
    ],
    payments: [
        'What was my latest payment?',
        'What is my payment status?',
        'Do I have pending payments?',
        'Do I have rejected payments?',
        'Show my recent payments.',
    ],
    maintenance: [
        'What is the status of my maintenance request?',
        'Show my recent maintenance requests.',
        'Do I have pending maintenance requests?',
        'Which requests are in progress?',
        'Which requests are completed?',
    ],
    receipts: [
        'What is my latest receipt?',
        'What receipts are available?',
        'Is my receipt ready?',
        'Which payment has a receipt?',
        'What receipt documents can I access?',
    ],
    utilities: [
        'What is my latest utility bill?',
        'How much is my utility bill?',
        'Is my utility bill paid?',
        'Which utility bills are unpaid?',
        'What utility bill documents are available?',
    ],
    account: [
        'What email is registered on my account?',
        'What room is assigned to me?',
        'What residence am I associated with?',
        'What notifications do I have?',
        'What documents are available in my portal?',
    ],
};

const RENT_MORE_CATEGORY_IDS = new Set(['receipts', 'utilities', 'account']);

const route = useRoute();
const router = useRouter();
const isOpen = ref(false);
const message = ref('');
const typing = ref(false);
const loadingLabel = ref('');
const messagesPanel = ref(null);
const activePurpose = ref(props.listingPurpose);
const nearFooter = ref(false);
const rentShortcutView = ref('main');
const rentQuestionsExpanded = ref(false);
const rentSuggestionsCollapsed = ref(false);
const propertyShortcutView = ref('main');
const propertyQuestionsExpanded = ref(false);
const propertySuggestionsCollapsed = ref(false);
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
        return RENT_WELCOME;
    }

    return PROPERTY_WELCOME;
});

const inputPlaceholder = computed(() => (
    props.mode === 'rent'
        ? 'Ask about your lease, bills, or account'
        : 'Ask about properties, prices, or locations'
));

const headerTitle = computed(() => (
    props.mode === 'rent' ? 'Rosewood Rent Assistant' : 'Rosewood AI Concierge'
));

const headerSubtitle = computed(() => (
    props.mode === 'rent' ? props.contextLabel : 'Online Property Assistant'
));

const messages = ref([
    createSupportMessage(
        props.mode === 'rent' ? RENT_WELCOME : PROPERTY_WELCOME,
        'welcome',
    ),
]);

const showPropertyShortcuts = computed(() => (
    props.mode === 'property'
    && isOpen.value
    && !typing.value
    && !propertySuggestionsCollapsed.value
));

const showPropertyBrowseTopicsAction = computed(() => (
    props.mode === 'property'
    && isOpen.value
    && !typing.value
    && propertySuggestionsCollapsed.value
    && messages.value.some((item) => item.sender === 'guest')
));

const propertyActiveQuestions = computed(() => (
    PROPERTY_CATEGORY_QUESTIONS[propertyShortcutView.value] || null
));

const propertyVisibleQuestions = computed(() => {
    const all = propertyActiveQuestions.value;
    if (!all) {
        return [];
    }

    if (propertyQuestionsExpanded.value || all.length <= PROPERTY_QUESTION_PREVIEW_COUNT) {
        return all;
    }

    return all.slice(0, PROPERTY_QUESTION_PREVIEW_COUNT);
});

const propertyHasMoreQuestions = computed(() => {
    const all = propertyActiveQuestions.value;
    return Boolean(all && all.length > PROPERTY_QUESTION_PREVIEW_COUNT && !propertyQuestionsExpanded.value);
});

const propertyCategoryLabel = computed(() => {
    const labels = {
        rent: 'Rent',
        sale: 'Sale',
        locations: 'Locations',
        pricing: 'Pricing',
        details: 'Property Details',
        contact: 'Contact',
    };

    return labels[propertyShortcutView.value] || '';
});

const propertyCategoryChips = computed(() => {
    if (propertyShortcutView.value === 'main') {
        return PROPERTY_MAIN_CATEGORIES;
    }

    if (propertyShortcutView.value === 'more') {
        return PROPERTY_MORE_CATEGORIES;
    }

    return [];
});

const propertyShowBack = computed(() => propertyShortcutView.value !== 'main');

const propertyBackLabel = computed(() => (
    propertyShortcutView.value === 'more' ? '← Main topics' : '← Topics'
));

const showRentShortcuts = computed(() => (
    props.mode === 'rent'
    && isOpen.value
    && !typing.value
    && !rentSuggestionsCollapsed.value
));

const showRentBrowseTopicsAction = computed(() => (
    props.mode === 'rent'
    && isOpen.value
    && !typing.value
    && rentSuggestionsCollapsed.value
    && messages.value.some((item) => item.sender === 'guest')
));

const rentActiveQuestions = computed(() => (
    RENT_CATEGORY_QUESTIONS[rentShortcutView.value] || null
));

const rentVisibleQuestions = computed(() => {
    const all = rentActiveQuestions.value;
    if (!all) {
        return [];
    }

    if (rentQuestionsExpanded.value || all.length <= RENT_QUESTION_PREVIEW_COUNT) {
        return all;
    }

    return all.slice(0, RENT_QUESTION_PREVIEW_COUNT);
});

const rentHasMoreQuestions = computed(() => {
    const all = rentActiveQuestions.value;
    return Boolean(all && all.length > RENT_QUESTION_PREVIEW_COUNT && !rentQuestionsExpanded.value);
});

const rentCategoryLabel = computed(() => {
    const labels = {
        contracts: 'Contracts',
        invoices: 'Invoices',
        payments: 'Payments',
        maintenance: 'Maintenance',
        receipts: 'Receipts',
        utilities: 'Utilities',
        account: 'Account',
    };

    return labels[rentShortcutView.value] || '';
});

const rentCategoryChips = computed(() => {
    if (rentShortcutView.value === 'main') {
        return RENT_MAIN_CATEGORIES;
    }

    if (rentShortcutView.value === 'more') {
        return RENT_MORE_CATEGORIES;
    }

    return [];
});

const rentShowBack = computed(() => rentShortcutView.value !== 'main');

const rentBackLabel = computed(() => (
    rentShortcutView.value === 'more' ? '← Main topics' : '← Topics'
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

function formatDisplayDate(value) {
    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) {
        return value;
    }

    const date = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
}

function formatRentDisplayValue(value) {
    const text = String(value).trim();
    const amountMatch = text.match(/^([\d,]+(?:\.\d+)?)\s*\/?\s*(month|mo)?$/i);

    if (amountMatch) {
        const amount = amountMatch[1].replace(/\.00$/, '');
        return `MMK ${amount} / month`;
    }

    if (/\/\s*month/i.test(text) && !/^mmk\b/i.test(text)) {
        return `MMK ${text.replace(/\.00(?=\s*\/)/, '').replace(/\s*\/\s*/g, ' / ')}`;
    }

    return text;
}

function formatStructuredFieldPart(part) {
    const trimmed = String(part).trim();
    if (!trimmed) {
        return '';
    }

    if (/^(contract|invoice|payment|receipt)\s*#/i.test(trimmed)) {
        return trimmed.replace(
            /^(contract|invoice|payment|receipt)/i,
            (label) => label.charAt(0).toUpperCase() + label.slice(1).toLowerCase(),
        );
    }

    const fieldMatch = trimmed.match(/^([a-z][a-z0-9_]*)\s+(.+)$/i);
    if (!fieldMatch) {
        return trimmed;
    }

    const key = fieldMatch[1].toLowerCase();
    let value = fieldMatch[2].trim();
    const label = RENT_FIELD_LABELS[key] || (key.charAt(0).toUpperCase() + key.slice(1));

    if (key === 'status' && value) {
        value = value.charAt(0).toUpperCase() + value.slice(1);
    }

    if (key === 'rent') {
        value = formatRentDisplayValue(value);
    }

    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
        value = formatDisplayDate(value);
    }

    return `${label}: ${value}`;
}

function formatStructuredLine(line) {
    const raw = String(line || '').trim();
    if (!raw) {
        return '';
    }

    const withoutBullet = raw.replace(/^[•\-\*]\s*/, '');
    if (!/[·•]/.test(withoutBullet)) {
        return raw;
    }

    const parts = withoutBullet
        .split(/\s*[·•]\s*/)
        .map((part) => part.trim())
        .filter(Boolean);

    if (parts.length < 2) {
        return raw;
    }

    return parts.map(formatStructuredFieldPart).filter(Boolean).join('\n');
}

/** Display-only formatting for middot/bullet structured AI answers. Does not alter stored message text. */
function formatAssistantDisplayText(text) {
    if (props.mode !== 'rent' || !text) {
        return text;
    }

    return String(text)
        .split(/\n+/)
        .map(formatStructuredLine)
        .filter((line) => line !== '')
        .join('\n');
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
        requestAnimationFrame(() => {
            const panel = messagesPanel.value;
            if (!panel) {
                return;
            }

            panel.scrollTop = panel.scrollHeight;

            requestAnimationFrame(() => {
                panel.scrollTop = panel.scrollHeight;
            });
        });
    });
}

function collapseRentSuggestions() {
    if (props.mode !== 'rent') {
        return;
    }

    rentSuggestionsCollapsed.value = true;
    rentQuestionsExpanded.value = false;
}

function collapsePropertySuggestions() {
    if (props.mode !== 'property') {
        return;
    }

    propertySuggestionsCollapsed.value = true;
    propertyQuestionsExpanded.value = false;
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

    if (props.mode === 'rent') {
        collapseRentSuggestions();
    }

    if (props.mode === 'property') {
        collapsePropertySuggestions();
    }

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
                answer || RENT_CONTACT_FALLBACK,
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
                : RENT_CONTACT_FALLBACK,
        ));
    } finally {
        typing.value = false;
        loadingLabel.value = '';
        scrollToLatestMessage();
    }
}

function onRentCategorySelect(categoryId) {
    if (!categoryId || typing.value) {
        return;
    }

    rentSuggestionsCollapsed.value = false;
    rentQuestionsExpanded.value = false;
    rentShortcutView.value = categoryId;
    scrollToLatestMessage();
}

function onRentShortcutBack() {
    rentQuestionsExpanded.value = false;
    rentSuggestionsCollapsed.value = false;

    if (RENT_MORE_CATEGORY_IDS.has(rentShortcutView.value)) {
        rentShortcutView.value = 'more';
        return;
    }

    rentShortcutView.value = 'main';
}

function onRentBrowseTopics() {
    rentQuestionsExpanded.value = false;
    rentSuggestionsCollapsed.value = false;
    rentShortcutView.value = 'main';
    scrollToLatestMessage();
}

function onRentExpandQuestions() {
    rentQuestionsExpanded.value = true;
}

function onRentSuggestedQuestion(questionText) {
    if (!questionText || typing.value) {
        return;
    }

    collapseRentSuggestions();
    sendMessage(questionText);
}

function onPropertyCategorySelect(categoryId) {
    if (!categoryId || typing.value) {
        return;
    }

    propertySuggestionsCollapsed.value = false;
    propertyQuestionsExpanded.value = false;
    propertyShortcutView.value = categoryId;
    scrollToLatestMessage();
}

function onPropertyShortcutBack() {
    propertyQuestionsExpanded.value = false;
    propertySuggestionsCollapsed.value = false;

    if (PROPERTY_MORE_CATEGORY_IDS.has(propertyShortcutView.value)) {
        propertyShortcutView.value = 'more';
        return;
    }

    propertyShortcutView.value = 'main';
}

function onPropertyBrowseTopics() {
    propertyQuestionsExpanded.value = false;
    propertySuggestionsCollapsed.value = false;
    propertyShortcutView.value = 'main';
    scrollToLatestMessage();
}

function onPropertyExpandQuestions() {
    propertyQuestionsExpanded.value = true;
}

function onPropertySuggestedQuestion(questionText) {
    if (!questionText || typing.value) {
        return;
    }

    const purpose = propertyShortcutView.value === 'rent' || propertyShortcutView.value === 'sale'
        ? propertyShortcutView.value
        : null;

    collapsePropertySuggestions();
    sendMessage(questionText, { purpose });
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
        :class="{
            'is-open': isOpen,
            'is-near-footer': nearFooter,
            'rw-chat--rent': mode === 'rent',
            'rw-chat--property': mode === 'property',
        }"
    >
        <Transition name="rw-chat-float">
            <button
                v-if="!isOpen"
                type="button"
                class="rw-chat__trigger"
                :aria-label="`Open ${headerTitle}`"
                :title="headerTitle"
                @click="openChat"
            >
                <span class="rw-chat__trigger-logo">
                    <img
                        src="/images/logo-dark.jpg"
                        alt="Rosewood Royale"
                    >
                </span>
                <span class="rw-chat__trigger-copy">
                    <span class="rw-chat__trigger-title">{{ headerTitle }}</span>
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
                :aria-label="headerTitle"
            >
                <header class="rw-chat__header">
                    <div class="rw-chat__header-left">
                        <span class="rw-chat__avatar">
                            <img
                                src="/images/logo-dark.jpg"
                                alt="Rosewood Royale"
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

                <div class="rw-chat__body">
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
                            <div class="rw-chat__bubble">
                                {{ item.sender === 'support' ? formatAssistantDisplayText(item.text) : item.text }}
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
                            v-if="showRentBrowseTopicsAction || showPropertyBrowseTopicsAction"
                            class="rw-chat__inline-action"
                        >
                            <button
                                type="button"
                                class="rw-chat__rent-chip rw-chat__rent-chip--back"
                                @click="mode === 'rent' ? onRentBrowseTopics() : onPropertyBrowseTopics()"
                            >
                                Browse topics
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

                    <div
                        v-if="showRentShortcuts"
                        class="rw-chat__rent-shortcuts"
                        aria-label="Suggested questions"
                    >
                        <div
                            v-if="rentShowBack || rentCategoryLabel"
                            class="rw-chat__rent-shortcuts-toolbar"
                        >
                            <button
                                v-if="rentShowBack"
                                type="button"
                                class="rw-chat__rent-chip rw-chat__rent-chip--back"
                                @click="onRentShortcutBack"
                            >
                                {{ rentBackLabel }}
                            </button>
                            <p
                                v-if="rentCategoryLabel"
                                class="rw-chat__rent-category-label"
                            >
                                {{ rentCategoryLabel }}
                            </p>
                        </div>

                        <template v-if="rentActiveQuestions">
                            <button
                                v-for="questionText in rentVisibleQuestions"
                                :key="questionText"
                                type="button"
                                class="rw-chat__rent-chip rw-chat__rent-chip--question"
                                :disabled="typing"
                                @click="onRentSuggestedQuestion(questionText)"
                            >
                                {{ questionText }}
                            </button>
                            <button
                                v-if="rentHasMoreQuestions"
                                type="button"
                                class="rw-chat__rent-chip rw-chat__rent-chip--more"
                                @click="onRentExpandQuestions"
                            >
                                More questions ↓
                            </button>
                        </template>

                        <div
                            v-else
                            class="rw-chat__rent-chip-grid"
                        >
                            <button
                                v-for="category in rentCategoryChips"
                                :key="category.id"
                                type="button"
                                class="rw-chat__rent-chip"
                                :class="{ 'rw-chat__rent-chip--more': category.id === 'more' }"
                                @click="onRentCategorySelect(category.id)"
                            >
                                {{ category.label }}
                            </button>
                        </div>
                    </div>

                    <div
                        v-if="showPropertyShortcuts"
                        class="rw-chat__rent-shortcuts"
                        aria-label="Suggested topics"
                    >
                        <div
                            v-if="propertyShowBack || propertyCategoryLabel"
                            class="rw-chat__rent-shortcuts-toolbar"
                        >
                            <button
                                v-if="propertyShowBack"
                                type="button"
                                class="rw-chat__rent-chip rw-chat__rent-chip--back"
                                @click="onPropertyShortcutBack"
                            >
                                {{ propertyBackLabel }}
                            </button>
                            <p
                                v-if="propertyCategoryLabel"
                                class="rw-chat__rent-category-label"
                            >
                                {{ propertyCategoryLabel }}
                            </p>
                        </div>

                        <template v-if="propertyActiveQuestions">
                            <button
                                v-for="questionText in propertyVisibleQuestions"
                                :key="questionText"
                                type="button"
                                class="rw-chat__rent-chip rw-chat__rent-chip--question"
                                :disabled="typing"
                                @click="onPropertySuggestedQuestion(questionText)"
                            >
                                {{ questionText }}
                            </button>
                            <button
                                v-if="propertyHasMoreQuestions"
                                type="button"
                                class="rw-chat__rent-chip rw-chat__rent-chip--more"
                                @click="onPropertyExpandQuestions"
                            >
                                More questions ↓
                            </button>
                        </template>

                        <div
                            v-else
                            class="rw-chat__rent-chip-grid"
                        >
                            <button
                                v-for="category in propertyCategoryChips"
                                :key="category.id"
                                type="button"
                                class="rw-chat__rent-chip"
                                :class="{ 'rw-chat__rent-chip--more': category.id === 'more' }"
                                @click="onPropertyCategorySelect(category.id)"
                            >
                                {{ category.label }}
                            </button>
                        </div>
                    </div>
                </div>

                <form
                    class="rw-chat__composer"
                    @submit.prevent="sendMessage()"
                >
                    <input
                        v-model="message"
                        type="text"
                        :placeholder="inputPlaceholder"
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
    --chat-bottom: calc(24px + env(safe-area-inset-bottom, 0px));

    position: fixed;
    z-index: 70;
    right: max(20px, env(safe-area-inset-right, 0px));
    bottom: var(--chat-bottom);
    width: auto;
    font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    transition: bottom 0.28s ease;
}

.rw-chat.is-open {
    width: min(390px, calc(100vw - 32px));
}

.rw-chat.is-near-footer {
    --chat-bottom: calc(140px + env(safe-area-inset-bottom, 0px));
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
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: transparent;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.22);
    flex-shrink: 0;
    aspect-ratio: 1 / 1;
}

.rw-chat__trigger-logo {
    width: 36px;
    height: 36px;
}

.rw-chat__avatar {
    width: 38px;
    height: 38px;
}

.rw-chat__trigger-logo img,
.rw-chat__avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    border-radius: 50%;
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
    height: min(640px, 72vh);
    max-height: min(640px, 72vh);
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
    flex-shrink: 0;
    padding: 0.85rem 1rem;
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

.rw-chat__body {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
}

.rw-chat__messages {
    flex: 1 1 auto;
    overflow-y: auto;
    padding: 0.9rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-height: 0;
}

.rw-chat__message {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    animation: rw-chat-msg 0.28s ease both;
}

.rw-chat__message.is-user {
    align-items: flex-end;
}

.rw-chat__message.is-ai {
    align-items: flex-start;
}

.rw-chat__bubble {
    max-width: 84%;
    padding: 0.7rem 0.9rem;
    border-radius: 13px;
    font-size: 0.84rem;
    line-height: 1.5;
    white-space: pre-line;
    overflow-wrap: anywhere;
    word-break: break-word;
}

.rw-chat__message.is-user .rw-chat__bubble {
    background: rgba(143, 35, 56, 0.88);
    color: #fff;
}

.rw-chat__message.is-ai .rw-chat__bubble {
    background: var(--chat-surface);
    color: #e8e6e2;
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

.rw-chat__rent-shortcuts {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    flex-shrink: 0;
    max-height: 42%;
    overflow-y: auto;
    width: 100%;
    padding: 0.65rem 1rem 0.75rem;
    border-top: 1px solid var(--chat-border);
    background: rgba(23, 24, 27, 0.55);
}

.rw-chat__rent-shortcuts-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
    width: 100%;
}

.rw-chat__rent-category-label {
    margin: 0;
    color: var(--chat-muted);
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
}

.rw-chat__rent-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    min-height: 1.75rem;
    padding: 0.28rem 0.62rem;
    border-radius: 999px;
    border: 1px solid var(--chat-border);
    background: rgba(255, 255, 255, 0.03);
    color: var(--chat-text);
    font-family: inherit;
    font-size: 0.7rem;
    font-weight: 500;
    line-height: 1.25;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.rw-chat__rent-chip:hover,
.rw-chat__rent-chip:focus-visible {
    border-color: rgba(143, 35, 56, 0.55);
    background: rgba(143, 35, 56, 0.14);
    color: var(--chat-text);
    outline: none;
}

.rw-chat__rent-chip:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

.rw-chat__rent-chip--more {
    color: var(--chat-muted);
}

.rw-chat__rent-chip--back {
    color: var(--chat-muted);
    border-style: dashed;
}

.rw-chat__rent-chip--question {
    border-radius: 10px;
    justify-content: flex-start;
    width: 100%;
    white-space: normal;
}

.rw-chat__rent-chip-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    width: 100%;
}

.rw-chat__inline-action {
    display: flex;
    justify-content: flex-start;
    padding-top: 0.15rem;
}

/* ---------- Rent Assistant + Public Concierge: compact premium panel ---------- */

.rw-chat--rent,
.rw-chat--property {
    font-family: var(--rw-font-sans, 'Inter', 'Inter var', 'Helvetica Neue', Helvetica, Arial, sans-serif);
}

.rw-chat--rent.is-open,
.rw-chat--property.is-open {
    width: min(368px, calc(100vw - 24px));
}

.rw-chat--rent .rw-chat__panel,
.rw-chat--property .rw-chat__panel {
    height: min(590px, 72vh);
    max-height: 72vh;
}

.rw-chat--rent .rw-chat__header,
.rw-chat--property .rw-chat__header {
    padding: 0.9rem 0.95rem;
}

.rw-chat--rent .rw-chat__avatar,
.rw-chat--property .rw-chat__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.rw-chat--rent .rw-chat__header h2,
.rw-chat--property .rw-chat__header h2 {
    font-family: var(--rosewood-brand-font, 'Cormorant Garamond', Georgia, serif);
    font-size: 1.05rem;
    font-weight: 500;
    line-height: 1.2;
}

.rw-chat--rent .rw-chat__header p,
.rw-chat--property .rw-chat__header p {
    margin-top: 0.15rem;
    font-size: 0.78rem;
    line-height: 1.3;
}

.rw-chat--rent .rw-chat__body,
.rw-chat--property .rw-chat__body {
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
}

.rw-chat--rent .rw-chat__messages,
.rw-chat--property .rw-chat__messages {
    flex: 1 1 auto;
    min-height: 0;
    gap: 0.65rem;
    padding: 0.8rem 0.85rem;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.18) transparent;
}

.rw-chat--rent .rw-chat__messages::-webkit-scrollbar,
.rw-chat--property .rw-chat__messages::-webkit-scrollbar {
    width: 5px;
}

.rw-chat--rent .rw-chat__messages::-webkit-scrollbar-track,
.rw-chat--property .rw-chat__messages::-webkit-scrollbar-track {
    background: transparent;
}

.rw-chat--rent .rw-chat__messages::-webkit-scrollbar-thumb,
.rw-chat--property .rw-chat__messages::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.16);
}

/* Defeat global `* { overflow-x: hidden }` which computes overflow-y to auto
   and creates nested scrollbars inside each bubble. */
.rw-chat--rent .rw-chat__message,
.rw-chat--rent .rw-chat__bubble,
.rw-chat--rent .rw-chat__welcome,
.rw-chat--rent .rw-chat__properties,
.rw-chat--rent .rw-chat__typing,
.rw-chat--rent .rw-chat__inline-action,
.rw-chat--property .rw-chat__message,
.rw-chat--property .rw-chat__bubble,
.rw-chat--property .rw-chat__welcome,
.rw-chat--property .rw-chat__properties,
.rw-chat--property .rw-chat__typing,
.rw-chat--property .rw-chat__inline-action {
    flex: 0 0 auto;
    height: auto;
    max-height: none;
    overflow: visible;
}

.rw-chat--rent .rw-chat__bubble,
.rw-chat--property .rw-chat__bubble {
    width: fit-content;
    padding: 10px 13px;
    font-size: 0.8125rem;
    line-height: 1.45;
    white-space: pre-line;
    overflow-wrap: anywhere;
    word-break: break-word;
}

.rw-chat--rent .rw-chat__message.is-user .rw-chat__bubble,
.rw-chat--property .rw-chat__message.is-user .rw-chat__bubble {
    max-width: 80%;
    background: rgba(143, 35, 56, 0.92);
    color: #f7f3ef;
}

.rw-chat--rent .rw-chat__message.is-ai .rw-chat__bubble,
.rw-chat--property .rw-chat__message.is-ai .rw-chat__bubble {
    max-width: 88%;
    background: var(--chat-raised);
    border: 1px solid var(--chat-border);
    color: #eceae6;
}

.rw-chat--rent .rw-chat__rent-shortcuts,
.rw-chat--property .rw-chat__rent-shortcuts {
    flex-shrink: 0;
    max-height: none;
    overflow: visible;
    gap: 0.35rem;
    padding: 0.55rem 0.85rem 0.65rem;
}

.rw-chat--rent .rw-chat__rent-shortcuts-toolbar,
.rw-chat--property .rw-chat__rent-shortcuts-toolbar {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    width: 100%;
    margin-bottom: 0.1rem;
}

.rw-chat--rent .rw-chat__rent-category-label,
.rw-chat--property .rw-chat__rent-category-label {
    margin-left: auto;
    font-size: 0.65rem;
}

.rw-chat--rent .rw-chat__rent-chip,
.rw-chat--property .rw-chat__rent-chip {
    min-height: 1.65rem;
    padding: 0.24rem 0.58rem;
    font-size: 0.68rem;
}

.rw-chat--rent .rw-chat__rent-chip--question,
.rw-chat--property .rw-chat__rent-chip--question {
    width: 100%;
    border-radius: 9px;
    padding: 0.4rem 0.65rem;
    line-height: 1.3;
}

.rw-chat--rent .rw-chat__composer,
.rw-chat--property .rw-chat__composer {
    gap: 0.45rem;
    padding: 0.65rem 0.75rem;
}

.rw-chat--rent .rw-chat__composer input,
.rw-chat--property .rw-chat__composer input {
    min-height: 46px;
    padding: 0.55rem 0.8rem;
    border-radius: 12px;
    font-size: 0.8rem;
}

.rw-chat--rent .rw-chat__send,
.rw-chat--property .rw-chat__send {
    width: 46px;
    height: 46px;
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
    flex-shrink: 0;
    padding: 0.75rem 0.9rem;
    border-top: 1px solid var(--chat-border);
    background: rgba(23, 24, 27, 0.72);
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
        right: max(16px, env(safe-area-inset-right, 0px));
        --chat-bottom: calc(18px + env(safe-area-inset-bottom, 0px));
    }

    .rw-chat.is-open {
        width: min(380px, calc(100vw - 28px));
    }

    .rw-chat.is-near-footer {
        --chat-bottom: calc(130px + env(safe-area-inset-bottom, 0px));
    }

    .rw-chat__trigger {
        width: 220px;
        min-height: 54px;
    }
}

@media (max-width: 640px) {
    .rw-chat {
        left: auto;
        right: max(12px, env(safe-area-inset-right, 0px));
        --chat-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
        width: auto;
    }

    .rw-chat.is-open {
        left: 12px;
        right: 12px;
        width: auto;
    }

    .rw-chat--rent.is-open,
    .rw-chat--property.is-open {
        left: 12px;
        right: 12px;
        width: calc(100vw - 24px);
    }

    .rw-chat.is-near-footer {
        --chat-bottom: calc(128px + env(safe-area-inset-bottom, 0px));
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
        max-height: 75vh;
        height: min(75vh, 36rem);
    }

    .rw-chat--rent.is-open .rw-chat__panel,
    .rw-chat--property.is-open .rw-chat__panel {
        max-height: min(78dvh, 78vh);
        height: min(78dvh, 36rem);
    }

    .rw-chat__messages {
        max-height: none;
        flex: 1;
    }

    .rw-chat__rent-shortcuts {
        max-height: 36%;
    }

    .rw-chat--rent .rw-chat__rent-shortcuts,
    .rw-chat--property .rw-chat__rent-shortcuts {
        max-height: none;
        overflow: visible;
    }

    .rw-chat--rent .rw-chat__messages,
    .rw-chat--property .rw-chat__messages {
        overflow-x: hidden;
        overflow-y: auto;
    }

    .rw-chat--rent .rw-chat__message,
    .rw-chat--rent .rw-chat__bubble,
    .rw-chat--property .rw-chat__message,
    .rw-chat--property .rw-chat__bubble {
        overflow: visible;
        max-height: none;
        height: auto;
    }

    .rw-chat--rent .rw-chat__message.is-user .rw-chat__bubble,
    .rw-chat--rent .rw-chat__message.is-ai .rw-chat__bubble,
    .rw-chat--property .rw-chat__message.is-user .rw-chat__bubble,
    .rw-chat--property .rw-chat__message.is-ai .rw-chat__bubble {
        max-width: min(88%, 100%);
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
