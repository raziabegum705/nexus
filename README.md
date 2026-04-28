<div align="center">

# ⬡ NEXUS
### Intelligent Disaster Logistics Platform

**Predict. Route. Deliver. Before It's Too Late.**

[![Live Demo](https://img.shields.io/badge/🔴_Live_Demo-Click_Here-00c896?style=for-the-badge)](https://nexus-app.vercel.app)
[![Demo Video](https://img.shields.io/badge/📹_Demo_Video-YouTube-ff0000?style=for-the-badge)](https://youtube.com/watch?v=YOUR_VIDEO_ID)
[![Project Deck](https://img.shields.io/badge/📊_Project_Deck-Google_Slides-4285F4?style=for-the-badge)](https://docs.google.com/presentation/d/YOUR_DECK_ID)

> Built for **Google Solution Challenge 2026** | SDG 9 · SDG 11 · SDG 13

</div>

---

## 🌍 Problem Statement

Every year, natural disasters affect **200+ million people** globally. The biggest killer isn't always the disaster itself — it's the failure to deliver aid in time. Supply chains break down, routes get blocked, and critical medical/food supplies sit stranded while people die.

NEXUS solves this with AI-powered logistics intelligence that predicts disruptions **before** they happen and automatically reroutes supplies in real-time.

---

## 🚀 Live Demo

| Resource | Link |
|----------|------|
| 🔴 Live App | https://nexus-app.vercel.app |
| 📹 Demo Video | https://youtube.com/watch?v=YOUR_VIDEO_ID |
| 📊 Project Deck | https://docs.google.com/presentation/d/YOUR_DECK_ID |
| 💻 GitHub | https://github.com/raziabegum705/nexus |

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🗺️ **Live Route Map** | Real-time shipment tracking across India using Leaflet maps |
| 🤖 **AI Rerouting** | Gemini AI suggests 3 alternate routes instantly when a shipment is at risk |
| ⚡ **Cascade Failure Simulator** | Unique feature — simulate how one delay ripples through the entire supply chain |
| 📡 **Live Disruption Feed** | Real-time alerts for weather, traffic, and operational disruptions via Socket.IO |
| 📊 **Mission Control Dashboard** | Live KPIs: total shipments, delays, risk scores, active disruptions |
| 🔥 **Firebase Realtime DB** | All data persists and syncs live across all connected users |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router, Leaflet Maps |
| Backend | Node.js, Express, Socket.IO |
| Database | **Firebase Realtime Database** (Google) |
| AI | **Gemini 1.5 Flash** (Google) |
| Deployment | Vercel (frontend) + Railway (backend) |
| SDGs | 9 (Industry & Infrastructure), 11 (Sustainable Cities), 13 (Climate Action) |

---

## 📸 Screenshots

### Dashboard — Mission Control
![Dashboard](./screenshots/dashboard.png)

### Live Shipment Tracking
![Shipments](./screenshots/shipments.png)

### AI Rerouting (Gemini)
![Reroute](./screenshots/reroute.png)

### Cascade Failure Simulator
![Simulate](./screenshots/simulate.png)

### Disruption Intelligence Feed
![Disruptions](./screenshots/disruptions.png)

---

## 🏃 Run Locally

### Prerequisites
- Node.js 18+
- Firebase project (free at console.firebase.google.com)
- Gemini API key (free at aistudio.google.com)

### Setup

```bash
# Clone the repo
git clone https://github.com/raziabegum705/nexus.git
cd nexus
```

#### Server
```bash
cd server
npm install

# Copy env file and fill in your keys
cp .env.example .env

# Seed Firebase with initial data (run once)
npm run seed

# Start server
npm run dev
```

#### Client
```bash
cd client
npm install

# Copy env file and fill in your Firebase config
cp .env.example .env

# Start client
npm run dev
```

Open http://localhost:5173

---

## 🔥 Firebase Setup (5 minutes)

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create project → name it **nexus**
3. Realtime Database → Create database → **Start in test mode**
4. Project Settings → Service Accounts → Generate new private key → save as `server/serviceAccountKey.json`
5. Project Settings → Your Apps → Add Web App → copy the config into `client/.env`
6. Run `cd server && npm run seed` to populate the database

---

## 🚀 Deploy

### Frontend → Vercel
1. Push to GitHub
2. [vercel.com](https://vercel.com) → New Project → Import repo
3. Root Directory: `client` | Framework: Vite
4. Add all `VITE_*` env vars from `client/.env`
5. Deploy → copy your live URL

### Backend → Railway
1. [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Root Directory: `server`
3. Add env vars: `GEMINI_API_KEY`, `FIREBASE_DB_URL`, `FIREBASE_SERVICE_ACCOUNT` (paste the JSON as one line)
4. Deploy → copy Railway URL → update `VITE_BACKEND_URL` in Vercel

---

## 👥 Team

| Name | Role |
|------|------|
| Razia Begum | Full Stack Lead |
| Ananya | Frontend Developer |
| Nivedh | Backend & DevOps |
| [Member 4] | UI/UX & Research |

---

## 🌱 SDG Alignment

- **SDG 9** — Resilient infrastructure through intelligent routing
- **SDG 11** — Sustainable disaster-resilient communities
- **SDG 13** — Climate action through weather-aware logistics

---

<div align="center">
Built with ❤️ for Google Solution Challenge 2026
</div>
