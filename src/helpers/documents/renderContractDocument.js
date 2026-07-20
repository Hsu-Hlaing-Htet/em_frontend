import { escapeHtml, renderFieldRows } from './htmlUtils';

export function getContractDocumentMeta(document) {
    return [
        { label: 'Contract No.', value: document?.header?.contractNo || '—' },
        { label: 'Issue Date', value: document?.header?.issuedDate || '—' },
    ];
}

export function renderContractDocumentLead() {
    return `
        <p class="pdf-preamble">
            This Property Sale Agreement ("Agreement") is made between the Seller and the
            Purchaser identified below, concerning the residential unit described herein, upon
            the terms and conditions set forth in this document.
        </p>
    `;
}

export function renderContractDocumentBody(document) {
    if (!document) {
        return '';
    }

    const installmentRows = document.installment ? `
        <dt>Remaining After Deposit</dt>
        <dd>${escapeHtml(document.installment.remainingAfterDeposit)}</dd>
        <dt>Installment Period</dt>
        <dd>${escapeHtml(document.installment.duration)}</dd>
        <dt>Estimated Monthly Payment</dt>
        <dd>${escapeHtml(document.installment.monthlyPayment)}</dd>
    ` : '';

    const signatureBlocks = (document.signatures || []).map((signature) => `
        <div class="pdf-sign">
            <div class="pdf-sign-line"></div>
            <p class="pdf-sign-name">${escapeHtml(signature.name)}</p>
            <p class="pdf-sign-role">${escapeHtml(signature.label)}</p>
            <p class="pdf-sign-date">Date: ____________________</p>
        </div>
    `).join('');

    return `
        <section class="pdf-block">
            <h2 class="pdf-block-title">The Parties</h2>
            <div class="pdf-rule"></div>
            <div class="pdf-parties">
                <div class="pdf-party">
                    <p class="pdf-party-label">Purchaser</p>
                    <dl class="pdf-rows">${renderFieldRows(document.customer)}</dl>
                </div>
                <div class="pdf-party">
                    <p class="pdf-party-label">Seller</p>
                    <dl class="pdf-rows">${renderFieldRows(document.company)}</dl>
                </div>
            </div>
        </section>

        <section class="pdf-block">
            <h2 class="pdf-block-title">The Property</h2>
            <div class="pdf-rule"></div>
            <dl class="pdf-rows">${renderFieldRows(document.property)}</dl>
        </section>

        <section class="pdf-block">
            <h2 class="pdf-block-title">Terms of Sale</h2>
            <div class="pdf-rule"></div>
            <dl class="pdf-rows">${renderFieldRows(document.contract)}</dl>
        </section>

        <section class="pdf-block">
            <h2 class="pdf-block-title">Payment Terms</h2>
            <div class="pdf-rule"></div>
            <dl class="pdf-rows">
                ${renderFieldRows(document.payment)}
                ${installmentRows}
            </dl>
        </section>

        <section class="pdf-block">
            <h2 class="pdf-block-title">Special Conditions</h2>
            <div class="pdf-rule"></div>
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
                <dd class="pdf-row-full">${escapeHtml(document.remarks)}</dd>
            </dl>
        </section>

        <section class="pdf-block">
            <h2 class="pdf-block-title">Authorization</h2>
            <div class="pdf-rule"></div>
            <dl class="pdf-rows">${renderFieldRows(document.approval)}</dl>
        </section>

        <section class="pdf-block pdf-block--exec">
            <h2 class="pdf-block-title">Execution</h2>
            <div class="pdf-rule"></div>
            <p class="pdf-witness">
                IN WITNESS WHEREOF, the parties hereto have executed this Property Sale Agreement
                as of the date first written above.
            </p>
            <div class="pdf-signs">${signatureBlocks}</div>
        </section>
    `;
}
