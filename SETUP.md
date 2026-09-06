# KisanQueue — Complete Setup Guide

This guide takes you from an empty folder to a fully running KisanQueue app —
**frontend, backend, and database** — step by step, with nothing assumed. Follow
it top to bottom in order. Each part tells you exactly what to type and what you
should see, plus what to do if it doesn't look right.

There are three parts you can do independently:

- **Part A — Frontend only (5 minutes).** Explore the full UI on demo data. No
  backend, no database, no account needed. Do this first.
- **Part B — Supabase database (15–20 minutes).** Create the real database.
- **Part C — Backend (10–15 minutes).** Run the FastAPI server and connect it
  to Supabase, then connect the frontend to the real backend.
- **Part D — Deployment.** Put it all on the internet.

---

## Before you start: install these once

| Tool | Check you have it | If missing |
|---|---|---|
| Node.js 18 or newer | `node -v` | Download from https://nodejs.org (LTS version) |
| npm (comes with Node) | `npm -v` | Comes with Node.js automatically |
| Python 3.12 (3.10+ works) | `python3 --version` | Download from https://python.org |
| pip | `pip3 --version` | Comes with Python automatically |
| A free Supabase account | — | Sign up at https://supabase.com (Part B only) |
| A code editor | — | VS Code is recommended, but any editor works |

If any `-v`/`--version` command says "command not found," that tool isn't
installed yet — install it before continuing.

---

## Part A — Run the frontend (demo mode)

This gets you the **entire app UI** — landing page, farmer dashboard, "Should I
leave now?", booking flow, live queue, operator dashboard, admin analytics —
running on realistic demo data. No backend or Supabase account needed yet.

### A1. Open a terminal in the project folder

```bash
cd kisanqueue/frontend
```

### A2. Install dependencies

```bash
npm install
```

This downloads everything listed in `package.json` into a `node_modules`
folder. It's normal for this to take 1–3 minutes and print some deprecation
warnings — as long as it doesn't end with the word `ERROR`, you're fine.

**If it fails:**
- `npm: command not found` → Node.js isn't installed or isn't on your PATH.
  Reinstall Node.js from nodejs.org and restart your terminal.
- A permissions error on macOS/Linux (`EACCES`) → don't use `sudo npm
  install`. Instead fix npm's permissions ([npm's official guide](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally))
  or use a Node version manager like `nvm`.
- Network/proxy errors → if you're behind a corporate proxy, configure it with
  `npm config set proxy http://...` and `npm config set https-proxy http://...`.

### A3. Start the dev server

```bash
npm run dev
```

You should see output ending with something like:

```
  VITE v5.x.x  ready in 400 ms
  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser. You should land on the
KisanQueue landing page with the logo, hero section, and "Stop Waiting. Start
Knowing." headline.

### A4. Explore it

- Click **Register** or **Login** — demo mode accepts any mobile number and
  password. Pick a role (Farmer / Centre Operator / Administrator) on the login
  screen to see each dashboard.
- As a **Farmer**, log in and you'll land on `/dashboard` with the "Should I
  leave now?" card, your token, and centre status.
- Try **Book a Procurement Slot**, then look at your generated **Token** (with
  QR code), then **View Live Queue** — the queue number advances automatically
  every few seconds to simulate realtime updates.
- Log out (top-right icon) and log back in as **Centre Operator** or
  **Administrator** to see those dashboards.

**If the page is blank or shows an error overlay:** open the browser's
developer console (F12 → Console tab) and read the red error text — it
usually names the exact file and line. Stop the server (Ctrl+C) and re-run
`npm run dev`; most issues at this stage come from an interrupted `npm
install` — delete the `node_modules` folder and `package-lock.json`, then
re-run `npm install`.

That's it — you now have the full product experience running locally. **Parts
B and C below are only needed if you want real accounts, a real database, and
real queue data instead of the demo data.**

---

## Part B — Set up the Supabase database

### B1. Create a Supabase project

1. Go to https://supabase.com and sign in (or create a free account).
2. Click **New Project**.
3. Fill in:
   - **Name:** `kisanqueue` (or anything you like)
   - **Database Password:** choose a strong password and **save it somewhere**
     — you'll need it for `DATABASE_URL` later.
   - **Region:** pick the one closest to you.
4. Click **Create new project** and wait 1–2 minutes while Supabase provisions it.

### B2. Run the schema

1. In your new project, open the left sidebar → **SQL Editor**.
2. Click **New query**.
3. Open `supabase/schema.sql` from this repository, copy its entire contents,
   and paste it into the SQL editor.
4. Click **Run** (or press Ctrl/Cmd+Enter).
5. You should see `Success. No rows returned` at the bottom. This created all
   17 tables (users, farmers, procurement_centres, bookings, queue_entries,
   etc.), their relationships, indexes, and Row Level Security policies.

**If it fails partway through:** the script is safe to re-run — every
`CREATE TYPE`/`CREATE TABLE` is guarded, so just fix the reported error and
run the whole file again. The most common cause is pasting only part of the
file — make sure you copied everything from `create extension` at the top to
the final comment at the bottom.

### B3. Load demo data (optional but recommended)

1. Still in the SQL Editor, open a **New query**.
2. Paste in the contents of `supabase/seed.sql` and click **Run**.
   This creates the 3 demo procurement centres, crops, and today's slots.
3. The demo farmer accounts need real Supabase Auth users before you can add
   their rows (this is a one-time step): go to **Authentication → Users →
   Add user** and create one, e.g. email `rajesh@kisanqueue.local`, any
   password. Copy the generated **User UID**.
4. Back in the SQL Editor, insert that farmer's profile using the UID you
   copied — the commented example at the bottom of `seed.sql` shows the exact
   two `INSERT` statements to run. Repeat for as many demo farmers as you
   want (the file lists 10 realistic names/villages to use).

### B4. Collect your project's API keys

Go to **Project Settings → API**. You'll need three values throughout this
guide:

| Value | Where it's shown | Used in |
|---|---|---|
| Project URL | "Project URL" | both `.env` files |
| `anon` `public` key | "Project API keys" | `frontend/.env` |
| `service_role` key | "Project API keys" (click "Reveal") | `backend/.env` — **never put this in the frontend** |

Also go to **Project Settings → Database → Connection string → URI** and copy
that (it includes the password you set in B1) — this is your `DATABASE_URL`
for the backend.

---

## Part C — Run the backend and connect everything

### C1. Set up the frontend's environment file

```bash
cd kisanqueue/frontend
cp .env.example .env
```

Open `.env` in your editor and fill in the three values from B4:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...           # the anon/public key, not service_role
VITE_API_URL=http://localhost:8000/api
```

