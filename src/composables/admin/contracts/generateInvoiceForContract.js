import { formatDate } from '@/utils/formatter';
import { service as invoiceService } from '@/modules/admin/invoices/service';

const dueDateInSevenDays = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);

    return formatDate(date);
};

export async function generateInvoiceForContract(contract) {
    if (!contract?.id) {
        return null;
    }

    if (contract.type === 'rent') {
        return invoiceService.generateFromContract({ contract_id: contract.id });
    }

    return invoiceService.add({
        contract_id: contract.id,
        type: 'other',
        due_date: dueDateInSevenDays(),
        invoice_items: [
            {
                description: `Sale contract ${contract.contract_number || contract.contract_no || contract.id}`,
                amount: Number(contract.contract_total || 0),
            },
        ],
    });
}
