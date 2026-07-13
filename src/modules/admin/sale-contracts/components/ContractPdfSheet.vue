<template>
    <article id="pdf-print" class="pdf-sheet">
        <header class="pdf-head">
            <div class="pdf-head-row">
                <div class="pdf-brand">
                    <img
                        src="@/assets/images/logo-dark.jpg"
                        alt="Rosewood Royale"
                        class="pdf-logo"
                    >
                    <div class="pdf-brand-text">
                        <p class="pdf-company">Rosewood Royale Residences</p>
                        <p class="pdf-company-sub">Residences &amp; Property Management</p>
                    </div>
                </div>

                <div class="pdf-head-meta">
                    <div class="pdf-meta-item">
                        <span class="pdf-meta-label">Contract No.</span>
                        <span class="pdf-meta-value">{{ document.header.contractNo || '—' }}</span>
                    </div>
                    <div class="pdf-meta-item">
                        <span class="pdf-meta-label">Issue Date</span>
                        <span class="pdf-meta-value">{{ document.header.issuedDate }}</span>
                    </div>
                </div>
            </div>

            <h1 class="pdf-doc-title">Property Sale Agreement</h1>
            <div class="pdf-rule pdf-rule--accent" />
        </header>

        <p class="pdf-preamble">
            This Property Sale Agreement ("Agreement") is made between the Seller and the
            Purchaser identified below, concerning the residential unit described herein, upon
            the terms and conditions set forth in this document.
        </p>

        <section class="pdf-block">
            <h2 class="pdf-block-title">The Parties</h2>
            <div class="pdf-rule" />

            <div class="pdf-parties">
                <div class="pdf-party">
                    <p class="pdf-party-label">Purchaser</p>
                    <dl class="pdf-rows">
                        <template
                            v-for="item in document.customer"
                            :key="`purchaser-${item.label}`"
                        >
                            <dt>{{ item.label }}</dt>
                            <dd>{{ item.value }}</dd>
                        </template>
                    </dl>
                </div>

                <div class="pdf-party">
                    <p class="pdf-party-label">Seller</p>
                    <dl class="pdf-rows">
                        <template
                            v-for="item in document.company"
                            :key="`seller-${item.label}`"
                        >
                            <dt>{{ item.label }}</dt>
                            <dd>{{ item.value }}</dd>
                        </template>
                    </dl>
                </div>
            </div>
        </section>

        <section class="pdf-block">
            <h2 class="pdf-block-title">The Property</h2>
            <div class="pdf-rule" />

            <dl class="pdf-rows">
                <template
                    v-for="item in document.property"
                    :key="`property-${item.label}`"
                >
                    <dt>{{ item.label }}</dt>
                    <dd>{{ item.value }}</dd>
                </template>
            </dl>
        </section>

        <section class="pdf-block">
            <h2 class="pdf-block-title">Terms of Sale</h2>
            <div class="pdf-rule" />

            <dl class="pdf-rows">
                <template
                    v-for="item in document.contract"
                    :key="`contract-${item.label}`"
                >
                    <dt>{{ item.label }}</dt>
                    <dd>{{ item.value }}</dd>
                </template>
            </dl>
        </section>

        <section class="pdf-block">
            <h2 class="pdf-block-title">Payment Terms</h2>
            <div class="pdf-rule" />

            <dl class="pdf-rows">
                <template
                    v-for="item in document.payment"
                    :key="`payment-${item.label}`"
                >
                    <dt>{{ item.label }}</dt>
                    <dd>{{ item.value }}</dd>
                </template>

                <template v-if="document.installment">
                    <dt>Remaining After Deposit</dt>
                    <dd>{{ document.installment.remainingAfterDeposit }}</dd>
                    <dt>Installment Period</dt>
                    <dd>{{ document.installment.duration }}</dd>
                    <dt>Estimated Monthly Payment</dt>
                    <dd>{{ document.installment.monthlyPayment }}</dd>
                </template>
            </dl>
        </section>

        <section class="pdf-block">
            <h2 class="pdf-block-title">Special Conditions</h2>
            <div class="pdf-rule" />

            <dl class="pdf-rows">
                <dt>Purchaser Obligations</dt>
                <dd>
                    The Purchaser shall pay all amounts due under this Agreement in accordance with
                    the agreed payment schedule, maintain the property in good condition, and comply
                    with all applicable building rules and regulations.
                </dd>
                <dt>Seller Obligations</dt>
                <dd>
                    The Seller shall deliver clear title to the property, provide all necessary
                    documentation, and ensure the property is transferred in the condition agreed
                    upon at the time of execution.
                </dd>
                <dt>Remarks</dt>
                <dd class="pdf-row-full">{{ document.remarks }}</dd>
            </dl>
        </section>

        <section class="pdf-block">
            <h2 class="pdf-block-title">Authorization</h2>
            <div class="pdf-rule" />

            <dl class="pdf-rows">
                <template
                    v-for="item in document.approval"
                    :key="`approval-${item.label}`"
                >
                    <dt>{{ item.label }}</dt>
                    <dd>{{ item.value }}</dd>
                </template>
            </dl>
        </section>

        <section class="pdf-block pdf-block--exec">
            <h2 class="pdf-block-title">Execution</h2>
            <div class="pdf-rule" />

            <p class="pdf-witness">
                IN WITNESS WHEREOF, the parties hereto have executed this Property Sale Agreement
                as of the date first written above.
            </p>

            <div class="pdf-signs">
                <div
                    v-for="signature in document.signatures"
                    :key="signature.role"
                    class="pdf-sign"
                >
                    <div class="pdf-sign-line" />
                    <p class="pdf-sign-name">{{ signature.name }}</p>
                    <p class="pdf-sign-role">{{ signature.label }}</p>
                    <p class="pdf-sign-date">Date: ____________________</p>
                </div>
            </div>
        </section>

        <footer class="pdf-foot">
            <div class="pdf-foot-row">
                <span>Confidential</span>
                <span class="pdf-foot-page">Page 1</span>
                <span class="pdf-foot-address">{{ companyAddress }}</span>
            </div>
        </footer>
    </article>
