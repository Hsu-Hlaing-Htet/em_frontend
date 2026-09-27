/**
 * Build unique email recipients for the Send Email confirmation modal.
 * Uses CURRENT account emails from loaded document/customer state (display only;
 * backend still resolves delivery recipients independently).
 *
 * @param {Record<string, any>} state
 * @returns {{ name: string, email: string }[]}
 */
export function buildDocumentEmailRecipients(state = {}) {
    const recipients = [];

    const push = (name, email) => {
        const trimmedEmail = String(email || '').trim();
        if (!trimmedEmail) {
            return;
        }

        const key = trimmedEmail.toLowerCase();
        if (recipients.some((entry) => entry.email.toLowerCase() === key)) {
            return;
        }

        recipients.push({
            name: String(name || '').trim() || trimmedEmail,
            email: trimmedEmail,
        });
    };

    const contract = state.contract
        || state.payment?.invoice?.contract
        || state.invoice?.contract
        || null;

    const primary = state.customer || contract?.customer || null;
    const second = state.second_customer || contract?.second_customer || null;

    const flatName = String(state.customer_name || '').trim();
    const looksCombined = flatName.includes(' + ');

    const primaryName = state.primary_customer_name
        || primary?.name
        || (!looksCombined ? flatName : '')
        || (looksCombined ? flatName.split(' + ')[0].trim() : '')
        || '';

    push(primaryName, state.customer_email || primary?.email);

    push(
        state.second_customer_name || second?.name,
        state.second_customer_email || second?.email,
    );

    return recipients;
}
