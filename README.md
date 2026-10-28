# Rosewood Royale — Frontend

Vue single-page application for Rosewood Royale Residences. It provides the public property website, customer portal, admin portal, authentication screens, and AI Concierge interface. All application API requests go to Laravel; the browser does not connect directly to MySQL, FastAPI, or OpenAI.

Repository: [em_frontend](https://github.com/Hsu-Hlaing-Htet/em_frontend).

## Technology Stack

- Vue 3.5, Vue Router 4, Pinia 3, and Vue I18n 10.
- Vite 7, Tailwind CSS 4, PrimeVue 3, and PrimeIcons.
- Axios for HTTP, SheetJS (`xlsx`) for spreadsheets, and Three.js for 3D views.
- Playwright for browser system tests.

See [package.json](package.json) for dependency ranges and scripts, and [package-lock.json](package-lock.json) for exact versions.

## Prerequisites

- Node.js matching the locked Vite/plugin engines: `^20.19.0 || >=22.12.0`. Node 22.12+ is a compatible choice.
- npm and Git. No Node/npm version is pinned at the project root; use `npm ci` with the committed lockfile.
- A configured, migrated Laravel backend with MySQL for application features. Follow the [backend README](https://github.com/Hsu-Hlaing-Htet/em_backend#readme) first.
- FastAPI only when using AI chat. Follow the [AI README](https://github.com/Hsu-Hlaing-Htet/em_ai#readme).

Start MySQL → backend (`:8000`) → AI (`:8001`, when needed) → frontend (`:5173`). Shell examples below use macOS/Linux syntax; Windows users can use WSL. Browser tests additionally require the environment described under [Running Tests](#running-tests).

## Quick Start

From this repository's root, with the backend already running:

```bash
npm ci
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The template points at `http://localhost:8000/api`; edit `.env` before starting Vite if your backend URL differs.

Confirm the public site loads and its property requests return HTTP 200 in the browser's Network tab. A rendered page alone does not confirm the API or database is reachable.

## Detailed Local Setup

### 1. Clone and install

```bash
git clone https://github.com/Hsu-Hlaing-Htet/em_frontend.git
cd em_frontend
node --version
npm --version
npm ci
cp .env.example .env
```

Skip steps already completed in Quick Start. Install development dependencies as well: Vite, Tailwind tooling, and the Axios HTTP client are declared there and are required to build the application.

### 2. Connect the backend

Set `.env`:

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api
VITE_ALLOWED_HOSTS=
```

In the backend `.env`, confirm:

```dotenv
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
CORS_SUPPORTS_CREDENTIALS=false
```

Clear cached backend configuration with `php artisan config:clear` from its repository, restart Laravel if needed, then start Vite here. Use `localhost` consistently in the browser; `127.0.0.1` is a different origin.

### 3. Verify login and optional AI

Use a local demo login from the backend's `database/seeders/UserSeeder.php` after running its documented migrations/seeding. Confirm `/api/auth/login` succeeds and the appropriate customer/admin dashboard loads data. Staff employment roles are not login roles.

For chat, start FastAPI and confirm the backend's `AI_SERVICE_BASE_URL=http://127.0.0.1:8001`. Then ask a public property question or a rent question as a logged-in customer. FastAPI health and test instructions are in the AI README. The rest of the application can run while AI is stopped.

## Environment Configuration

[.env.example](.env.example) contains both supported project variables:

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Laravel API URL, **including `/api`**. Used directly as the Axios base URL in `src/services/api.js`. |
| `VITE_ALLOWED_HOSTS` | Optional comma-separated hostnames allowed by Vite during local/tunnel development; no scheme or path. |

All `VITE_*` values are exposed to browser code. Keep API keys, database credentials, and AI internal keys in the server repositories. Restart Vite after changes. Production values are embedded at build time, so changing the hosting environment after a build does not update an existing bundle.

Vite also reads mode-specific and local environment files. If `.env` changes appear ineffective, check `.env.local`, `.env.development`, `.env.production`, their local variants, and exported environment variables for overrides.

## Running the Application

```bash
npm run dev
```

[Vite configuration](vite.config.js) sets port `5173` with `strictPort: true`; it fails rather than silently switching ports. For a tunnel, add the exact assigned hostname to `VITE_ALLOWED_HOSTS` and allow the corresponding frontend origin in backend CORS configuration.

Build production assets with:

```bash
npm run build
```

The output is `dist/`. Serve it with a static host configured to send application routes back to `index.html`, since routing uses browser history. Set `VITE_API_BASE_URL` to the deployed Laravel API before building, and configure that API to allow the deployed frontend origin. No hosting provider or `npm run preview` script is defined in this repository.

## Running Tests

The supported automated tests are Playwright system tests under `tests/system/`, organized by primary feature ownership:

```text
tests/system/
├── Timebox1/timebox1.spec.js          # Authentication and property management (3)
├── Timebox2/timebox2.spec.js          # Customer and contract management (3)
├── Timebox3/timebox3.spec.js          # Utility and billing management (3)
├── Timebox4/
│   ├── timebox4.spec.js              # Invoice, payment, and receipt workflow (3)
│   └── cross-module.spec.js          # Invoice visibility across portals (1)
├── Timebox5/timebox5.spec.js          # Maintenance and invoice handoff (4)
├── helpers/auth.js                  # Shared login helpers
├── fixtures/pw-proof.png             # Shared payment-proof fixture
├── global-setup.js                  # Backend test-database preparation
└── global-teardown.js               # Backend test-database cleanup
```

All 17 existing tests remain. Cross-portal invoice visibility belongs to Timebox 4 because its assertions concern invoices and payment navigation. The Timebox 1 dashboard check is a login/navigation smoke check, not Timebox 5 dashboard-metric coverage. The maintenance fee/invoice handoff stays in Timebox 5 with the workflow that creates it. See the [ownership report](docs/testing/system-test-reorganisation.md) for the mapping and the [browser execution report](docs/testing/system-test-execution.md) for actual run results and database-safety evidence. There is no frontend unit-test or lint script in `package.json`.

### Required system-test environment

The test commands use the existing backend disposable-MySQL runner and require this sibling layout:

```text
workspace/
├── backend/     Laravel checkout with Composer dependencies installed
└── frontend/    This checkout with npm dependencies installed
```

In addition to the frontend prerequisites, install Python 3, MySQL server/client tools (`mysqld` and `mysql` on `PATH`), and the backend's PHP dependencies/extensions. PHP needs `pdo_mysql`; Chrome/Chromium must be installed for the receipt PDF generated during payment approval. These runs were verified with Python 3.9, MySQL 8.0, PHP 8.4, and Chromium browser tests on macOS. Linux hosts may need browser OS packages; Windows users should use WSL for the Bash/PHP/MySQL harness.

From `backend/`, install dependencies with `composer install`. From `frontend/`, use `npm ci` and install the Playwright browser as shown below. No manual test-database creation, normal database migration/seeding, or changes to your regular `.env` are needed for these tests. Keep both repositories' testing changes together: the frontend scripts call `../backend/scripts/verify_timebox_tests.py --system-suite ...`.

Each browser command:

1. Initializes a new MySQL data directory beneath `backend/.test-verification/runs/<run-id>/` and starts it on a free loopback port, separate from the regular server on port 3306.
2. Verifies the connected server's actual port and data directory before creating `rosewood_system_test` there.
3. Supplies a fresh application key and isolated Laravel storage, public uploads, cache, compiled views, temporary files, and logs. Public assets are copied without following existing symlinks.
4. Starts its own Laravel server on `127.0.0.1:8010` and Vite on `localhost:5174`, with the test API URL and CORS origin supplied automatically. Both HTTP ports must be free; run suites sequentially.
5. Runs the existing preparation (`migrate:fresh` plus `SystemTestSeeder`), browser assertions, and cleanup only inside that disposable instance. The PHP guard rechecks the database name, host, port, actual data directory, storage paths, and captured mail configuration before allowing resets.
6. Shuts down the temporary MySQL process and removes its data directory. Evidence, logs, and isolated test uploads remain in that run's ignored directory for inspection.

The normal MySQL server may remain running; the test commands never use its credentials or data directory. Mail is captured with `array`, and queued work runs synchronously. These 17 tests do not exercise the AI service or OpenAI, so neither is required.

Use the npm commands below rather than invoking backend preparation/cleanup or `playwright test` directly. Execution outside the disposable runner is rejected. `PW_FRONTEND_URL` and `PW_BACKEND_URL` are set to the fixed test-server URLs by the runner; do not use them to target your normal application.

### Commands

From the frontend root:

```bash
npx playwright install chromium
npm run test:system -- --list
npm run test:system
```

The `--list` command only discovers tests: it does not start MySQL or either HTTP server, prepare a database, or run browser assertions. Normal execution resets/seeds only the newly verified disposable database. On Linux hosts needing browser OS packages, use `npx playwright install --with-deps chromium` with the permissions required by that host.

Suite selection:

| Command | Selected tests |
| --- | --- |
| `npm run test:system` | All five Timebox folders: 17 tests in 6 files. |
| `npm run test:system:tb1` | Only `Timebox1/`: 3 tests. |
| `npm run test:system:tb2` | Only `Timebox2/`: 3 tests. |
| `npm run test:system:tb3` | Only `Timebox3/`: 3 tests. |
| `npm run test:system:tb4` | Only `Timebox4/`, including `cross-module.spec.js`: 4 tests. |
| `npm run test:system:tb5` | Only `Timebox5/`: 4 tests. |
| `npm run test:system:cross` | Only `Timebox4/cross-module.spec.js`: 1 test. |

Append `-- --list` to any command to inspect its selection without invoking database hooks, for example `npm run test:system:tb4 -- --list`.

The harness uses one Chromium worker without retries. Some workflows depend on earlier steps in the same file, so run the full file/script rather than a single dependent assertion. Each run prints an explicit total/passed/failed/skipped/flaky summary suitable for terminal screenshots. Its `summary.json`, Playwright `system-results.json`, terminal output, `database-identity.json`, backend log, and failure artifacts remain under the printed `backend/.test-verification/runs/<run-id>/` directory. Generated `.last-*` files are local workflow artifacts. `npm run build` is a separate compilation check and does not run browser tests.

## Project Structure

```text
src/modules/         Public, customer, admin, and auth feature areas
src/components/      Shared and portal-specific UI
src/layouts/         Public, customer, and admin shells
src/services/        Axios client and API endpoint helpers
src/routes/          Router assembly
src/stores/          Pinia state
src/composables/     Shared Vue behavior
src/helpers/         Billing, document, and list helpers
src/assets/          Styles and bundled images
src/locales/         English and Myanmar translations
src/pages/           Shared status/error pages
public/              Static images, media, and models
tests/system/        Timebox1–Timebox5 workflows, shared helpers/fixtures, lifecycle hooks
```

For media maintenance, retain the asset-specific instructions in [Rosewood media](public/media/rosewood/README.md), [360-degree residence media](public/media/rosewood/future-residence-360/README.md), and [3D models](public/models/rosewood/README.md).

## Troubleshooting

| Symptom | Check or resolution |
| --- | --- |
| Vite fails on startup with a Node error | Check `node --version` against the locked Vite engine range above, then reinstall with `npm ci`. |
| Port 5173 already in use | Stop the conflicting process; Vite deliberately uses a strict port. |
| Page renders but API calls fail | Check `VITE_API_BASE_URL`, backend `/up`, MySQL, migrations, and the browser Network response. Restart Vite after environment changes. |
| CORS error | Allow the exact browser origin in backend `CORS_ALLOWED_ORIGINS`, clear backend config, and restart it. |
| Login returns 401 / 403 | Use a seeded account with a supported login role; check backend data and response details. |
| Tunnel hostname rejected | Add the hostname without `https://` to `VITE_ALLOWED_HOSTS` and restart Vite. |
| Chat fails | Check FastAPI `/health`, backend AI URL, and matching server-side internal keys. |
| System tests cannot find backend scripts | Use sibling directories named `backend` and `frontend` and install backend Composer dependencies. |
| Disposable MySQL will not start | Ensure `mysqld` and `mysql` are on `PATH`, support `--initialize-insecure`, and the run directory is writable. Inspect its `mysql-init.log` / `mysql.log`. Do not point tests at the normal database. |
| System-test server cannot start | Free ports 8010 and 5174 and inspect the printed run directory's `backend-server.log`; the runner supplies its own configuration cache paths. |
| Disposable-runner guard refuses execution | Run the supported npm script. Do not manually supply runtime markers or disable the identity/storage checks. |

## Related Repositories

- [Backend — em_backend](https://github.com/Hsu-Hlaing-Htet/em_backend)
- [Frontend — em_frontend](https://github.com/Hsu-Hlaing-Htet/em_frontend)
- [AI — em_ai](https://github.com/Hsu-Hlaing-Htet/em_ai)

Developed by [Hsu-Hlaing-Htet](https://github.com/Hsu-Hlaing-Htet).