</template>

<script>
import { computed, defineComponent } from 'vue';

export default defineComponent({
    name: 'ContractPdfSheet',
    props: {
        document: {
            type: Object,
            required: true,
        },
        fieldSections: {
            type: Array,
            required: true,
        },
        showApprovalSection: {
            type: Boolean,
            default: false,
        },
    },
    setup(props) {
        const companyAddress = computed(() => (
            props.document.company?.find((item) => item.label === 'Address')?.value ?? ''
        ));

        return {
            companyAddress,
        };
    },
});
</script>

<style scoped>
.pdf-sheet {
    --pdf-ink: #1c1c1c;
    --pdf-muted: #6b6560;
    --pdf-line: rgba(28, 28, 28, 0.12);
    --pdf-accent: rgba(122, 49, 73, 0.55);

    width: 100%;
    max-width: 794px;
    min-height: 1123px;
    padding: 3.25rem 3rem 2.75rem;
    /* background: #1c1c1c; */
    color: var(--pdf-ink);
    border: 1px solid #d8d4cf;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-size: 10.5pt;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
}

.pdf-head {
    margin-bottom: 2.5rem;
}

.pdf-head-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 2rem;
    margin-bottom: 2rem;
}

.pdf-brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 0;
}

.pdf-logo {
    width: 2.5rem;
    height: 2.5rem;
    object-fit: cover;
    flex-shrink: 0;
}

.pdf-company {
    margin: 0;
    font-size: 11.5pt;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--pdf-ink);
}

.pdf-company-sub {
    margin: 0.3rem 0 0;
    font-size: 8.5pt;
    letter-spacing: 0.04em;
    color: var(--pdf-muted);
}

.pdf-head-meta {
    flex-shrink: 0;
    text-align: right;
}

.pdf-meta-item {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.15rem;
    margin-bottom: 0.85rem;
}

.pdf-meta-item:last-child {
    margin-bottom: 0;
}

.pdf-meta-label {
    font-size: 7.5pt;
    font-weight: 400;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--pdf-muted);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.pdf-meta-value {
    font-size: 10pt;
    font-weight: 400;
    letter-spacing: 0.02em;
    color: var(--pdf-ink);
}

.pdf-doc-title {
    margin: 0;
    font-size: 17pt;
    font-weight: 400;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--pdf-ink);
    text-align: center;
}

.pdf-rule {
    height: 1px;
    margin-top: 0.85rem;
    background: var(--pdf-line);
}

.pdf-rule--accent {
    width: 4.5rem;
    margin: 1.25rem auto 0;
    background: var(--pdf-accent);
}

.pdf-preamble {
    margin: 2.5rem 0 3rem;
    font-size: 10.5pt;
    line-height: 1.75;
    text-align: justify;
    color: #3a3a3a;
}

.pdf-block {
    margin-bottom: 2.75rem;
    page-break-inside: avoid;
    break-inside: avoid;
}

