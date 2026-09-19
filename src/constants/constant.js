export const GENDER_OPTIONS = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
];

export const ROOM_TYPE_OPTIONS = [
    { label: 'Sale', value: 'sale' },
    { label: 'Rent', value: 'rent' },
    { label: 'Both', value: 'both' },
];

export const ROOM_STATUS_OPTIONS = [
    { label: 'Available', value: 'available' },
    { label: 'Occupied', value: 'occupied' },
    { label: 'Sold', value: 'sold' },
];

export const ROOM_IMAGE_DESCRIPTION_OPTIONS = [
    { label: 'Living Room', value: 'Living Room' },
    { label: 'Master Bedroom', value: 'Master Bedroom' },
    { label: 'Bedroom', value: 'Bedroom' },
    { label: 'Kitchen', value: 'Kitchen' },
    { label: 'Bathroom', value: 'Bathroom' },
    { label: 'Balcony', value: 'Balcony' },
    { label: 'Parking Area', value: 'Parking Area' },
    { label: 'Building Exterior', value: 'Building Exterior' },
];

export const UTILITY_TYPE_STATUS_OPTIONS = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
];

export const UTILITY_RATE_STATUS_OPTIONS = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
];

export const LATE_FEE_TYPE_OPTIONS = [
    { label: 'Fixed', value: 'fixed' },
    { label: 'Percentage', value: 'percentage' },
];

export const LATE_FEE_PER_OPTIONS = [
    { label: 'Day', value: 'day' },
    { label: 'Month', value: 'month' },
];

export const LATE_FEE_STATUS_OPTIONS = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
];

export const PAYMENT_TYPE_OPTIONS = [
    { label: 'Full', value: 'full' },
    { label: 'Installment', value: 'installment' },
];

export const PAYMENT_PLAN_TYPE_OPTIONS = [
    { label: 'Full', value: 'full' },
    { label: 'Installment', value: 'installment' },
];

export const PAYMENT_PLAN_TYPE_FILTER_OPTIONS = [
    { label: 'Full Payment', value: 'full' },
    { label: 'Installment', value: 'installment' },
];

export const PAYMENT_PLAN_STATUS_OPTIONS = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
];

export const INVOICE_STATUS_OPTIONS = [
    { label: 'Draft', value: 'draft' },
    { label: 'Issued', value: 'issued' },
    { label: 'Overdue', value: 'overdue' },
    { label: 'Paid', value: 'paid' },
];

export const INVOICE_LIST_STATUS_OPTIONS = [
    { label: 'All', value: null },
    { label: 'Issued', value: 'issued' },
    { label: 'Overdue', value: 'overdue' },
    { label: 'Paid', value: 'paid' },
];

export const PAYMENT_LIST_STATUS_OPTIONS = [
    { label: 'All', value: null },
    { label: 'Paid', value: 'paid' },
    { label: 'Rejected', value: 'rejected' },
];

export const PAYMENT_TYPE_FILTER_OPTIONS = [
    { label: 'All types', value: null },
    { label: 'Rent', value: 'rent' },
    { label: 'Utility', value: 'utility' },
    { label: 'Maintenance', value: 'maintenance' },
    { label: 'Other', value: 'other' },
];

export const PAYMENT_METHOD_STATUS_OPTIONS = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
];

export const RECEIPT_STATUS_OPTIONS = [
    { label: 'Draft', value: 'draft' },
    { label: 'Issued', value: 'issued' },
];

export const MAINTENANCE_STATUS_OPTIONS = [
    { label: 'Pending', value: 'pending' },
    { label: 'Accepted', value: 'accepted' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
];

export const MAINTENANCE_CUSTOMER_STATUS_OPTIONS = [
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
];

export const MAINTENANCE_PRIORITY_OPTIONS = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
];

export const UTILITY_STATUS_OPTIONS = [
    { label: 'Draft', value: 'draft' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
];
export const SALE_CONTRACT_DRAFT_STATUS_OPTIONS = [
    { label: 'All Status', value: null },
    { label: 'Draft', value: 'draft' },
    { label: 'Pending Approval', value: 'pending_approval' },
    { label: 'Rejected', value: 'rejected' },
];

export const ACTIVE_SALE_STATUS_OPTIONS = [
    { label: 'All Statuses', value: null },
    { label: 'Active', value: 'active' },
    { label: 'Completed', value: 'completed' },
    { label: 'Terminated', value: 'terminated' },
    { label: 'Rejected', value: 'rejected' },
];

export const PAYMENT_PLAN_OPTIONS = [
    { label: 'Standard', value: 'standard' },
    { label: 'Flexible', value: 'flexible' },
    { label: 'Custom', value: 'custom' },
];


export const DURATION_MONTHS_OPTIONS = [12, 18, 24, 36, 48].map((months) => ({
    label: `${months} months`,
    value: months,
}));

export const BILLING_DAY_OPTIONS = Array.from({ length: 28 }, (_, index) => ({
    label: String(index + 1),
    value: index + 1,
}));
