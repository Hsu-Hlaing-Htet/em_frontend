import { service as staffService } from '@/modules/admin/staff/service';
import { service as residentService } from '@/modules/admin/residents/service';

/**
 * Client-side duplicate check for account email across staff and residents.
 * Backend Rule::unique remains the source of truth.
 *
 * @param {{ email: string, ignoreUserId?: number|string|null }} params
 * @returns {Promise<string|null>} Error message when duplicate, otherwise null.
 */
export async function findDuplicateAccountEmailError({ email, ignoreUserId = null }) {
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedEmail) {
        return null;
    }

    const [staffResponse, residentResponse] = await Promise.all([
        staffService.getAll({ search: normalizedEmail, per_page: 100 }),
        residentService.getAll({ search: normalizedEmail, per_page: 100 }),
    ]);

    const rows = [
        ...(Array.isArray(staffResponse?.data?.data) ? staffResponse.data.data : []),
        ...(Array.isArray(residentResponse?.data?.data) ? residentResponse.data.data : []),
    ];

    const ignoreId = ignoreUserId == null ? null : Number(ignoreUserId);

    const duplicate = rows.find((account) => {
        const sameEmail = String(account?.email || '').trim().toLowerCase() === normalizedEmail;
        const isOtherRecord = ignoreId == null || Number(account?.id) !== ignoreId;

        return sameEmail && isOtherRecord;
    });

    if (!duplicate) {
        return null;
    }

    return 'This email is already in use.';
}