### C2. Create a Python virtual environment for the backend

```bash
cd kisanqueue/backend
python3 -m venv venv
```

Activate it:

- **macOS/Linux:** `source venv/bin/activate`
- **Windows (PowerShell):** `venv\Scripts\Activate.ps1`
- **Windows (cmd.exe):** `venv\Scripts\activate.bat`

Your terminal prompt should now start with `(venv)`. Every command below
assumes the virtual environment is active — if you close and reopen your
terminal, reactivate it before continuing.

### C3. Install backend dependencies

```bash
pip install -r requirements.txt --upgrade pip
```

(If that flag ordering complains, just run `pip install --upgrade pip` once,
then `pip install -r requirements.txt`.)

**If `psycopg2-binary` fails to build** (rare, usually on Apple Silicon or
minimal Linux images): install it via your system package manager first
(`brew install postgresql` on macOS, `apt install libpq-dev` on Debian/Ubuntu),
then re-run the pip install.

### C4. Set up the backend's environment file

```bash
cp .env.example .env
```

Open `backend/.env` and fill in:

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # the service_role key — keep this secret
DATABASE_URL=postgresql://postgres:YOUR-DB-PASSWORD@db.your-project-ref.supabase.co:5432/postgres
FRONTEND_ORIGINS=http://localhost:5173
```

Use the exact connection string you copied in B4 for `DATABASE_URL` (it
already contains the right host and port — just make sure your database
password is filled in correctly, with any special characters URL-encoded).

### C5. Start the backend

```bash
uvicorn app.main:app --reload
```

You should see:

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

Open **http://localhost:8000/docs** in your browser — this is FastAPI's
auto-generated interactive API documentation (Swagger UI). You should see all
the endpoints listed (auth, farmers, centres, bookings, operator, admin,
payments, complaints) and be able to try them directly from the browser.

Also check **http://localhost:8000/health** — it should return
`{"status": "healthy"}`.

**If it fails to start:**
- `ModuleNotFoundError` → your virtual environment isn't activated, or step
  C3 didn't complete. Reactivate the venv and re-run `pip install -r
  requirements.txt`.
- A database connection error (`could not connect to server` / `password
  authentication failed`) → double-check `DATABASE_URL` in `backend/.env`
  against the exact string from Supabase (Project Settings → Database →
  Connection string), especially the password.
- `Address already in use` → something else is already running on port 8000.
  Either stop it, or run `uvicorn app.main:app --reload --port 8001` and
  update `VITE_API_URL` in `frontend/.env` to match.

### C6. Connecting the frontend to the real backend

Right now the frontend still reads from `frontend/src/services/mockData.js`
via `api.js`, even with the backend running — that's intentional, so the demo
never breaks. To switch a page over to live data:

1. Open `frontend/src/services/api.js`.
2. Set `export const IS_DEMO_MODE = false;` at the top.
3. Replace the body of each function with a real `fetch` call, for example:

   ```js
   export async function getCentres() {
     const res = await fetch(`${API_URL}/centres`);
     if (!res.ok) throw new Error('Failed to load centres');
     return res.json();
   }
   ```

   For endpoints that need auth (booking, profile, complaints), attach the
   Supabase session token as a bearer header:

   ```js
   import { supabase } from './supabaseClient'; // create this per C7 below

   const { data: { session } } = await supabase.auth.getSession();
   const res = await fetch(`${API_URL}/farmers/me`, {
     headers: { Authorization: `Bearer ${session.access_token}` }
   });
   ```

No component code needs to change — every page already calls these same
function names from `api.js`.

### C7. Wiring up real authentication (optional next step)

Create `frontend/src/services/supabaseClient.js`:

```js
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

