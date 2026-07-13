import { computed } from 'vue';
import { formatCurrency, getStatusLabel } from '@/utils/formatter';
import {
    documentField,
    estimateMonthlyPayment,
    optionLabel,
    remainingAfterDeposit,
} from '@/utils/contractDocument';
import {
    PAYMENT_PLAN_OPTIONS,
    PAYMENT_TYPE_OPTIONS,
} from '@/constants/constant';

const COMPANY_INFO = {
    name: 'Rosewood Royale Residences',
    registration: 'Company Reg. No. RR-2020-001',
    address: 'No. 12, Kabar Aye Pagoda Road, Bahan Township, Yangon',
    phone: '+95 9 123 456 789',
    email: 'contracts@rosewoodroyale.com',
    website: 'www.rosewoodroyale.com',
};

export function useContractDocument(state, options = {}) {
    const {
        showPayment = false,
        showApproval = false,
        timeline = null,
    } = options;

    const paymentPlanLabel = computed(() => optionLabel(PAYMENT_PLAN_OPTIONS, state.payment_plan));
    const paymentTypeLabel = computed(() => optionLabel(PAYMENT_TYPE_OPTIONS, state.payment_type));
    const showInstallment = computed(() => state.payment_type === 'installment');

    const estimatedMonthly = computed(() => estimateMonthlyPayment({
        paymentType: state.payment_type,
        contractTotal: state.contract_total,
        deposit: state.deposit,
        durationMonths: state.duration_months,
    }));

    const document = computed(() => ({
        header: {
            title: 'Sale Contract Agreement',
            contractNo: state.contract_no,
            status: state.status,
            issuedDate: state.created_at || state.submitted_at || '-',
        },
        customer: [
            documentField('Full Name', state.customer_name),
            documentField('NRC / ID', state.customer_nrc),
            documentField('Phone', state.customer_phone),
            documentField('Email', state.customer_email),
        ],
        company: [
            documentField('Company Name', COMPANY_INFO.name),
            documentField('Registration', COMPANY_INFO.registration),
            documentField('Address', COMPANY_INFO.address),
            documentField('Phone', COMPANY_INFO.phone),
            documentField('Email', COMPANY_INFO.email),
            documentField('Website', COMPANY_INFO.website),
        ],
        property: [
            documentField('Building', state.building_name),
            documentField('Room / Unit', state.room_number),
            documentField('Sale Price', formatCurrency(state.room_price)),
            documentField('Booking Deposit', formatCurrency(state.deposit)),
        ],
        contract: [
            documentField('Contract Number', state.contract_no),
            documentField('Payment Plan', paymentPlanLabel.value),
            documentField('Payment Type', paymentTypeLabel.value),
            documentField('Contract Duration', state.duration_months ? `${state.duration_months} months` : '-'),
            documentField('Contract Total', formatCurrency(state.contract_total)),
            documentField('Commencement Date', state.start_date),
            documentField('Billing Day', state.billing_day ? `Day ${state.billing_day} of each month` : '-'),
            documentField('Contract Status', getStatusLabel(state.status)),
        ],
        payment: showPayment ? [
            documentField('Total Contract Value', formatCurrency(state.contract_total)),
            documentField('Deposit Paid', formatCurrency(state.deposit)),
            documentField('Amount Paid', formatCurrency(state.paid_amount)),
            documentField('Remaining Balance', formatCurrency(state.remaining_amount)),
            documentField('Payment Plan', paymentPlanLabel.value),
            documentField('Payment Type', paymentTypeLabel.value),
            ...(showInstallment.value ? [
                documentField('Estimated Monthly Payment', formatCurrency(estimatedMonthly.value)),
            ] : []),
        ] : showInstallment.value ? [
            documentField('Contract Total', formatCurrency(state.contract_total)),
            documentField('Deposit', formatCurrency(state.deposit)),
            documentField('Remaining Balance', formatCurrency(remainingAfterDeposit(state.contract_total, state.deposit))),
            documentField('Duration', `${state.duration_months} months`),
            documentField('Estimated Monthly Payment', formatCurrency(estimatedMonthly.value)),
        ] : [
            documentField('Contract Total', formatCurrency(state.contract_total)),
            documentField('Deposit', formatCurrency(state.deposit)),
            documentField('Payment Type', paymentTypeLabel.value),
        ],
        approval: showApproval ? [
            documentField('Prepared By', state.created_by),
            documentField('Created Date', state.created_at),
            documentField('Submitted By', state.submitted_by),
            documentField('Submitted Date', state.submitted_at),
            documentField('Approved By', state.approved_by || 'Pending'),
            documentField('Approved Date', state.approved_at || 'Pending'),
            ...(state.status === 'cancelled' ? [
                documentField('Cancellation Reason', state.cancellation_reason),
                documentField('Cancelled Date', state.cancelled_at),
            ] : []),
        ] : [
            documentField('Prepared By', state.created_by),
            documentField('Created Date', state.created_at),
        ],
        timeline: timeline ?? state.timeline ?? [],
        remarks: state.remarks?.trim() || 'No additional remarks.',
        signatures: [
            {
                role: 'Purchaser',
                name: state.customer_name || '________________',
                label: 'Customer Signature',
            },
            {
                role: 'Authorized Officer',
                name: state.approved_by || state.created_by || '________________',
                label: 'Company Representative',
            },
        ],
        installment: showInstallment.value ? {
            remainingAfterDeposit: formatCurrency(remainingAfterDeposit(state.contract_total, state.deposit)),
            duration: `${state.duration_months} months`,
            monthlyPayment: formatCurrency(estimatedMonthly.value),
        } : null,
    }));

    return { document };
}
