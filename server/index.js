require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { shipments, disruptions, generateRandomUpdate } = require('./data/mockData');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

let db = null;
try {
  db = require('./firebaseAdmin');
  if (db) console.log('🔥 Firebase connected');
} catch (e) {
  console.warn('⚠️  Firebase not configured, using in-memory mock data');
}

async function getShipments() {
  if (!db) return shipments;
  try {
    const snap = await db.ref('shipments').get();
    return snap.exists() ? Object.values(snap.val()) : shipments;
  } catch (e) { return shipments; }
}

async function getDisruptions() {
  if (!db) return disruptions;
  try {
    const snap = await db.ref('disruptions').get();
    return snap.exists() ? Object.values(snap.val()) : disruptions;
  } catch (e) { return disruptions; }
}


app.get('/api/shipments', async (req, res) => {
  const data = await getShipments();
  res.json({ success: true, data });
});

app.get('/api/shipments/:id', async (req, res) => {
  const data = await getShipments();
  const shipment = data.find(s => s.id === req.params.id);
  if (!shipment) return res.status(404).json({ success: false, message: 'Shipment not found' });
  res.json({ success: true, data: shipment });
});

app.get('/api/disruptions', async (req, res) => {
  const data = await getDisruptions();
  res.json({ success: true, data });
});

app.get('/api/stats', async (req, res) => {
  const [shipmentsData, disruptionsData] = await Promise.all([getShipments(), getDisruptions()]);
  const total = shipmentsData.length;
  const delayed = shipmentsData.filter(s => s.status === 'delayed').length;
  const inTransit = shipmentsData.filter(s => s.status === 'in_transit').length;
  const onTime = shipmentsData.filter(s => s.status === 'on_time').length;
  const avgRisk = Math.round(shipmentsData.reduce((a, b) => a + b.riskScore, 0) / total);
  const activeDisruptions = disruptionsData.filter(d => d.status === 'active').length;
  res.json({ success: true, data: { total, delayed, inTransit, onTime, avgRisk, activeDisruptions } });
});

app.post('/api/reroute/:id', async (req, res) => {
  const data = await getShipments();
  const shipment = data.find(s => s.id === req.params.id);
  if (!shipment) return res.status(404).json({ success: false, message: 'Not found' });

  if (process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are a logistics AI for disaster relief. A shipment "${shipment.name}" from ${shipment.origin.city} to ${shipment.destination.city} is ${shipment.status} with risk score ${shipment.riskScore}/100.\nSuggest 3 alternate routes with estimated time and cost impact. Format as JSON array:\n[{"route": "Route name", "via": "Via cities", "timeImpact": "+2 hours", "costImpact": "+5%", "riskReduction": "40%", "reason": "Why this is better"}]\nReturn ONLY the JSON array, no other text.`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleaned = text.replace(/```json|```/g, '').trim();
      const routes = JSON.parse(cleaned);
      return res.json({ success: true, data: routes, source: 'gemini' });
    } catch (err) {
      console.error('Gemini error:', err.message);
    }
  }

  const mockRoutes = [
    { route: `${shipment.origin.city} → Pune → ${shipment.destination.city}`, via: 'NH-48 via Pune bypass', timeImpact: '+1.5 hours', costImpact: '+3%', riskReduction: '55%', reason: 'Avoids flooded NH-44 corridor, highway in good condition' },
    { route: `${shipment.origin.city} → Nashik → ${shipment.destination.city}`, via: 'NH-160 via Nashik', timeImpact: '+3 hours', costImpact: '+7%', riskReduction: '72%', reason: 'Longer but fully clear of disruption zones, best safety score' },
    { route: `Air freight ${shipment.origin.city} → ${shipment.destination.city}`, via: 'Direct air cargo', timeImpact: '-4 hours', costImpact: '+45%', riskReduction: '95%', reason: 'Fastest option for critical medical supplies during emergency' }
  ];
  res.json({ success: true, data: mockRoutes, source: 'mock' });
});

app.post('/api/cascade/:id', async (req, res) => {
  const data = await getShipments();
  const shipment = data.find(s => s.id === req.params.id);
  if (!shipment) return res.status(404).json({ success: false });

  const cascadeChain = [];
  const visited = new Set([shipment.id]);
  const queue = [{ shipment, depth: 0 }];

  while (queue.length > 0) {
    const { shipment: current, depth } = queue.shift();
    if (depth > 3) continue;
    (current.affectedNodes || []).forEach(nodeId => {
      if (!visited.has(nodeId)) {
        visited.add(nodeId);
        const affected = data.find(s => s.id === nodeId);
        if (affected) {
          cascadeChain.push({ from: current.id, to: affected.id, shipment: affected, depth: depth + 1, estimatedDelay: `+${(depth + 1) * 2}-${(depth + 1) * 4} hours` });
          queue.push({ shipment: affected, depth: depth + 1 });
        }
      }
    });
  }

  res.json({ success: true, data: { root: shipment, cascadeChain, totalAffected: cascadeChain.length, totalDelayHours: cascadeChain.reduce((a, b) => a + (b.depth * 2), 0) } });
});


io.on('connection', async (socket) => {
  console.log('🔌 Client connected:', socket.id);
  const [shipmentsData, disruptionsData] = await Promise.all([getShipments(), getDisruptions()]);
  socket.emit('initial_data', { shipments: shipmentsData, disruptions: disruptionsData });
  socket.on('disconnect', () => console.log('❌ Client disconnected:', socket.id));
});

// Live updates every 4 seconds — write to Firebase AND emit via socket
setInterval(async () => {
  const update = generateRandomUpdate();
  const { shipment } = update;
  if (db) {
    try {
      await db.ref(`shipments/${shipment.id}`).update({
        riskScore: shipment.riskScore,
        currentLocation: shipment.currentLocation,
        updatedAt: Date.now()
      });
    } catch (e) {}
  }
  io.emit('shipment_update', update);
}, 4000);

setInterval(async () => {
  const types = ['weather', 'traffic', 'operational'];
  const locations = ['NH-44', 'Mumbai Port', 'Delhi Hub', 'Hyderabad Ring Road'];
  const messages = ['Heavy rainfall detected - potential road blockage', 'Traffic congestion - 2 hour delay expected', 'Route risk score increased to critical level', 'Weather forecast updated - disruption likely in 6 hours'];
  const alert = {
    id: `LIVE_${Date.now()}`,
    type: types[Math.floor(Math.random() * types.length)],
    severity: Math.random() > 0.5 ? 'high' : 'medium',
    location: locations[Math.floor(Math.random() * locations.length)],
    description: messages[Math.floor(Math.random() * messages.length)],
    timestamp: new Date().toISOString()
  };
  if (db) { try { await db.ref(`liveAlerts/${alert.id}`).set(alert); } catch (e) {} }
  io.emit('disruption_alert', alert);
}, 15000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 NEXUS Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io ready`);
  console.log(`🔑 Gemini API: ${process.env.GEMINI_API_KEY ? 'Connected ✅' : 'Not configured (using mock) ⚠️'}`);
  console.log(`🔥 Firebase: ${db ? 'Connected ✅' : 'Not configured (using mock) ⚠️'}\n`);
});
