import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, '../../../backend');

export default async function globalSetup() {
    const prepare = path.join(backendRoot, 'scripts/system_test_prepare.php');
    const output = execFileSync('php', [prepare], {
        cwd: backendRoot,
        encoding: 'utf8',
        env: process.env,
    });

    if (!output.includes('rosewood_system_test')) {
        throw new Error('System test prepare did not confirm rosewood_system_test');
    }

    // Isolation snapshot markers for the report (dev/integration must stay untouched).
    process.env.PW_PREPARE_OK = '1';
    console.log(output);
}
