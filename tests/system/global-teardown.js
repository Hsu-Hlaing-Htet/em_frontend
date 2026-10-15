import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, '../../../backend');

export default async function globalTeardown() {
    const cleanup = path.join(backendRoot, 'scripts/system_test_cleanup.php');
    const output = execFileSync('php', [cleanup], {
        cwd: backendRoot,
        encoding: 'utf8',
        env: {
            ...process.env,
            DB_DATABASE: 'rosewood_system_test',
            DB_CONNECTION: 'mysql',
            DB_HOST: '127.0.0.1',
            MAIL_MAILER: 'array',
        },
    });

    console.log(output);
}