Then replace the `login`/`register` functions inside
`frontend/src/context/AuthContext.jsx` with
`supabase.auth.signInWithPassword(...)` and a call to your backend's
`/api/auth/register` endpoint, respectively. Keep the same function
signatures (`login({ role })`, `logout()`) so no page needs to change.

---

## Demo accounts (Part A, no setup needed)

| Role | Mobile number | Password | Notes |
|---|---|---|---|
| Farmer | any 10 digits | anything | e.g. `9876543210` / `demo1234` |
| Centre Operator | any 10 digits | anything | pick "Centre Operator" on the login screen |
| Administrator | any 10 digits | anything | pick "Administrator" on the login screen |

These work because Part A runs entirely on demo data — there's nothing to
look up. Once you complete Parts B and C and flip `IS_DEMO_MODE` to `false`,
use the real accounts you created in Supabase Authentication instead.

---

## Part D — Deployment

### D1. Deploy the frontend to Vercel

1. Push this repository to GitHub (if you haven't already).
2. Go to https://vercel.com → **Add New → Project** → import your repo.
3. Set **Root Directory** to `frontend`.
4. Framework preset should auto-detect as **Vite**.
5. Under **Environment Variables**, add the same three variables from
   `frontend/.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and
   `VITE_API_URL` — set this to your deployed backend's URL, e.g.
   `https://kisanqueue-api.onrender.com/api`).
6. Click **Deploy**. Vercel gives you a live URL in about a minute.

### D2. Deploy the backend to Render (or Railway)

**Render:**
1. Go to https://render.com → **New → Web Service** → connect your repo.
2. Set **Root Directory** to `backend`.
3. **Build Command:** `pip install -r requirements.txt`
4. **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add the environment variables from `backend/.env` (`SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, and set `FRONTEND_ORIGINS` to
   your Vercel URL from D1).
6. Click **Create Web Service**.

**Railway** is nearly identical: New Project → Deploy from GitHub repo → set
root directory to `backend` → add the same environment variables → Railway
auto-detects the start command from a `Procfile` if you add one:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### D3. Final check

Visit your Vercel URL, register a real account, and confirm it reaches your
Render/Railway backend (open the browser Network tab and look for successful
`200` responses to `your-backend-url/api/...`). If you see CORS errors,
double-check `FRONTEND_ORIGINS` on the backend matches your exact Vercel URL
(including `https://`, no trailing slash).

---

## Troubleshooting index

| Symptom | Likely cause | Fix |
|---|---|---|
| `npm install` errors immediately | Node.js not installed / wrong version | Install Node 18+, restart terminal |
| Blank white page at localhost:5173 | JS error during render | Check browser console (F12); delete `node_modules` and reinstall |
| Map doesn't show on "Find Centres" page | Leaflet CSS didn't load (offline, or CDN blocked) | Confirm you have internet access; the Leaflet stylesheet loads from unpkg.com |
| `uvicorn: command not found` | Virtual environment not activated | Re-run the activation command from C2 |
| Backend starts but `/health` 404s | Wrong port or old cached page | Confirm the terminal shows port 8000; hard-refresh the browser |
| `password authentication failed` (backend) | Wrong `DATABASE_URL` password | Re-copy the connection string from Supabase, re-enter the DB password |
| CORS error in browser console | `FRONTEND_ORIGINS` doesn't match | Set it to the exact frontend URL, restart the backend |
| Login/Register does nothing after clicking submit | Still in demo mode with `IS_DEMO_MODE` left `true`, or Supabase keys missing | Check `frontend/.env` values and that `IS_DEMO_MODE` matches your intent |
| Supabase SQL Editor errors on `create policy` | Schema already partially applied with different names | Safe to re-run the whole `schema.sql` file — it's idempotent |

If you hit something not listed here, the fastest way to debug is: browser
console (frontend errors) → terminal running `uvicorn` (backend errors) →
Supabase **Logs** tab (database errors), in that order.
