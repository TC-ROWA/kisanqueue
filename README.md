<p align="center">
  <img src="frontend/public/logo.png" width="120" alt="KisanQueue logo" />
</p>

<h1 align="center">KisanQueue</h1>
<p align="center"><strong>Less Waiting. Smarter Procurement.</strong></p>
<p align="center"><em>Know when to leave. Know where you stand. Know when you'll get paid.</em></p>

---

## 1. Overview

KisanQueue is a farmer-centric agricultural procurement platform that reduces waiting time,
unnecessary trips, and payment uncertainty at government/agricultural procurement centres.

Its core differentiator:

> **KisanQueue tells farmers when to leave home, not just when to stand in line.**

This repository contains:

- **`frontend/`** — a complete React + Vite + Tailwind app covering the full farmer, operator, and
  admin experience, running today on realistic **demo data** (clearly marked as such throughout the
  UI). It works immediately with `npm install && npm run dev` — no backend required to explore it.
- **`backend/`** — a FastAPI service skeleton with SQLAlchemy models matching the schema below, JWT
  auth against Supabase, and working endpoints for the core farmer/operator/admin flows.
- **`supabase/`** — the full PostgreSQL schema (`schema.sql`) with Row Level Security policies, plus
  demo seed data (`seed.sql`).

👉 **New to this project? Start with [`SETUP.md`](./SETUP.md)** — a step-by-step guide that takes you
from zero to a fully running app (frontend, backend, and Supabase database) with no assumed prior
setup, plus a troubleshooting section for the errors people hit most often.

---

## 2. Problem statement

Farmers face long queues, no visibility into wait times, unclear rejection reasons, repeated
unnecessary trips, and uncertainty about payment. Procurement centres, meanwhile, struggle with
overcrowding and paper-based records. KisanQueue addresses both sides with a shared, real-time view of
the queue, digital quality/weighing records, and transparent payment tracking.

## 3. Features

**Farmer:** registration & login, crop management, centre discovery (map), live centre status, smart
slot booking, digital QR token, live queue tracking, the signature **"Should I leave now?"**
recommendation, procurement tracking (registration → paid), quality-check and weighing records,
payment tracking, digital receipts, procurement history with filters, notifications, complaints.

**Procurement Centre Operator:** live queue dashboard, call next / hold / skip / no-show / complete,
quality-check and weighment entry, centre status and capacity updates.

**Administrator:** platform-wide statistics, farmer/operator/centre management, analytics (Recharts),
complaint management, system activity.

Cutting across all of these: multilingual-ready UI (English/Hindi), offline-aware farmer dashboard,
PWA installability, and loading/empty/error states on every page.

## 4. Technology stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Lucide icons, Recharts, Leaflet + OpenStreetMap, `vite-plugin-pwa` |
| Backend | Python 3.12, FastAPI, Pydantic, SQLAlchemy |
| Database / Auth / Realtime / Storage | Supabase (PostgreSQL, Auth, Realtime, Storage) |
| Deployment | Frontend → Vercel · Backend → Render/Railway · Database → Supabase |

No Docker, Kubernetes, Kafka, RabbitMQ, Redis, or Celery — this is intentionally a modular monolith
that runs comfortably on a normal laptop.

## 5. Architecture

```
kisanqueue/
├── frontend/                # React + Vite + Tailwind SPA
│   ├── public/
│   │   ├── logo.png         # official KisanQueue logo (favicon, navbar, PWA icon, etc.)
│   │   └── manifest handled by vite-plugin-pwa
│   └── src/
│       ├── components/      # Button, Card, StatusBadge, ProgressTimeline, Navbar, ...
│       ├── pages/            # one file per route
│       ├── context/          # AuthContext (demo auth)
│       └── services/
│           ├── api.js        # the ONE place every page reads data through
│           ├── mockData.js   # demo data (swap api.js to call the backend instead)
│           └── waitEstimate.js  # "Should I leave now?" + wait-time calculation
├── backend/                  # FastAPI service
│   └── app/
│       ├── main.py
│       ├── config.py / database.py / models.py / schemas.py / deps.py
│       └── routers/          # auth, farmers, centres, bookings, operator, admin, payments, complaints
└── supabase/
    ├── schema.sql             # full schema + Row Level Security
    └── seed.sql                # demo data
```

The frontend never talks to `mockData.js` directly outside of `api.js` — every page calls a function
like `getCentres()` or `createBooking()`. That means connecting the real backend later is a one-file
change (see `SETUP.md` → "Connecting the frontend to the real backend"), not a rewrite.

## 6. Folder structure — see section 5 above.

## 7. Environment variables

See `frontend/.env.example` and `backend/.env.example`. Never commit a real `.env` file.

## 8–12. Setup, running, demo accounts, deployment

**All of this lives in [`SETUP.md`](./SETUP.md)**, written as an ordered, copy-pasteable walkthrough
so it doesn't duplicate (and drift from) this overview.

## 13. Future improvements

- Replace the linear wait-time formula with a trained ML model (the function signature in
  `waitEstimate.js` / a future `predict_wait()` backend service is already shaped for this swap).
- SMS/IVR fallback for farmers without smartphones (backend is structured so a `notifications` gateway
  can plug in without touching queue logic).
- Push notifications via a service worker (the PWA scaffold is already in place).
- Real payment gateway / bank API integration in place of the demo payment record.
- Additional languages beyond English/Hindi using the same `preferred_language` field.

## License

Demo/prototype project. Not affiliated with any real government agency; centre names (Shakti Agro,
Kisan Seva, GreenField) are fictional.
