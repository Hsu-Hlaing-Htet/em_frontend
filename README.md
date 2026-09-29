# Rosewood Royale — Frontend

Vue 3 single-page application for Rosewood Royale Residences.

This repository owns the public website, customer portal, admin portal, and AI chat UI. It talks only to the Laravel backend API. It does not call MySQL or the FastAPI AI service directly.

Repository: [Hsu-Hlaing-Htet/em_frontend](https://github.com/Hsu-Hlaing-Htet/em_frontend)

---

## Quick Start — Run Order

Start the full system in this order:

1. **MySQL** — database `rosewood_royale` must be available
2. **Laravel Backend** — Terminal 1
3. **FastAPI AI Service** — Terminal 2 (needed for AI chat)
4. **Vue Frontend** — Terminal 3 (this repository)

| Terminal | Service | Typical command | Local URL |
| --- | --- | --- | --- |
| — | MySQL | Start your local MySQL server | `127.0.0.1:3306` |
| 1 | Laravel Backend | `php artisan serve` (in `em_backend`) | http://localhost:8000 |
| 2 | FastAPI AI | `uvicorn app.main:app --reload --port 8001` (in `em_ai`) | http://localhost:8001 |
| 3 | Vue Frontend | `npm run dev` (in `em_frontend`) | http://localhost:5173 |

Connection flow:

```text
Browser
   |
   v
Vue Frontend (:5173)
   |
   v
Laravel Backend (:8000)
   | \
   |  \--> FastAPI AI (:8001)
   |
   +-----> MySQL (:3306)
```

---

## First-Time Setup

Do this once after cloning.

```bash
git clone git@github.com:Hsu-Hlaing-Htet/em_frontend.git
cd em_frontend
npm install
cp .env.example .env
```

Edit `.env` so the API base URL matches your Laravel server:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_ALLOWED_HOSTS=
```

You still need the backend, database, and (for AI) the AI service set up. Follow **First-Time Setup** in:

- https://github.com/Hsu-Hlaing-Htet/em_backend
- https://github.com/Hsu-Hlaing-Htet/em_ai

---

## Daily Development

When returning to the project:

1. Start MySQL
2. In `em_backend`: `php artisan serve`
3. In `em_ai` (with venv active): `uvicorn app.main:app --reload --port 8001`
4. In `em_frontend`:

```bash
npm run dev
```

Open http://localhost:5173

Optional (tunnel / ngrok): set `VITE_ALLOWED_HOSTS` to the exact tunnel hostname (no scheme), matching Vite’s `allowedHosts` behavior.

---

## Running the Full Rosewood Royale System

### Step 1 — Database

Ensure MySQL is running and the backend can connect to database `rosewood_royale` (see backend `.env.example`).

### Step 2 — Laravel Backend

```bash
cd em_backend
php artisan serve
```

URL: http://localhost:8000  
Health: http://localhost:8000/up  
API prefix: http://localhost:8000/api

### Step 3 — FastAPI AI

```bash
cd em_ai
source .venv/bin/activate   # Windows: .venv\Scripts\activate
uvicorn app.main:app --reload --port 8001
```

URL: http://localhost:8001  
Health: http://localhost:8001/health  
Docs: http://localhost:8001/docs

### Step 4 — Vue Frontend

```bash
cd em_frontend
npm run dev
```

URL: http://localhost:5173

Vite is configured with `port: 5173` and `strictPort: true`.

---

## Verify Everything Is Working

- [ ] http://localhost:5173 loads the public site
- [ ] Login works (request goes to Laravel via `VITE_API_BASE_URL`)
- [ ] Admin or customer dashboard data loads (Laravel ↔ MySQL)
- [ ] Public AI Concierge chat answers a property question (Vue → Laravel → FastAPI)
- [ ] Logged-in customer rent chat works when AI and backend are both up (Vue → Laravel → FastAPI → Laravel data)

If AI is down, the rest of the app can still run; only AI chat depends on FastAPI.

---

## Architecture

```text
Browser
   |
   v
Vue Frontend
   |
   v
Laravel Backend
   | \
   |  \--> FastAPI AI
   |
   +-----> MySQL
```

- **Vue** owns UI, routing, and API consumption.
- **Laravel** owns authentication, business rules, and data access.
- **MySQL** stores application data.
- **Laravel** proxies AI requests to FastAPI; the browser never calls FastAPI directly.
- **FastAPI** does not replace Laravel as the main backend.

---

## Repository Responsibility

This frontend owns:

- Public marketing / property discovery site
- Customer portal UI
- Admin portal UI
- Auth screens (login, forgot/reset/change password)
- UI routing (`vue-router`)
- HTTP client and endpoint helpers (Axios → Laravel)
- AI Concierge chat UI (`FloatingChat` on public and customer layouts)
- Document/list export triggers that call Laravel PDF/export APIs
- Contact form UI (submissions go to Laravel)

It does **not** own: database schema, business rules, mail delivery, or direct AI provider keys.

---

## Environment Configuration

Create `.env` from `.env.example`. Do not commit secrets.

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Laravel API base URL (Axios `baseURL` in `src/services/api.js`) |
| `VITE_ALLOWED_HOSTS` | Optional comma-separated hostnames Vite may serve (tunneling) |

Example placeholders:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_ALLOWED_HOSTS=
```

Backend CORS / `FRONTEND_URL` must allow http://localhost:5173 (see backend `.env.example`).

---

## Project Structure

```text
src/
├── modules/        # Feature areas: public, customer, admin, auth
├── components/     # Shared UI (admin, customer, public, global)
├── layouts/        # Public, customer, admin shells
├── services/       # Axios client and API endpoint map
├── routes/         # Router assembly
├── stores/         # Pinia stores
├── composables/    # Shared Vue composables
├── helpers/        # Domain helpers (documents, lists, invoices, …)
├── assets/         # CSS and images
├── locales/        # en / my translations
└── pages/          # Global status pages (404, forbidden, …)
```

---

## Tech Stack

Confirmed from `package.json` and Vite config:

- Vue `^3.5`
- Vite `^7`
- Vue Router `^4`
- Pinia `^3`
- PrimeVue `^3` / PrimeIcons
- Vue I18n `^10`
- Axios `^1` (devDependency; used as HTTP client)
- Tailwind CSS `^4` via `@tailwindcss/vite`
- SheetJS (`xlsx`) for spreadsheet features

No Node engine range is pinned in `package.json`. Use a current Node.js LTS compatible with Vite 7.

---

## Common Commands

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start Vite on http://localhost:5173 |
| `npm run build` | Production build to `dist/` |

There is no `preview` or frontend unit-test script in `package.json`.

---

## Testing

This repository does not define an automated frontend test suite in `package.json`.

Validate locally by:

1. `npm run build` succeeding
2. `npm run dev` and manual checks against a running Laravel API

Backend and AI have their own test commands in those repositories.

---

## Troubleshooting

**Frontend cannot reach backend**  
→ Confirm Laravel is running on http://localhost:8000  
→ Confirm `VITE_API_BASE_URL=http://localhost:8000/api`  
→ Restart Vite after changing `.env`  
→ Check backend `CORS_ALLOWED_ORIGINS` includes http://localhost:5173

**Page loads but login fails**  
→ Inspect Network tab for `/api/auth/login`  
→ Confirm MySQL is up and backend migrations/seed completed  
→ Confirm backend `.env` `APP_KEY` is set

**Vite refuses the hostname (ngrok)**  
→ Set `VITE_ALLOWED_HOSTS` to the exact tunnel hostname (no `https://`)

**AI chat fails but the rest of the app works**  
→ Confirm FastAPI on http://localhost:8001/health  
→ Confirm backend `AI_SERVICE_BASE_URL=http://127.0.0.1:8001`  
→ Confirm AI `.env` has a valid `OPENAI_API_KEY` and `BACKEND_BASE_URL`

**Port 5173 already in use**  
→ Vite uses `strictPort: true`; free port 5173 or stop the other process

---

## Deployment

This repository builds a static SPA (`npm run build` → `dist/`). Host the built assets behind your chosen static host or reverse proxy and point `VITE_API_BASE_URL` (build-time) at the deployed Laravel API.

Exact hosting provider for the frontend is not defined in this repository’s config files. Backend and AI deployment configs live in their own repos (`render.yaml` / Docker).

---

## Related Repositories

- Frontend: https://github.com/Hsu-Hlaing-Htet/em_frontend
- Backend: https://github.com/Hsu-Hlaing-Htet/em_backend
- AI: https://github.com/Hsu-Hlaing-Htet/em_ai

---

## Developer

Designed and Developed by Hsu_Hlaing_Htet

https://github.com/Hsu-Hlaing-Htet
