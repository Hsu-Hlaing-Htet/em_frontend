<script setup>
import { reactive, ref } from 'vue';
import { submitContactMessage } from '@/modules/public/service';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { useAppToast } from '@/composables/global/useAppToast';
import { useAssistantChat } from '@/composables/shared/useAssistantChat';
import { PUBLIC_SOCIAL_LINKS } from '@/config/publicSite';

const toast = useAppToast();
const { requestOpenAssistant } = useAssistantChat();
const sending = ref(false);
const openFaq = ref(null);
const errors = new Errors();

const serviceOptions = [
    'General Enquiry',
    'Property Viewing',
    'Buying Support',
    'Rental Support',
    'Investment Advisory',
    'Property Management',
];

const form = reactive({
    name: '',
    email: '',
    phone: '',
    subject: '',
    preferred_service: '',
    message: '',
});

const contactDetails = [
    {
        label: 'Phone',
        value: '+95 9 55000001',
        href: 'tel:+95955000001',
        icon: 'pi pi-phone',
    },
    {
        label: 'Email',
        value: 'hello@rosewoodroyale.com',
        href: 'mailto:hello@rosewoodroyale.com',
        icon: 'pi pi-envelope',
    },
    {
        label: 'Office',
        value: 'No.18, Yankin Township, Yangon, Myanmar',
        href: null,
        icon: 'pi pi-map-marker',
    },
    {
        label: 'Hours',
        value: 'Mon – Fri, 9:00 AM – 6:00 PM',
        href: null,
        icon: 'pi pi-clock',
    },
];

const socials = PUBLIC_SOCIAL_LINKS.map((item) => ({
    ...item,
    icon:
        item.label === 'Instagram'
            ? 'fa-instagram'
            : item.label === 'Facebook'
                ? 'fa-facebook-f'
                : item.label === 'LinkedIn'
                    ? 'fa-linkedin-in'
                    : 'fa-link',
}));

const visitNotes = [
    'Nearby parking available',
    'Private consultation by appointment',
];

const faqs = [
    {
        question: 'How quickly will I receive a response?',
        answer: 'Most enquiries receive a reply within one business day.',
    },
    {
        question: 'Can I arrange a private viewing?',
        answer: 'Yes, our team can schedule in-person or virtual property viewings.',
    },
    {
        question: 'Can I ask about rentals, sales, and services here?',
        answer: 'Yes, this page is for all general, rental, sales, and service-related enquiries.',
    },
];

bindErrorClearing(form, errors);

function toggleFaq(index) {
    openFaq.value = openFaq.value === index ? null : index;
}

function resetForm() {
    form.name = '';
    form.email = '';
    form.phone = '';
    form.subject = '';
    form.preferred_service = '';
    form.message = '';
}

async function submit() {
    errors.clear();

    if (!applyValidation(errors, form, [
        { field: 'name', type: 'text' },
        { field: 'email', type: 'email' },
        { field: 'phone', type: 'phone' },
        { field: 'subject', type: 'text' },
        { field: 'preferred_service', type: 'select' },
        { field: 'message', type: 'text' },
    ])) {
        return;
    }

    sending.value = true;

    try {
        await submitContactMessage({ ...form });
        toast.add({
            severity: 'success',
            summary: 'Message sent',
            detail: 'Thank you. Our team will be in touch shortly.',
            life: 3200,
        });
        resetForm();
    } catch (error) {
        toast.add({
            severity: 'warn',
            summary: 'Unable to send',
            detail: error.response?.data?.message || 'Please try again or email hello@rosewoodroyale.com.',
            life: 3500,
        });
    } finally {
        sending.value = false;
    }
}
</script>

