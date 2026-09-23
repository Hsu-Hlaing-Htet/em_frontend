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
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600"
                    alt=""
                >
            </div>
            <div class="rw-page-hero__overlay" />
            <div class="container rw-page-hero__content reveal-stage is-visible">
                <p class="rw-kicker">Legal</p>
                <h1>Terms &amp; Conditions</h1>
                <p class="rw-lede">
                    Guidelines for using the Rosewood Royale public website and related informational tools.
                </p>
            </div>
        </section>

        <section class="rw-section">
            <div class="container rw-legal">
                <p class="rw-legal__updated reveal">Last updated: {{ updated }}</p>

                <article class="reveal">
                    <h2>1. About these terms</h2>
                    <p>
                        These terms describe how you may use the Rosewood Royale public website, including property
                        listings, service information, contact forms, and the Rosewood AI Concierge.
                    </p>
                    <!-- TODO: Legal/business owner review required — confirm governing entity and jurisdiction. -->
                </article>

                <article>
                    <h2>2. Website use</h2>
                    <p>
                        You agree to use the site lawfully and respectfully. Do not attempt to disrupt the service,
                        scrape inventory in an abusive way, or submit false or harmful content through forms or chat.
                    </p>
                </article>

                <article>
                    <h2>3. Property information</h2>
                    <p>
                        Listings, prices, availability, descriptions, media, and related details are provided
                        for general information. Inventory can change without notice. A listing on the website does not
                        guarantee that a residence remains available or that pricing is final.
                    </p>
                </article>

                <article>
                    <h2>4. AI Concierge limitations</h2>
                    <p>
                        The Rosewood AI Concierge offers informational guidance based on available Rosewood Royale
                        property data. Responses may be incomplete, outdated, or imperfect. Concierge output is not
                        legal, financial, or investment advice and does not create a contract or reservation.
                    </p>
                </article>

                <article>
                    <h2>5. Enquiries and communications</h2>
                    <p>
                        Submitting a contact form, email, phone call, or AI message is an enquiry, not a booking or
                        purchase. Our team may follow up using the details you provide.
                    </p>
                </article>

                <article>
                    <h2>6. Accounts and portals</h2>
                    <p>
                        If you access a customer or staff portal, you are responsible for keeping login credentials
                        confidential and for activity under your account.
                    </p>
                </article>

                <article>
                    <h2>7. Intellectual property</h2>
                    <p>
                        Website content, branding, photography, and interface elements are owned by Rosewood Royale or
                        used with permission. You may not copy or redistribute site materials for commercial use without
                        consent.
                    </p>
                </article>

                <article>
                    <h2>8. External services and links</h2>
                    <p>
                        The site may include links or embeds such as maps or social destinations. Those services are
                        governed by their own terms and privacy practices.
                    </p>
                </article>

                <article>
                    <h2>9. Limitation of website information</h2>
                    <p>
                        To the fullest extent permitted by applicable law, Rosewood Royale is not liable for decisions
                        made solely on the basis of website or AI Concierge information. Always confirm important details
                        directly with the Rosewood team before acting.
                    </p>
                    <!-- TODO: Legal/business owner review required — confirm liability language with counsel. -->
                </article>

                <article>
                    <h2>10. Changes</h2>
                    <p>
                        We may update these terms as the website evolves. The “Last updated” date above will change when
                        revisions are published.
                    </p>
                </article>

                <article>
                    <h2>11. Contact</h2>
                    <p>
                        Questions about these terms can be sent to
                        <a href="mailto:hello@rosewoodroyale.com">hello@rosewoodroyale.com</a>
                        or through the
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

.rw-legal a {
    color: #f5f2ee;
    text-decoration: underline;
    text-underline-offset: 0.18em;
}
</style>
