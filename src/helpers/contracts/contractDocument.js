export function optionLabel(options, value) {
    return options.find((item) => item.value === value)?.label || value || '-';
}

export function documentField(label, value) {
    return { label, value: value ?? '-' };
}

export function remainingAfterDeposit(contractTotal, deposit) {
    return Math.max((contractTotal || 0) - (deposit || 0), 0);
}

export function calculateRentContractTotal(monthlyRent, durationMonths) {
    const months = Number(durationMonths) || 1;

    return (Number(monthlyRent) || 0) * months;
}

export function remainingContractBalance({ contractType, contractTotal, deposit }) {
    if (contractType === 'rent') {
        return Math.max(contractTotal || 0, 0);
    }

    return remainingAfterDeposit(contractTotal, deposit);
}

export function estimateMonthlyPayment({ paymentType, contractType, contractTotal, deposit, durationMonths, roomPrice }) {
    if (contractType === 'rent') {
        return Number(roomPrice) || 0;
    }

    if (paymentType !== 'installment' || !durationMonths) {
        return 0;
    }

    return Math.ceil(remainingAfterDeposit(contractTotal, deposit) / durationMonths);
}

export function buildFieldSections(document) {
    if (!document) {
        return [];
    }

    const sections = [
        {
            title: 'Customer Information',
            fields: document.customer,
            wideLabels: [],
        },
        {
            title: 'Company Information',
            fields: document.company,
            wideLabels: ['Address'],
        },
        {
            title: 'Property Information',
            fields: document.property,
            wideLabels: [],
        },
        {
            title: 'Contract Information',
            fields: document.contract,
            wideLabels: [],
        },
    ];

    if (document.payment?.length) {
        sections.push({
            title: 'Payment Summary',
            fields: document.payment,
            wideLabels: [],
        });
    }

    return sections;
}