.pdf-block-title {
    margin: 0;
    font-size: 9pt;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #5c3d47;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.pdf-parties {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2.5rem;
    margin-top: 1.5rem;
}

.pdf-party-label {
    margin: 0 0 1rem;
    font-size: 8pt;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--pdf-muted);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.pdf-rows {
    margin: 1.25rem 0 0;
    display: grid;
    grid-template-columns: minmax(7.5rem, 32%) 1fr;
    gap: 0;
    column-gap: 1.75rem;
}

.pdf-party .pdf-rows {
    margin-top: 0;
    grid-template-columns: 1fr;
    row-gap: 0.85rem;
}

.pdf-party .pdf-rows dt {
    margin-bottom: 0.1rem;
}

.pdf-party .pdf-rows dd {
    padding-bottom: 0.85rem;
    border-bottom: 1px solid var(--pdf-line);
}

.pdf-party .pdf-rows dd:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.pdf-rows dt {
    margin: 0;
    padding: 0.55rem 0;
    font-size: 7.5pt;
    font-weight: 400;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--pdf-muted);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    border-bottom: 1px solid var(--pdf-line);
}

.pdf-rows dd {
    margin: 0;
    padding: 0.55rem 0;
    font-size: 10.5pt;
    line-height: 1.55;
    color: var(--pdf-ink);
    border-bottom: 1px solid var(--pdf-line);
}

.pdf-row-full {
    grid-column: 1 / -1;
    padding-top: 0.75rem;
    line-height: 1.7;
    text-align: justify;
    border-bottom: none;
}

.pdf-witness {
    margin: 1.5rem 0 2.5rem;
    font-size: 10.5pt;
    line-height: 1.75;
    text-align: justify;
    font-style: italic;
    color: #3a3a3a;
}

.pdf-signs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 3.5rem;
}

.pdf-sign {
    page-break-inside: avoid;
    break-inside: avoid;
}

.pdf-sign-line {
    height: 1px;
    margin-top: 5rem;
    background: var(--pdf-ink);
}

.pdf-sign-name {
    margin: 0.85rem 0 0.25rem;
    font-size: 10.5pt;
    font-weight: 400;
    color: var(--pdf-ink);
}

.pdf-sign-role,
.pdf-sign-date {
    margin: 0.2rem 0 0;
    font-size: 8.5pt;
    letter-spacing: 0.04em;
    color: var(--pdf-muted);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.pdf-block--exec {
    margin-bottom: 3rem;
}

.pdf-foot {
    padding-top: 1.5rem;
    border-top: 1px solid var(--pdf-line);
}

.pdf-foot-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1.5rem;
    align-items: center;
    font-size: 7.5pt;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--pdf-muted);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.pdf-foot-page {
    text-align: center;
}

.pdf-foot-address {
    text-align: right;
    text-transform: none;
    letter-spacing: 0.02em;
    font-size: 7.5pt;
    line-height: 1.45;
    color: #7a746e;
}

@media (max-width: 768px) {
    .pdf-sheet {
        padding: 2rem 1.5rem;
    }

    .pdf-head-row {
        flex-direction: column;
        gap: 1.5rem;
    }

    .pdf-head-meta {
        text-align: left;
    }

    .pdf-meta-item {
        align-items: flex-start;
    }

    .pdf-parties {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .pdf-rows {
        grid-template-columns: 1fr;
    }

    .pdf-rows dt {
        padding-bottom: 0.15rem;
        border-bottom: none;
    }

    .pdf-signs {
        grid-template-columns: 1fr;
    }

    .pdf-foot-row {
        grid-template-columns: 1fr;
        text-align: center;
    }

    .pdf-foot-address {
        text-align: center;
    }
}
</style>

<style>
@media print {
    @page {
        size: A4 portrait;
        margin: 16mm 18mm;
    }

    html,
    body {
        background: #ffffff !important;
    }

    #pdf-print {
        max-width: none;
        width: 100%;
        min-height: auto;
        margin: 0;
        padding: 0;
        border: none;
        box-shadow: none;
        color: #000000;
        font-size: 10.5pt;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    #pdf-print .pdf-block {
        page-break-inside: avoid;
        break-inside: avoid-page;
    }

    #pdf-print .pdf-block-title {
        page-break-after: avoid;
        break-after: avoid-page;
    }

    #pdf-print .pdf-preamble,
    #pdf-print .pdf-witness,
    #pdf-print .pdf-rows dd {
        orphans: 3;
        widows: 3;
    }

    #pdf-print .pdf-foot {
        page-break-inside: avoid;
        break-inside: avoid-page;
    }
}
</style>
