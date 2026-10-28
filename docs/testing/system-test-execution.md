# Rosewood Royale browser system-test execution

Verified on 28 October 2026, following the Timebox folder reorganisation. This report records actual Chromium browser execution, not discovery or build results. It supersedes the earlier reorganisation report's execution blocker: database resets are now permitted only within a verified disposable environment.

## Final results

The final complete run executed all **17 unique system tests: 17 passed, 0 failed, 0 skipped, 0 flaky**. The complete suite also passed in an earlier independent run. Every individual Timebox was then executed against its own newly initialized MySQL instance. Retries remained disabled and the existing single-worker/serial configuration was preserved.

| Command, run from `frontend/` | Executed | Passed | Failed | Skipped | Flaky | Exit | Runner duration |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `npm run test:system` | 17 | 17 | 0 | 0 | 0 | 0 | 52.8 s |
| `npm run test:system:tb1` | 3 | 3 | 0 | 0 | 0 | 0 | 14.4 s |
| `npm run test:system:tb2` | 3 | 3 | 0 | 0 | 0 | 0 | 12.3 s |
| `npm run test:system:tb3` | 3 | 3 | 0 | 0 | 0 | 0 | 11.9 s |
| `npm run test:system:tb4` | 4 | 4 | 0 | 0 | 0 | 0 | 26.9 s |
| `npm run test:system:tb5` | 4 | 4 | 0 | 0 | 0 | 0 | 15.5 s |

Runner durations include Playwright setup, execution, and teardown, but exclude initial MySQL provisioning. The full suite and focused suites are separate executions of the same 17 tests; their counts must not be added and presented as unique coverage.

The JSON evidence was recursively inspected: every test had exactly one result with `status: passed`, every spec was marked successful, and all five focused suites contained only files from their matching `TimeboxN/` directory. Their combined test inventory equals the complete suite without omissions or duplicates.

All six spec files, 17 test cases, test names, assertions, serial configuration, and existing conditional skip code remain unchanged. The shared login helper and payment-proof fixture also remain unchanged. No application behavior was altered to obtain passing results.

## Environment and dependencies

- Playwright Test 1.64.1 using Chromium, one worker, no retries.
- Node.js 24.14.0, npm 11.9.0, Vue 3 / Vite 7.
- PHP 8.4.20, Laravel 12, MySQL 8.0.45, Python 3.9.6 on macOS.
- Laravel HTTP server at `127.0.0.1:8010`; Vite at `localhost:5174`.
- Chrome available to the backend for the real receipt PDF generated during payment approval.
- Captured mail (`array` transport), synchronous queues, isolated Laravel storage/cache/views/logs/temp files.

These 17 workflows do not call the AI service or OpenAI. Neither was started or claimed as tested. Backend API integration and browser-driven property, contract, utility, payment, receipt, maintenance, and access-control checks are exercised only to the extent asserted by the existing tests.

## Safety issue and correction

No browser-test failure was encountered after provisioning the safe environment; no outdated expectations, weakened assertions, added skips, or business-logic fixes were necessary.

The previous environment was unsuitable for the requested safety guarantee:

- It forced MySQL port 3306 with a fixed local account.
- Its guard checked the database name/host but did not verify that the connected server was newly initialized and disposable.
- It used ordinary backend writable/upload paths.
- Preparation ran `migrate:fresh` and `SystemTestSeeder`; teardown ran `migrate:fresh` again.

The existing `backend/scripts/verify_timebox_tests.py` disposable-MySQL runner was extended with `--system-suite` rather than introducing a second database orchestrator. The frontend npm commands now use that mode. It:

1. Creates a unique directory under `backend/.test-verification/runs/` and initializes MySQL there with `--no-defaults --initialize-insecure`.
2. Starts that process on a fresh loopback port and checks the actual `@@port` and `@@datadir` before creating the test schema.
3. Exports the verified settings, clears database URL/socket aliases, generates a fresh test application key, and isolates storage/public uploads/cache/views/logs/temp files. Public files are copied without following normal storage symlinks.
4. Starts the existing Laravel/Vite test servers and invokes the existing preparation, browser tests, and cleanup. PHP rechecks the connected database name, actual server port/data directory, isolated filesystem paths, and captured mail configuration before resets. Port 3306 is refused.
5. Retains test evidence, shuts down only the process it created, and removes only its own MySQL data directory.

Normal `.env` files and normal database credentials were not changed. No command in the browser runs targeted the normal database server/data directory. No normal database reset, reseed, truncation, or deletion was performed.

Calling `php backend/scripts/system_test_prepare.php` without a verified runtime was explicitly checked: it exits with status 255 and refuses execution before Laravel/database boot. This is an expected safety rejection, not a failed browser test. Direct Playwright execution without the runner is also rejected by the configuration; `--list` remains available without starting services or touching databases.

