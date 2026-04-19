# 🚨 NEXUS — Intelligent Disaster Logistics Platform

> Predict. Route. Deliver. Before It's Too Late.

Built for **Google Solution Challenge 2026** | SDG 9 · SDG 11 · SDG 13

---

## 🌟 What is NEXUS?

NEXUS is an AI-powered supply chain intelligence platform that helps
governments, NGOs, hospitals, and suppliers deliver essential resources
like food, medicine, water, and emergency kits quickly during disasters
such as floods, earthquakes, or pandemics.

---

## 🔥 Key Features

- ⚡ **48hr Disruption Forecast** — Predicts failures before they happen
- 🌊 **Cascade Failure Simulator** — Shows how one delay destroys the chain
- 🛣️ **AI Auto-Rerouting** — Gemini AI suggests 3 alternate routes instantly
- 📡 **Live Socket Tracking** — Real-time shipment updates every 4 seconds
- 🗺️ **Live Route Map** — Interactive map with risk heatmaps
- 🔴 **Disruption Intelligence** — Live feed of active threats

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Maps | Leaflet.js + React-Leaflet |
| Backend | Node.js + Express |
| Real-time | Socket.io |
| AI | Google Gemini API |
| Styling | Custom CSS |

---

## 🚀 How to Run

### Prerequisites
- Node.js installed
- Git installed

### Step 1 — Clone the repo
```bash
git clone https://github.com/raziabegum705/nexus.git
cd nexus
```

### Step 2 — Start Backend
```bash
cd server
npm install
npm start
```

### Step 3 — Start Frontend (new terminal)
```bash
cd client
npm install
npm run dev
```

### Step 4 — Open Browser
http://localhost:3000
---

## 🔑 Optional — Gemini API

Create `server/.env` file:
GEMINI_API_KEY=your_key_here
Get free API key at: https://aistudio.google.com

Without it, AI reroute works with smart mock data ✅

---

## 📱 Pages

| Page | URL | Description |
|------|-----|-------------|
| Landing | / | Hero page with live stats |
| Dashboard | /dashboard | Live map + stats |
| Shipments | /shipments | AI reroute panel |
| Disruptions | /disruptions | Live disruption feed |
| Cascade Sim | /simulate | 🔥 Cascade failure simulator |

---

## 🎯 UN SDG Alignment

- **SDG 9** — Industry, Innovation & Infrastructure
- **SDG 11** — Sustainable Cities & Communities  
- **SDG 13** — Climate Action