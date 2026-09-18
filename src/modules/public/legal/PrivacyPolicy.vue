<script setup>
const updated = '18 September 2026';
</script>

<template>
    <div class="rw-legal-page">
        <section class="rw-page-hero" style="min-height: 38vh">
            <div
                class="rw-page-hero__media"
                aria-hidden="true"
            >
                <img
                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600"
                    alt=""
                >
            </div>
            <div class="rw-page-hero__overlay" />
            <div class="container rw-page-hero__content">
                <p class="rw-kicker">Legal</p>
                <h1>Privacy Policy</h1>
                <p class="rw-lede">
                    How Rosewood Royale handles information submitted through this website.
                </p>
            </div>
        </section>

        <section class="rw-section">
            <div class="container rw-legal">
                <p class="rw-legal__updated">Last updated: {{ updated }}</p>

                <article>
                    <h2>1. Who we are</h2>
                    <p>
                        Rosewood Royale operates this public website to present residences, services, and ways to
                        contact our team. This policy explains how information may be handled when you use the site’s
                        public features.
                    </p>
                </article>

                <article>
                    <h2>2. Information you may provide</h2>
                    <p>Depending on how you use the site, you may share:</p>
                    <ul>
                        <li>Contact form details such as name, email, phone, subject, preferred service, and message</li>
                        <li>Questions you send to the Rosewood AI Concierge</li>
                        <li>Account credentials and profile information if you sign in to a customer or staff portal</li>
                    </ul>
                </article>

                <article>
                    <h2>3. How information is used</h2>
                    <p>Information submitted through the public site is used to:</p>
                    <ul>
                        <li>Respond to enquiries and service requests</li>
                        <li>Provide property information and AI Concierge responses based on available Rosewood inventory</li>
                        <li>Operate authenticated portals for customers and staff where accounts exist</li>
                        <li>Maintain basic application reliability and security</li>
                    </ul>
                </article>

                <article>
                    <h2>4. AI Concierge</h2>
                    <p>
                        The Rosewood AI Concierge processes the questions you send and may use live Rosewood Royale
                        property data to generate informational responses. Concierge answers are guidance only and may
                        not reflect the latest availability or pricing at the moment you act on them.
                    </p>
                    <!-- TODO: Legal/business owner review required — confirm retention of AI conversation logs. -->
                </article>

                <article>
                    <h2>5. Cookies, storage, and sessions</h2>
                    <p>
                        The website and related portals may use browser storage or authentication tokens to keep you
                        signed in, remember preferences such as theme or language, and support secure API requests.
                        Public browsing of listings does not require creating an account.
                    </p>
                </article>

                <article>
                    <h2>6. Third-party services</h2>
                    <p>
                        Some pages may load third-party services that process technical data needed to operate the
                        feature, such as embedded map providers on the Contact page. If you communicate by email or
                        phone, those channels are handled through the corresponding provider or network.
                    </p>
                    <!-- TODO: Legal/business owner review required — list production email/map vendors explicitly. -->
                </article>

                <article>
                    <h2>7. Sharing</h2>
                    <p>
                        We do not sell personal information. Information may be processed by systems and service
                        providers that help operate the website, messaging, or hosting environment, only as needed to
                        deliver the requested functionality.
                    </p>
                </article>

                <article>
                    <h2>8. Retention and security</h2>
                    <p>
                        We aim to keep submitted information only as long as needed to respond to your enquiry or
                        operate related account features, and to apply reasonable technical and organizational safeguards.
                    </p>
                    <!-- TODO: Legal/business owner review required — confirm retention periods and security controls. -->
                    <p>
                        No method of transmission or storage is completely secure. Please avoid sending sensitive
                        payment or identity documents through the public contact form or AI Concierge unless asked to
                        use a secure channel.
                    </p>
                </article>

                <article>
                    <h2>9. Your choices</h2>
                    <p>
                        You may contact us to ask about information you submitted through the website, request a
                        correction, or ask us to stop further follow-up on an enquiry where feasible.
                    </p>
                </article>

                <article>
                    <h2>10. Contact</h2>
                    <p>
                        For privacy questions related to this website, contact Rosewood Royale at
                        <a href="mailto:hello@rosewoodroyale.com">hello@rosewoodroyale.com</a>
                        or use the
                        <router-link to="/contact">Contact</router-link>
                        page.
                    </p>
                </article>
            </div>
        </section>
    </div>
</template>

<style scoped>
.rw-legal {
    max-width: 760px;
}

.rw-legal__updated {
    margin: 0 0 1.75rem;
    color: #777b82;
    font-size: 0.82rem;
    letter-spacing: 0.04em;
}

.rw-legal article + article {
    margin-top: 1.75rem;
}

.rw-legal h2 {
    margin: 0 0 0.65rem;
    font-size: 1.45rem;
    font-weight: 500;
}

.rw-legal p,
.rw-legal li {
    color: #a9adb5;
    font-size: 0.95rem;
    line-height: 1.7;
}

.rw-legal ul {
    margin: 0.5rem 0 0;
    padding-left: 1.15rem;
    display: grid;
    gap: 0.4rem;
}

.rw-legal a {
    color: #f5f2ee;
    text-decoration: underline;
    text-underline-offset: 0.18em;
}
</style>