A protected-file snapshot of 341 environment/media/upload files was recorded before the complete browser runs and checked afterwards; every recorded file's SHA-256 remained unchanged. The final run identities below used separate ports and data directories. Their MySQL data directories were confirmed removed after shutdown.

| Final run | Evidence directory ID | Disposable MySQL port |
| --- | --- | ---: |
| Complete suite | `7d41622e842c4df6b851f20efbe3aea5` | 51385 |
| Timebox 1 | `c37a6eecccf8457eb96e84c7e5fcccc4` | 51925 |
| Timebox 2 | `2695e890344c45afbaa696e9ee780d30` | 52019 |
| Timebox 3 | `2c6acdfd700f4d86a810f76737cbc5bb` | 52122 |
| Timebox 4 | `1cac1fba9b4a45ecb63b24d1e522d607` | 52205 |
| Timebox 5 | `fc5cebce0f144442a3a8986629899917` | 52423 |

Evidence directories are beneath `backend/.test-verification/runs/<id>/` and are ignored by Git. Each retains `summary.json`, `system-results.json`, `system-output.txt`, `database-identity.json`, MySQL initialization/server logs, `backend-server.log`, and Playwright result artifacts. They contain local paths and test fixtures and should be reviewed before sharing outside the project.

## Other verification

| Check | Actual result |
| --- | --- |
| `npm run build` | Passed separately, exit 0. Vite reported its existing warning about chunks larger than 500 kB. This is not counted as a system-test pass. |
| `php artisan test tests/Integration/Timebox5/SystemTestRouterTest.php` with SQLite memory configuration | 9 passed, 18 assertions. Static public/upload serving, PHP source protection, traversal rejection, and private-symlink rejection remained intact. |
| PHP syntax checks for changed bootstrap, guard, router | Passed. |
| Source-preservation and JSON inventory audits | All original tests/assertions preserved; focused selections exactly partition the full suite. |
| `git diff --check` in backend and frontend | Passed. |

The execution sandbox initially denied binding local server sockets. Browser execution was subsequently run with authorized local-server access. No browser result was fabricated from the failed sandbox startup attempts.

## Exact files changed in this execution phase

Paths are relative to the common workspace root:

| File | Change |
| --- | --- |
| `backend/scripts/verify_timebox_tests.py` | Reuse disposable MySQL lifecycle for browser-suite selection, live terminal output, JSON summaries, and retained evidence. |
| `backend/scripts/system_test_bootstrap.php` | Require a verified runtime and boot Laravel with isolated writable/public paths and inherited connection settings. |
| `backend/scripts/system_test_db_guard.php` | Require isolated storage/captured mail, reject port 3306, and verify the connected database/port/data-directory identity. |
| `backend/scripts/system_test_router.php` | Serve isolated public/uploads and use the guarded application bootstrap for browser API requests; retain standalone router fixtures. |
| `backend/scripts/system_test_serve.sh` | Keep server diagnostics in the isolated run's backend log for readable terminal results. |
| `frontend/package.json` | Route existing all/Timebox/cross npm commands through the verified disposable runner. |
| `frontend/playwright.config.js` | Reject unguarded execution; retain per-run JSON and browser artifacts. |
| `frontend/tests/system/global-setup.js` | Forward the verified runtime environment to existing preparation. |
| `frontend/tests/system/global-teardown.js` | Forward the verified runtime environment to existing cleanup. |
| `frontend/README.md` | Replace unsafe/manual database instructions with the verified disposable workflow and evidence locations. |
| `frontend/docs/testing/system-test-execution.md` | This execution, safety, and reproducibility report. |
| `frontend/docs/testing/system-test-reorganisation.md` | Link the historical discovery-only status to the subsequent browser execution report. |

Earlier README edits, the Timebox file moves, and existing unrelated backend storage/symlink changes were retained. No application business logic, AI code, migrations, seeders, test assertions, or Timebox assignments changed in this phase. No commits or pushes were made.

## Reproduce terminal screenshots

With dependencies installed as described in the frontend README, open a terminal in `frontend/`, ensure HTTP ports 8010 and 5174 are free, and run these sequentially:

```bash
npm run test:system
npm run test:system:tb1
npm run test:system:tb2
npm run test:system:tb3
npm run test:system:tb4
npm run test:system:tb5
npm run build
```

Each browser command provisions and cleans up its own disposable MySQL instance, starts/stops its own HTTP services, and prints a final line containing actual total/passed/failed/skipped/flaky counts. You do not need to start or reset the normal database, Laravel server, or AI service. Keep the normal application on its usual ports if desired. A Chromium installation is required (`npx playwright install chromium`); receipt generation also requires backend Chrome/Chromium.

There are no unresolved system-test failures from these runs. The build-size warning remains, and live AI/provider behavior is outside these 17 tests' coverage.
