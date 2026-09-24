import { parseDate } from '@/utils/formatter';

export function normalizePaymentTypeFilter(value) {
    if (value == null || value === '') {
        return undefined;
    }

    if (typeof value === 'object') {
        return value.value ?? undefined;
    }

    return value;
}

export function filterContracts(contracts, {
    search,
    status,
    paymentType,
    dateFrom,
    dateTo,
    dateField = 'created_at',
}) {
    let result = [...contracts];

    if (search) {
        const keyword = search.toLowerCase();

        result = result.filter((item) => (
            item.contract_no?.toLowerCase().includes(keyword)
            || item.customer_name?.toLowerCase().includes(keyword)
            || item.primary_customer_name?.toLowerCase().includes(keyword)
            || item.second_customer_name?.toLowerCase().includes(keyword)
            || item.building_name?.toLowerCase().includes(keyword)
            || item.room_number?.toLowerCase().includes(keyword)
        ));
    }

    if (status) {
        result = result.filter((item) => item.status === status);
    }

    if (paymentType) {
        result = result.filter((item) => item.payment_type === paymentType);
    }

    if (dateFrom || dateTo) {
        result = result.filter((item) => {
            const value = parseDate(item[dateField]);

            if (!value) {
                return false;
            }

            if (dateFrom) {
                const from = new Date(dateFrom);
                from.setHours(0, 0, 0, 0);

                if (value < from) {
                    return false;
                }
            }

            if (dateTo) {
                const to = new Date(dateTo);
                to.setHours(23, 59, 59, 999);

                if (value > to) {
                    return false;
                }
            }

            return true;
        });
    }

    return result;
}
