import { cleanupPwTb1Records } from '../../helpers/pwTb1Cleanup.js';

/**
 * Always runs after the Timebox 1 demo suite (pass or fail).
 */
export default async function globalTeardown() {
    try {
        const summary = await cleanupPwTb1Records();
        // eslint-disable-next-line no-console
        console.log(
            `PW_TB1 cleanup complete — images: ${summary.imagesDeleted}, rooms: ${summary.roomsDeleted}, buildings: ${summary.buildingsDeleted}`,
        );
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('PW_TB1 cleanup failed:', error.message || error);
        throw error;
    }
}
