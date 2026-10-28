# Frontend system-test Timebox reorganisation

Reviewed on 28 October 2026. Scope: frontend system-test file placement, affected path references, npm suite selectors, and documentation. No application business logic, backend code, AI code, database contents, or database lifecycle hooks were changed. No commits or pushes were made.

The execution status below records the initial reorganisation task. Subsequent safe browser runs are documented in the [system-test execution report](system-test-execution.md).

## Ownership method and evidence

Ownership follows the primary business workflow asserted by each test, rather than the number of portals or modules it visits. Existing frontend `test.describe` labels were checked against actual assertions, frontend feature routes, and the backend's existing integration categories.

The backend's `docs/testing/reorganisation-report.md` specifies the five academic Timebox names:

1. Authentication and Property Management.
2. Customer and Contract Management.
3. Utility and Billing Management.
4. Invoice and Payment Management.
5. Maintenance and System Administration.

The backend was inspected read-only as supporting evidence. Its historical report is evidence of the agreed classification, not proof of current passing tests or a complete development chronology.

All paths below are relative to the frontend repository unless explicitly prefixed with `backend/`.

## File mapping

| Original path | New path | Tests | Assignment and supporting evidence |
| --- | --- | ---: | --- |
| `tests/system/timebox1.spec.js` | `tests/system/Timebox1/timebox1.spec.js` | 3 | Login/dashboard navigation, building creation, and denial of customer access to admin routes. Matches `backend/tests/Integration/Timebox1/AuthTest.php` and `PropertyManagementTest.php`, and frontend `src/modules/admin/buildings/routes.js`. The dashboard assertion checks login/navigation, not Timebox 5 dashboard calculations. |
| `tests/system/timebox2.spec.js` | `tests/system/Timebox2/timebox2.spec.js` | 3 | Admin rent-contract visibility and customer contract ownership/isolation. Matches `backend/tests/Integration/Timebox2/CustomerContractTest.php` and frontend `src/modules/customer/contracts/routes.js` plus `src/modules/admin/rent-contracts/routes.js`. |
| `tests/system/timebox3.spec.js` | `tests/system/Timebox3/timebox3.spec.js` | 3 | Utility types, utility list, and utility rates navigation. Matches `backend/tests/Integration/Timebox3/UtilityTypesAndRatesTest.php` and `UtilityListTest.php`, and frontend utility feature routes. These remain navigation checks; no additional calculation coverage is claimed. |
| `tests/system/timebox4.spec.js` | `tests/system/Timebox4/timebox4.spec.js` | 3 | Customer invoice visibility, payment with proof, admin approval, and customer receipt visibility. Matches `backend/tests/Integration/Timebox4/PaymentReceiptTest.php` and frontend invoice/payment/receipt routes. |
| `tests/system/cross-module.spec.js` | `tests/system/Timebox4/cross-module.spec.js` | 1 | The sole assertion workflow follows a seeded invoice across admin/customer portals and checks navigation to payment. Its business subject is invoice/payment management. Login is shared setup; visiting multiple portals does not give it a separate Timebox. Matches the Timebox 4 billing/payment integration category and frontend `src/modules/admin/invoices/routes.js` and `src/modules/customer/invoices/routes.js`. The original cross-module suite/test names are preserved. |
| `tests/system/timebox5.spec.js` | `tests/system/Timebox5/timebox5.spec.js` | 4 | Maintenance request creation, acceptance/completion with a fee, invoice approval handoff, and customer isolation. Matches `backend/tests/Integration/Timebox5/CustomerMaintenanceRequestTest.php`, `MaintenanceAdminTest.php`, and `MaintenanceFeeInvoiceTest.php`; the latter explicitly tests that a maintenance fee draft appears in the invoice approval queue. The billing handoff stays with the maintenance workflow that creates it. |

No unresolved ownership ambiguity was found among these six files. The cross-module file and the maintenance-to-invoice handoff were explicitly reviewed rather than assigned by filename alone.

| Timebox | Spec files | Test cases |
| --- | ---: | ---: |
| Timebox 1 | 1 | 3 |
| Timebox 2 | 1 | 3 |
| Timebox 3 | 1 | 3 |
| Timebox 4 | 2 | 4 |
| Timebox 5 | 1 | 4 |
| Total | 6 | 17 |

