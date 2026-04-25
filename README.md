# 🚨 NEXUS — Intelligent Disaster Logistics Platform

> Predict. Route. Deliver. Before It's Too Late.

---

Built for **Google Solution Challenge 2026**
Aligned with **SDG 9 · SDG 11 · SDG 13**

---

## 🌍 Overview

NEXUS is an AI-powered disaster logistics platform designed to help governments, NGOs, hospitals, and suppliers deliver critical resources quickly during emergencies such as floods, earthquakes, pandemics, and road disruptions.

The platform uses predictive intelligence, real-time shipment tracking, route optimization, and disruption monitoring to ensure food, medicine, water, and relief kits reach affected communities faster.

---

## ✨ Core Features

- ⚡ **48hr Disruption Forecast** — Predicts risks before failures occur
- 🛣️ **AI Auto-Rerouting** — Suggests alternate delivery routes instantly
- 📡 **Live Shipment Tracking** — Real-time updates for all deliveries
- 🗺️ **Live Route Map** — Interactive map with active routes and risks
- 🔴 **Disruption Intelligence Feed** — Weather, traffic, and threat alerts
- 🌊 **Cascade Failure Simulator** — Visualizes chain-reaction disruptions
- 📊 **Mission Control Dashboard** — Centralized monitoring for operations

---

## 📱 Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing Page | `/` | Hero page with stats and features |
| Dashboard | `/dashboard` | Live KPIs, map, alerts, risks |
| Shipments | `/shipments` | Delivery tracking + AI rerouting |
| Disruptions | `/disruptions` | Live threat intelligence feed |
| Cascade Simulator | `/simulate` | Supply chain impact simulator |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js + Vite |
| Maps | Leaflet.js + React-Leaflet |
| Backend | Node.js + Express.js |
| Real-Time | Socket.IO |
| AI | Google Gemini API |
| Styling | Custom CSS |
| Data Layer | Local Mock Data (`mockData.js`) |
| Version Control | Git + GitHub |

---

## 🏗️ System Architecture

```text
Frontend (React + Vite)
        ↓
Backend APIs (Node + Express)
        ↓
Socket.IO Live Updates
        ↓
Gemini AI Engine
        ↓
Maps + Route Visualization
        ↓
Mock Data / Future Database
```

---

## 🚀 Installation & Run Locally

### Prerequisites

- Node.js installed
- Git installed

### 1️⃣ Clone Repository

```bash
git clone https://github.com/raziabegum705/nexus.git
cd nexus
```

### 2️⃣ Start Backend

```bash
cd server
npm install
npm start
```

Server runs at:

```
http://localhost:5000
```

### 3️⃣ Start Frontend (new terminal)

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

## 🔑 Optional Gemini API Setup

Create file:

```
server/.env
```

Add:

```env
GEMINI_API_KEY=your_api_key_here
```

Get a free API key from: https://aistudio.google.com

> Without an API key, the app still works using smart mock data.

---

## 📸 MVP Screenshots

### Landing Page
> Add screenshot here

### Dashboard
> Add screenshot here

### Shipments
> Add screenshot here

### Disruptions
> Add screenshot here

### Cascade Simulator
> Add screenshot here

---

## 🎯 Problem Solved

During disasters, emergency deliveries often fail due to:

- 🚧 Blocked roads
- 🤝 Poor coordination
- 📰 Delayed information
- 👁️ Lack of route visibility
- ⏱️ Slow decision-making

NEXUS solves this through **predictive logistics intelligence** and **real-time coordination**.

---

## 🌟 Unique Selling Points

- ✅ Predict disruptions before they happen
- ✅ AI-powered rerouting in seconds
- ✅ Real-time logistics visibility
- ✅ Cascade impact simulation
- ✅ Single platform for coordination

---

## 🌱 UN SDG Alignment

| Goal | Focus |
|------|-------|
| **SDG 9** | Industry, Innovation & Infrastructure |
| **SDG 11** | Sustainable Cities & Communities |
| **SDG 13** | Climate Action |

---

## 🔮 Future Scope

- 🔹 Firebase / MongoDB live database integration
- 🔹 Real GPS vehicle tracking
- 🔹 SMS / WhatsApp alerts
- 🔹 Drone & autonomous delivery integration
- 🔹 Multi-language citizen portal
- 🔹 Government control room analytics

---

## 👥 Team Midnight City 555 🚀

Built for **Google Solution Challenge 2026**

### Contributors

- Nivedh Ireni — Project Lead, Team Coordination & Strategy
- Ananya Darna — Backend Feature Development, Product Planning & Documentation
- Razia Begum — Full Stack Development / Core Implementation 
- Bobbala Gopinadh Yadav — Testing, Research & Quality Assurance


---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## ⭐ Support

If you find this project useful, please give it a **star ⭐** on GitHub — it means a lot to the team!