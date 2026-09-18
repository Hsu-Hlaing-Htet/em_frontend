# Rosewood Royale Frontend

Vue 3 single-page application for the Rosewood Royale real-estate and property management platform.

## Project Overview

This repository is the frontend for Rosewood Royale. It provides:

- A public marketing and property discovery website
- An authenticated customer portal
- An authenticated admin portal
- A public Rosewood AI Concierge chat UI for property questions

The app talks to the Laravel backend API. It does not call the AI service directly.

## Tech Stack

From `package.json` and project configuration:

- Vue 3
- Vite
- Vue Router
- Pinia
- PrimeVue / PrimeIcons
- Vue I18n
- Axios
- Tailwind CSS (via `@tailwindcss/vite`)
- SheetJS (`xlsx`) for spreadsheet-related features

## Application Areas

### Public Website

Public routes live under `src/modules/public/` and include:

- Home / landing
- Properties listing (`/properties`)
- Property detail (`/properties/:id`)
- For sale (`/buy`) and for rent (`/rent`)
- Services
- About
- Contact
- Privacy and Terms

The public layout also mounts the AI Concierge (`FloatingChat`) for property assistance.

### Customer Portal

Authenticated customer routes under `/customer`, including:

- Dashboard
- Contracts
- Invoices
- Payments
- Receipts
- Maintenance requests
- Notifications
- Profile

### Admin Portal

Authenticated admin routes under `/admin` (roles: `admin`, `super_admin`), including:

- Dashboard
- Buildings and rooms
- Residents and staff
- Roles
- Sale and rent contracts (drafts, active, approvals)
- Invoices, payments, and receipts (including approval flows)
- Utilities (including bulk import and approvals)
- Utility types, utility rates, charge types, payment plans, late fees, payment methods
- Maintenance requests
- Profile

### Auth

- Login
- Forgot password
- Reset password
- Forced change password (when required)

### AI Concierge

The public site embeds `FloatingChat` in property mode. Questions are sent through the frontend public API helper (`askPropertyQuestion`) to the Laravel endpoint `public/ai/property/ask`. The Laravel backend is responsible for proxying to the FastAPI AI service.

Architecture:

```text
Vue Frontend → Laravel Backend → FastAPI AI Service
```

## Project Structure

```text
.
├── index.html
├── package.json
├── vite.config.js
├── public/                 # Static public assets
└── src/
    ├── main.js             # App bootstrap
    ├── App.vue
    ├── assets/             # CSS and images
    ├── components/         # Shared UI (admin, customer, public, global)
    ├── composables/
    ├── config/
    ├── constants/
    ├── helpers/
    ├── i18n/
    ├── layouts/            # Public, customer, and admin shells
    ├── locales/            # en / my translations
    ├── modules/            # Feature modules (public, customer, admin, auth)
    ├── pages/              # Global status pages (404, forbidden, …)
    ├── routes/             # Root router assembly
    ├── services/           # Axios client and endpoint helpers
    ├── stores/
    └── utils/
```

## Requirements

- Node.js (compatible with the Vite 7 toolchain used by this project)
- npm

No Node engine range is pinned in `package.json`.

## Installation

```bash
git clone https://github.com/Hsu-Hlaing-Htet/em_frontend.git
cd em_frontend
npm install
```

## Environment Setup

Create a local `.env` in the project root (this file is gitignored).

Variables used by this frontend (names only):

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Base URL for the Laravel API (used by Axios in `src/services/api.js`) |
| `VITE_ALLOWED_HOSTS` | Optional comma-separated hostnames Vite may serve (for tunneled local development) |

Example shape (placeholder values only):

```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_ALLOWED_HOSTS=
```

Do not commit real secrets. Prefer local `.env` files that stay out of version control.

## Running Locally

```bash
npm run dev
```

Vite is configured to listen on port **5173** (`strictPort: true` in `vite.config.js`), so the default local URL is:

```text
http://localhost:5173
```

Ensure the Laravel backend is running and `VITE_API_BASE_URL` points at its API.

## Production Build

```bash
npm run build
```

Output is written to `dist/`. There is no `preview` script defined in `package.json`.

## Backend Integration

HTTP calls go through Axios (`src/services/api.js`) using `VITE_API_BASE_URL`. Authenticated requests attach a Bearer token from `localStorage` when present.

Related backend repository:

https://github.com/Hsu-Hlaing-Htet/em_backend

## AI Integration

Public AI Concierge requests are issued from the Vue app to the Laravel API path `public/ai/property/ask`. The frontend does not embed AI service URLs or API keys for that flow.

Related AI repository:

https://github.com/Hsu-Hlaing-Htet/em_ai

## Main Routes

### Public

| Path | Description |
|------|-------------|
| `/` | Home |
| `/about` | About (`/aboutus` redirects here) |
| `/properties` | Properties listing |
| `/properties/:id` | Property detail |
| `/buy` | For sale listing |
| `/rent` | For rent listing |
| `/services` | Services |
| `/contact` | Contact |
| `/privacy` | Privacy policy |
| `/terms` | Terms and conditions |

### Auth

| Path | Description |
|------|-------------|
| `/login` | Login |
| `/forgot-password` | Forgot password |
| `/reset-password` | Reset password |
| `/change-password` | Forced password change |

### Customer (`/customer/...`)

| Path | Description |
|------|-------------|
| `/customer/dashboard` | Dashboard |
| `/customer/contracts` | Contracts |
| `/customer/invoices` | Invoices |
| `/customer/payments` | Payments |
| `/customer/receipts` | Receipts |
| `/customer/maintenance-requests` | Maintenance requests |
| `/customer/notifications` | Notifications |
| `/customer/profile` | Profile |

### Admin (`/admin/...`)

| Path area | Description |
|-----------|-------------|
| `/admin/dashboard` | Dashboard |
| `/admin/buildings`, `/admin/rooms` | Property inventory |
| `/admin/residents`, `/admin/staff`, `/admin/roles` | People and access |
| `/admin/sale-contracts`, `/admin/rent-contracts` | Contracts |
| `/admin/approvals/...` | Contract approvals |
| `/admin/invoices`, `/admin/payments`, `/admin/receipts` | Billing |
| `/admin/utilities` and related masters | Utilities and billing configuration |
| `/admin/maintenance-requests` | Maintenance |
| `/admin/profile` | Profile |

## Build / Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server |
| `npm run build` | Production build to `dist/` |

## Security

- Do not commit secret environment values
- Configure API access with environment variables (`VITE_API_BASE_URL`)
- Never place private API keys directly in frontend source
- Treat the browser bundle as public: anything shipped in the client can be inspected

## Related Repositories

- Frontend: https://github.com/Hsu-Hlaing-Htet/em_frontend
- Backend: https://github.com/Hsu-Hlaing-Htet/em_backend
- AI: https://github.com/Hsu-Hlaing-Htet/em_ai

## Developer

Designed and Developed by Hsu_Hlaing_Htet

GitHub: https://github.com/Hsu-Hlaing-Htet