<template>
    <div class="rw-contact-page">
        <section class="rw-page-hero rw-page-hero--tall rw-contact-hero">
            <div
                class="rw-page-hero__media"
                aria-hidden="true"
            >
                <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1800"
                    alt=""
                >
            </div>
            <div class="rw-page-hero__overlay" />
            <div class="container rw-page-hero__content rw-contact-hero__copy">
                <p class="rw-kicker">Contact</p>
                <h1>Let’s Find Your Next Chapter</h1>
                <p class="rw-lede">
                    Speak with the Rosewood Royale team about residences, viewings, investments, or tailored support.
                    We respond with clarity and care.
                </p>
            </div>
        </section>

        <section class="rw-section reveal">
            <div class="container rw-contact-split">
                <div class="rw-contact-info">
                    <p class="rw-kicker">Get in Touch</p>
                    <h2>Reach Rosewood Royale</h2>
                    <p class="rw-lede">
                        Share a little about what you are looking for and our team will respond with the same care and
                        attention reflected across every residence.
                    </p>

                    <ul class="rw-contact-details">
                        <li
                            v-for="item in contactDetails"
                            :key="item.label"
                        >
                            <span
                                class="rw-contact-details__icon"
                                aria-hidden="true"
                            >
                                <i :class="item.icon" />
                            </span>
                            <div>
                                <span class="rw-contact-details__label">{{ item.label }}</span>
                                <a
                                    v-if="item.href"
                                    :href="item.href"
                                >{{ item.value }}</a>
                                <p v-else>{{ item.value }}</p>
                            </div>
                        </li>
                    </ul>

                    <div
                        v-if="socials.length"
                        class="rw-contact-socials"
                    >
                        <a
                            v-for="item in socials"
                            :key="item.label"
                            :href="item.href"
                            target="_blank"
                            rel="noopener noreferrer"
                            :aria-label="item.label"
                        >
                            <i :class="`fab ${item.icon}`" />
                        </a>
                    </div>

                    <p class="rw-contact-reassure">
                        Typical response time: within 24 hours
                    </p>
                </div>

                <form
                    class="rw-contact-form"
                    @submit.prevent="submit"
                >
                    <div class="rw-contact-form__grid">
                        <div class="rw-field">
                            <label for="contact-name">Name</label>
                            <input
                                id="contact-name"
                                v-model="form.name"
                                class="rw-input"
                                type="text"
                                autocomplete="name"
                                placeholder="Your full name"
                            >
                            <small
                                v-if="errors.first('name')"
                                class="rw-error"
                            >{{ errors.first('name') }}</small>
                        </div>

                        <div class="rw-field">
                            <label for="contact-email">Email</label>
                            <input
                                id="contact-email"
                                v-model="form.email"
                                class="rw-input"
                                type="email"
                                autocomplete="email"
                                placeholder="you@email.com"
                            >
                            <small
                                v-if="errors.first('email')"
                                class="rw-error"
                            >{{ errors.first('email') }}</small>
                        </div>

                        <div class="rw-field">
                            <label for="contact-phone">Phone</label>
                            <input
                                id="contact-phone"
                                v-model="form.phone"
                                class="rw-input"
                                type="tel"
                                autocomplete="tel"
                                placeholder="+95 …"
                            >
                            <small
                                v-if="errors.first('phone')"
                                class="rw-error"
                            >{{ errors.first('phone') }}</small>
                        </div>

                        <div class="rw-field">
                            <label for="contact-subject">Subject</label>
                            <input
                                id="contact-subject"
                                v-model="form.subject"
                                class="rw-input"
                                type="text"
                                placeholder="How can we help?"
                            >
                            <small
                                v-if="errors.first('subject')"
                                class="rw-error"
                            >{{ errors.first('subject') }}</small>
                        </div>
                    </div>

                    <div class="rw-field">
                        <label for="contact-service">Preferred Service</label>
                        <select
                            id="contact-service"
                            v-model="form.preferred_service"
                            class="rw-input"
                        >
                            <option
                                disabled
                                value=""
                            >
                                Select a service
                            </option>
                            <option
                                v-for="option in serviceOptions"
                                :key="option"
                                :value="option"
                            >
                                {{ option }}
                            </option>
                        </select>
                        <small
                            v-if="errors.first('preferred_service')"
                                class="rw-error"
                            >{{ errors.first('preferred_service') }}</small>
                    </div>

                    <div class="rw-field">
                        <label for="contact-message">Message</label>
                        <textarea
                            id="contact-message"
                            v-model="form.message"
                            class="rw-input"
                            rows="5"
                            placeholder="Tell us about the residence, location, or support you need."
                        />
                        <small
                            v-if="errors.first('message')"
                                class="rw-error"
                            >{{ errors.first('message') }}</small>
                    </div>

                    <button
                        type="submit"
                        class="rw-btn rw-btn-primary rw-contact-form__submit"
                        :disabled="sending"
                    >
                        {{ sending ? 'Sending…' : 'Send Message' }}
                        <i
                            v-if="!sending"
                            class="fas fa-arrow-right"
                        />
                    </button>
                    <p class="rw-contact-form__note">
                        By submitting this form, you agree to be contacted by Rosewood Royale.
                    </p>
                </form>
            </div>
        </section>

        <section class="rw-section rw-section--alt reveal">
            <div class="container">
                <div class="rw-contact-assist">
                    <div>
                        <h2>Prefer a faster conversation?</h2>
                        <p>
                            Speak directly with our team or use the Rosewood AI Concierge for quick guidance.
                        </p>
                    </div>
                    <div class="rw-cta-row rw-contact-assist__actions">
                        <a
                            href="tel:+95955000001"
                            class="rw-btn rw-btn-primary"
                        >
                            Call Us
                            <i class="fas fa-phone" />
                        </a>
                        <button
                            type="button"
                            class="rw-btn rw-btn-ghost"
                            aria-label="Ask Rosewood AI Concierge"
                            @click="requestOpenAssistant"
                        >
                            ASK
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <section class="rw-section reveal">
            <div class="container">
                <div class="rw-section-head rw-section-head--stack">
                    <div>
                        <p class="rw-kicker">Location</p>
                        <h2>Visit Our Office</h2>
                        <p class="rw-lede">
                            Meet our consultants in person at our Yangon office.
                        </p>
                    </div>
                </div>

                <div class="rw-visit">
                    <aside class="rw-visit__card">
                        <p class="rw-visit__label">Office</p>
                        <h3>No.18, Yankin Township, Yangon, Myanmar</h3>
                        <ul>
                            <li
                                v-for="note in visitNotes"
                                :key="note"
                            >
                                <i
                                    class="fas fa-check"
                                    aria-hidden="true"
                                />
                                <span>{{ note }}</span>
                            </li>
                        </ul>
                        <a
                            class="rw-link-arrow"
                            href="https://maps.google.com/?q=Yankin%20Township%2C%20Yangon"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Open in Maps
                            <i class="fas fa-arrow-right" />
                        </a>
                    </aside>

                    <div class="rw-visit__map">
                        <iframe
                            title="Rosewood Royale office location"
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                            src="https://maps.google.com/maps?q=Yankin%20Township%2C%20Yangon&z=14&output=embed"
                        />
                    </div>
                </div>
            </div>
        </section>

        <section class="rw-section rw-section--alt reveal">
            <div class="container rw-contact-faq">
                <div class="rw-section-head rw-section-head--stack">
                    <div>
                        <p class="rw-kicker">FAQ</p>
                        <h2>Before You Reach Out</h2>
                    </div>
                </div>

                <div class="rw-contact-faq__list">
                    <div
                        v-for="(item, index) in faqs"
                        :key="item.question"
                        class="rw-contact-faq__item"
                        :class="{ 'is-open': openFaq === index }"
                    >
                        <button
                            type="button"
                            class="rw-contact-faq__trigger"
                            :aria-expanded="openFaq === index"
                            :aria-controls="`contact-faq-${index}`"
                            :id="`contact-faq-trigger-${index}`"
                            @click="toggleFaq(index)"
                        >
                            <span>{{ item.question }}</span>
                            <i
                                class="fas fa-chevron-down"
                                aria-hidden="true"
                            />
                        </button>
                        <div
                            :id="`contact-faq-${index}`"
                            class="rw-contact-faq__panel"
                            role="region"
                            :aria-labelledby="`contact-faq-trigger-${index}`"
                            :aria-hidden="openFaq !== index"
                        >
                            <div class="rw-contact-faq__answer">
                                <p>{{ item.answer }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="rw-section reveal">
            <div class="container rw-contact-cta">
                <p class="rw-kicker">Rosewood Royale</p>
                <h2>Let Us Help You Move Forward</h2>
                <p class="rw-lede">
                    Whether you are searching, investing, relocating, or managing a residence, we are here to guide you
                    with calm expertise.
                </p>
                <div class="rw-cta-row">
                    <router-link
                        to="/properties"
                        class="rw-btn rw-btn-primary"
                    >
                        Explore Properties
                        <i class="fas fa-arrow-right" />
                    </router-link>
                    <a
                        href="#contact-name"
                        class="rw-btn rw-btn-ghost"
                    >
                        Speak With Our Team
                    </a>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.rw-contact-page > .rw-section {
    padding: 6.25rem 0;
}

.rw-contact-hero__copy > * {
    animation: rw-contact-hero-in 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.rw-contact-hero__copy > *:nth-child(1) { animation-delay: 80ms; }
.rw-contact-hero__copy > *:nth-child(2) { animation-delay: 160ms; }
.rw-contact-hero__copy > *:nth-child(3) { animation-delay: 240ms; }

.rw-contact-hero__copy h1 {
    font-size: clamp(2.6rem, 6.5vw, 4.75rem);
    max-width: 14ch;
    line-height: 0.98;
}

.rw-contact-hero__copy .rw-lede {
    max-width: 42rem;
}

.rw-section-head--stack {
    align-items: start;
    margin-bottom: 1.85rem;
}

.rw-section-head--stack .rw-lede {
    margin-top: 0.75rem;
}

.rw-contact-split {
    display: grid;
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
    gap: 2.75rem;
    align-items: start;
}

.rw-contact-info h2 {
    margin: 0 0 0.85rem;
    font-size: clamp(2rem, 3.4vw, 2.75rem);
    font-weight: 500;
}

.rw-contact-info .rw-lede {
    margin: 0;
    max-width: 38ch;
}

.rw-contact-details {
    list-style: none;
    margin: 2rem 0 0;
    padding: 0;
    display: grid;
    gap: 1.1rem;
}

.rw-contact-details li {
    display: flex;
    gap: 0.95rem;
    align-items: flex-start;
    padding: 0.95rem 1rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(23, 24, 27, 0.72);
    transition: border-color 0.3s ease, transform 0.3s ease;
}

.rw-contact-details li:hover {
    border-color: rgba(143, 35, 56, 0.45);
    transform: translateY(-2px);
}

.rw-contact-details__icon {
    width: 42px;
    height: 42px;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 999px;
    border: 1px solid rgba(143, 35, 56, 0.45);
    background: rgba(143, 35, 56, 0.08);
    color: #8f2338;
}

.rw-contact-details__icon .pi {
    font-family: 'primeicons' !important;
    font-size: 1.05rem;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    font-style: normal;
    font-weight: normal;
}

.rw-contact-details__label {
    display: block;
    margin-bottom: 0.2rem;
    color: #777b82;
    font-family: var(--rw-font-sans, Inter, sans-serif);
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
}

.rw-contact-details a,
.rw-contact-details p {
    margin: 0;
    color: #f5f2ee;
    font-family: var(--rw-font-sans, Inter, sans-serif);
    font-size: 0.95rem;
    line-height: 1.5;
}

.rw-contact-details a:hover {
    color: #a92b47;
}

.rw-contact-socials {
    display: flex;
    gap: 0.65rem;
    margin-top: 1.5rem;
}

.rw-contact-socials a {
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #f5f2ee;
    background: rgba(255, 255, 255, 0.02);
    transition: border-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
}

.rw-contact-socials a:hover {
    border-color: rgba(143, 35, 56, 0.55);
    color: #a92b47;
    transform: translateY(-2px);
}

.rw-contact-reassure {
    margin: 1.35rem 0 0;
    color: #a9adb5;
    font-size: 0.82rem;
    letter-spacing: 0.02em;
}

.rw-contact-form {
    display: grid;
    gap: 1.05rem;
    padding: 1.65rem 1.5rem 1.4rem;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(18, 18, 20, 0.92);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
}

.rw-contact-form__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.05rem;
}

.rw-contact-form :deep(select.rw-input) {
    appearance: none;
    background-image:
        linear-gradient(45deg, transparent 50%, #a9adb5 50%),
        linear-gradient(135deg, #a9adb5 50%, transparent 50%);
    background-position:
        calc(100% - 18px) calc(50% - 2px),
        calc(100% - 12px) calc(50% - 2px);
    background-size: 6px 6px, 6px 6px;
    background-repeat: no-repeat;
    padding-right: 2.2rem;
}

.rw-contact-form__submit {
    width: 100%;
    min-height: 48px;
    border-radius: 12px;
    margin-top: 0.25rem;
}

.rw-contact-form__note {
    margin: 0;
    text-align: center;
    color: #777b82;
    font-size: 0.78rem;
    line-height: 1.5;
}

.rw-error {
    display: block;
    margin-top: 0.4rem;
    color: #c97882;
    font-family: var(--rw-font-sans, Inter, sans-serif);
    font-size: 0.78rem;
    line-height: 1.4;
}

.rw-contact-assist {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1.35rem;
    padding: 1.55rem 1.65rem;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(18, 18, 20, 0.88);
}

.rw-contact-assist h2 {
    margin: 0 0 0.45rem;
    font-size: clamp(1.55rem, 2.4vw, 1.95rem);
    font-weight: 500;
}

.rw-contact-assist p {
    margin: 0;
    color: #a9adb5;
    font-size: 0.92rem;
    line-height: 1.6;
    max-width: 44ch;
}

.rw-contact-assist__actions {
    margin-top: 0;
}

.rw-visit {
    display: grid;
    grid-template-columns: minmax(240px, 0.75fr) minmax(0, 1.25fr);
    gap: 1.35rem;
    align-items: stretch;
}

.rw-visit__card {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    padding: 1.45rem 1.3rem;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: #17181b;
}

.rw-visit__label {
    margin: 0;
    font-size: 0.68rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #777b82;
}

.rw-visit__card h3 {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 500;
    line-height: 1.3;
}

.rw-visit__card ul {
    list-style: none;
    margin: 0.35rem 0 0.5rem;
    padding: 0;
    display: grid;
    gap: 0.55rem;
}

.rw-visit__card li {
    display: flex;
    gap: 0.55rem;
    align-items: flex-start;
    color: #a9adb5;
    font-size: 0.88rem;
    line-height: 1.5;
}

.rw-visit__card li i {
    margin-top: 0.2rem;
    color: #8f2338;
    font-size: 0.7rem;
}

.rw-visit__card .rw-link-arrow {
    margin-top: auto;
}

.rw-visit__map {
    overflow: hidden;
    min-height: 320px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: #121315;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
}

.rw-visit__map iframe {
    width: 100%;
    height: 100%;
    min-height: 360px;
    border: 0;
    filter: grayscale(0.35) contrast(1.05) brightness(0.82);
}

.rw-contact-faq {
    max-width: 820px;
    margin-inline: auto;
}

.rw-contact-faq__list {
    display: grid;
    gap: 0.65rem;
}

.rw-contact-faq__item {
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(18, 18, 20, 0.72);
    overflow: hidden;
    transition: border-color 0.25s ease;
}

.rw-contact-faq__item.is-open {
    border-color: rgba(143, 35, 56, 0.45);
}

.rw-contact-faq__trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.15rem;
    border: 0;
    background: transparent;
    color: #f5f2ee;
    text-align: left;
    cursor: pointer;
    font-family: var(--rw-font-sans, Inter, sans-serif);
    font-size: 0.95rem;
    font-weight: 500;
}

.rw-contact-faq__trigger i {
    color: #a9adb5;
    font-size: 0.7rem;
    transition: transform 0.22s ease, color 0.22s ease;
}

.rw-contact-faq__item.is-open .rw-contact-faq__trigger i {
    transform: rotate(180deg);
    color: #8f2338;
}

.rw-contact-faq__panel {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;
    transition: grid-template-rows 0.22s ease, opacity 0.22s ease;
}

.rw-contact-faq__item.is-open .rw-contact-faq__panel {
    grid-template-rows: 1fr;
    opacity: 1;
}

.rw-contact-faq__answer {
    overflow: hidden;
    min-height: 0;
}

.rw-contact-faq__answer p {
    margin: 0;
    padding: 0 1.15rem 1.05rem;
    color: #a9adb5;
    font-size: 0.9rem;
    line-height: 1.7;
}

.rw-contact-cta {
    text-align: center;
    padding: 2.25rem 1.5rem;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: #17181b;
}

.rw-contact-cta h2 {
    margin: 0;
    font-size: clamp(2rem, 3.5vw, 2.75rem);
    font-weight: 500;
}

.rw-contact-cta .rw-lede {
    margin: 0.85rem auto 0;
    max-width: 46ch;
}

.rw-contact-cta .rw-cta-row {
    justify-content: center;
}

@keyframes rw-contact-hero-in {
    from {
        opacity: 0;
        transform: translateY(18px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 980px) {
    .rw-contact-split,
    .rw-visit {
        grid-template-columns: 1fr;
    }

    .rw-contact-assist {
        align-items: flex-start;
    }
}

@media (max-width: 720px) {
    .rw-contact-form__grid {
        grid-template-columns: 1fr;
    }

    .rw-contact-assist__actions,
    .rw-contact-cta .rw-cta-row {
        width: 100%;
    }

    .rw-contact-assist__actions .rw-btn,
    .rw-contact-cta .rw-btn {
        width: 100%;
    }

    .rw-contact-page > .rw-section {
        padding: 4.5rem 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .rw-contact-hero__copy > *,
    .rw-contact-details li,
    .rw-contact-socials a,
    .rw-contact-faq__panel,
    .rw-contact-faq__trigger i {
        animation: none !important;
        transition: none !important;
        transform: none !important;
    }
}
</style>