## Changes and preservation checks

- All six existing spec files moved; no new tests were written and none were deleted or duplicated.
- Shared auth imports now use `../helpers/auth.js`.
- Timebox 4 payment proof resolves through `../fixtures/pw-proof.png`; the shared fixture was not moved or duplicated.
- Timebox 5 maintenance state resolves through `../.last-maint-title`, retaining its original location under `tests/system/` and existing ignore rules.
- Each `test:system:tbN` npm script selects its matching `tests/system/TimeboxN/` directory. Timebox 4 includes both files. `test:system:cross` remains a convenience selector for the existing cross-module file inside Timebox 4.
- The all-tests command, Playwright configuration, setup/teardown hooks, auth helpers, and proof image remain unchanged. Recursive discovery already includes the new folders, so no configuration change was necessary.

For each moved file, reversing only the three allowed path substitutions produced a byte-for-byte match against its original Git `HEAD` source. This preserves complete test bodies, assertion text, names, serial configuration, and existing conditional skips. Shared helpers, fixture bytes, hooks, and `playwright.config.js` were also checked byte-for-byte against `HEAD` and were unchanged.

Before and after discovery lists were compared after removing only the added `TimeboxN/` path segment. All 17 entries matched, including suite/test names and source line locations. The five focused discovery selections are disjoint and their combined entries equal the complete discovery selection.

## Commands executed and actual results

All discovery commands below exited with status 0. `--list` loads the configuration/specs and lists selected tests; it does **not** run global hooks, browser assertions, or database operations.

| Command | Actual result |
| --- | --- |
| `npm run test:system -- --list` before moving files | 17 tests in 6 files. Baseline recorded. |
| `npm run test:system -- --list` after moving files | 17 tests in 6 files, all under Timebox 1–5. Matches the baseline test inventory. |
| `npm run test:system:tb1 -- --list` | 3 tests in 1 file; only `Timebox1/`. |
| `npm run test:system:tb2 -- --list` | 3 tests in 1 file; only `Timebox2/`. |
| `npm run test:system:tb3 -- --list` | 3 tests in 1 file; only `Timebox3/`. |
| `npm run test:system:tb4 -- --list` | 4 tests in 2 files; only `Timebox4/`, including the cross-module test. |
| `npm run test:system:tb5 -- --list` | 4 tests in 1 file; only `Timebox5/`. |
| `npm run test:system:cross -- --list` | 1 test in 1 file; `Timebox4/cross-module.spec.js`. |
| `node --check` on each of the six moved spec files | All six syntax checks passed. |
| Python source/import/fixture preservation audit | All six normalized sources matched originals; shared files unchanged; import, fixture, and maintenance-state paths resolve correctly. |
| `git diff --check` | Passed. |

### Browser execution blocked by the no-reset restriction

The existing `tests/system/global-setup.js` invokes backend `scripts/system_test_prepare.php`. That PHP script runs `migrate:fresh` and seeds `Database\\Seeders\\SystemTestSeeder` against `rosewood_system_test`. The existing `global-teardown.js` invokes `scripts/system_test_cleanup.php`, which runs `migrate:fresh` again.

The task explicitly prohibits resetting or reseeding **any** database. Therefore normal browser execution was not started; this is a known command-lifecycle conflict, not a browser test failure. No hook was bypassed, no tests were marked as passing without execution, and no alternative runner was added.

| Requested browser run | Actual execution status |
| --- | --- |
| `npm run test:system` | Not executed: preparation reseeds/resets the database; teardown also resets it. |
| `npm run test:system:tb1` | Not executed for the same restriction. Discovery verified selection only. |
| `npm run test:system:tb2` | Not executed for the same restriction. Discovery verified selection only. |
| `npm run test:system:tb3` | Not executed for the same restriction. Discovery verified selection only. |
| `npm run test:system:tb4` | Not executed for the same restriction. Discovery verified selection only. |
| `npm run test:system:tb5` | Not executed for the same restriction. Discovery verified selection only. |

There are no runtime pass/fail results from this reorganisation. Full and individual browser execution remains unverified until the database lifecycle is explicitly allowed or a separately approved non-reset test environment is provided. Existing serial dependencies, conditional skips, and assertion strength are preserved without claiming broader coverage.
