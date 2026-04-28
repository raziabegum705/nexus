# 🚀 NEXUS — Setup Guide for Submission (3 Days)

---

## ✅ STEP 1 — Set up Firebase (30 minutes) — Razia

### 1.1 Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click **"Add project"** → name it `nexus` → Continue
3. Disable Google Analytics (not needed) → **Create project**

### 1.2 Enable Realtime Database
1. Left sidebar → **Realtime Database** → **Create database**
2. Choose region: `asia-southeast1` (closest to India)
3. Select **"Start in test mode"** → Enable
4. Copy the database URL — looks like: `https://nexus-xxxxx-default-rtdb.asia-southeast1.firebasedatabase.app`

### 1.3 Get Service Account Key (for server)
1. Project Settings (gear icon) → **Service accounts** tab
2. Click **"Generate new private key"** → Download JSON
3. Rename it `serviceAccountKey.json`
4. Move it into the `server/` folder
5. ⚠️ NEVER commit this file to GitHub — it's already in .gitignore

### 1.4 Get Web App Config (for client)
   1. Project Settings → **Your apps** → Click **"</>** (Web)"
   2. Register app → name it `nexus-web` → Register
   3. Copy the `firebaseConfig` object — you'll need it in the next step

---

## ✅ STEP 2 — Configure Environment Variables (10 minutes)

### Server (.env)
```bash
cd server
cp .env.example .env
```
Open `server/.env` and fill in:
```
GEMINI_API_KEY=your_gemini_key       # from aistudio.google.com
FIREBASE_DB_URL=https://nexus-xxxxx-default-rtdb.asia-southeast1.firebasedatabase.app
PORT=5000
```

### Client (.env)
```bash
cd client
cp .env.example .env
```
Open `client/.env` and fill in from your Firebase web app config:
```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=nexus-xxxxx.firebaseapp.com
VITE_FIREBASE_DB_URL=https://nexus-xxxxx-default-rtdb.asia-southeast1.firebasedatabase.app
VITE_FIREBASE_PROJECT_ID=nexus-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=nexus-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_BACKEND_URL=http://localhost:5000
```

---

## ✅ STEP 3 — Install & Seed Firebase (10 minutes)

```bash
# Install server dependencies (firebase-admin is now included)
cd server
npm install

# Seed your Firebase database with initial data
npm run seed
# You should see:
# ✅ Seeded 9 shipments
# ✅ Seeded 4 disruptions
# ✅ Seeded 8 nodes

# Install client dependencies (firebase SDK is now included)
cd ../client
npm install
```

---

## ✅ STEP 4 — Run locally and take screenshots (15 minutes)

```bash
# Terminal 1 — start server
cd server && npm run dev

# Terminal 2 — start client
cd client && npm run dev
```

Open http://localhost:5173

**Take screenshots of ALL 5 pages and save to `/screenshots/`:**
- `dashboard.png` — the main dashboard with map
- `shipments.png` — the shipments list
- `reroute.png` — after clicking AI Reroute on SHP002 (delayed)
- `simulate.png` — cascade simulator with SHP001 selected
- `disruptions.png` — disruption feed page

---

## ✅ STEP 5 — Deploy Frontend to Vercel (10 minutes) — Nivedh

1. Push everything to GitHub first:
```bash
git add .
git commit -m "feat: Firebase integration + deployment config"
git push
```

2. Go to https://vercel.com → **New Project**
3. Import your GitHub repo `raziabegum705/nexus`
4. Set **Root Directory** → `client`
5. Framework: **Vite** (auto-detected)
6. **Environment Variables** — add all your `VITE_*` values from `client/.env`
7. Click **Deploy**
8. Copy your live URL (e.g. `https://nexus-app.vercel.app`)

---

## ✅ STEP 6 — Deploy Backend to Railway (15 minutes) — Nivedh

1. Go to https://railway.app → **New Project** → **Deploy from GitHub repo**
2. Select your repo → Set **Root Directory** → `server`
3. Add **Environment Variables**:
   - `GEMINI_API_KEY` = your key
   - `FIREBASE_DB_URL` = your database URL
   - `FIREBASE_SERVICE_ACCOUNT` = open `serviceAccountKey.json`, copy ALL content, paste as one line
   - `PORT` = 5000
4. Deploy → copy your Railway URL (e.g. `https://nexus-server.railway.app`)

5. Go back to **Vercel** → your project → Settings → Environment Variables
6. Update `VITE_BACKEND_URL` = your Railway URL
7. Redeploy on Vercel

---

## ✅ STEP 7 — Update README (5 minutes) — Razia

Open `README.md` and replace these placeholders:
```
https://nexus-app.vercel.app         ← your actual Vercel URL
https://youtube.com/watch?v=YOUR_VIDEO_ID   ← your YouTube demo link
https://docs.google.com/presentation/d/YOUR_DECK_ID  ← your Google Slides link
```

---

## ✅ STEP 8 — Record Demo Video (30 minutes) — Whole Team

Use OBS Studio (free) or Loom (free) to record your screen.

**Script (2 minutes max):**
```
0:00 - 0:15  → "Every year disasters kill thousands because aid
                doesn't reach in time. NEXUS fixes that with AI."

0:15 - 0:25  → Show Landing page

0:25 - 0:45  → Show Dashboard — point out live map + KPI cards updating

0:45 - 1:15  → Go to Shipments → click "AI Reroute" on SHP002 (DELAYED)
               Wait for Gemini to respond → show 3 routes

1:15 - 1:30  → Go to Disruptions → show live alert feed

1:30 - 1:55  → Go to Simulate → select SHP001 → Run Cascade
               THIS IS YOUR UNIQUE FEATURE — spend time here

1:55 - 2:00  → End screen showing: GitHub URL + Live URL
               "Built with Gemini AI, Firebase, React"
```

Upload to YouTube (unlisted is fine) → copy the link.

---

## ✅ STEP 9 — Final Submission Checklist

Before submitting on April 28:

- [ ] Live URL works: https://nexus-app.vercel.app
- [ ] GitHub repo is PUBLIC
- [ ] Demo video uploaded to YouTube (under 3 min)
- [ ] Google Slides deck ready (5-8 slides)
- [ ] README has live URL, video link, real screenshots
- [ ] Firebase database has real data (check console)
- [ ] Gemini API rerouting works on live URL
- [ ] Cascade simulator works on live URL

---

## 🆘 Troubleshooting

**Firebase seed fails:**
- Check `FIREBASE_DB_URL` in `.env` is correct
- Make sure `serviceAccountKey.json` is in `server/` folder
- Make sure database is in **test mode** (not locked)

**Vercel build fails:**
- Check all `VITE_*` env vars are added in Vercel dashboard
- Make sure Root Directory is set to `client`

**Railway server crashes:**
- Check `FIREBASE_SERVICE_ACCOUNT` is valid JSON (no line breaks)
- Check `GEMINI_API_KEY` is correct

**Socket.IO not connecting on live URL:**
- Make sure `VITE_BACKEND_URL` in Vercel = your Railway URL (no trailing slash)
- Railway → Settings → make sure port 5000 is exposed
