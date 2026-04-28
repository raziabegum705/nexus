// Run once to seed Firebase: node seedFirebase.js
require('dotenv').config();
const db = require('./firebaseAdmin');
const { shipments, disruptions, nodes } = require('./data/mockData');

if (!db) {
  console.error('Firebase not configured. Set FIREBASE_SERVICE_ACCOUNT and FIREBASE_DB_URL in .env');
  process.exit(1);
}

async function seed() {
  console.log('🌱 Seeding Firebase...');

  // Convert arrays to objects keyed by id
  const shipmentsObj = shipments.reduce((acc, s) => ({ ...acc, [s.id]: s }), {});
  const disruptionsObj = disruptions.reduce((acc, d) => ({ ...acc, [d.id]: d }), {});
  const nodesObj = nodes.reduce((acc, n) => ({ ...acc, [n.id]: n }), {});

  await db.ref('shipments').set(shipmentsObj);
  console.log(`✅ Seeded ${shipments.length} shipments`);

  await db.ref('disruptions').set(disruptionsObj);
  console.log(`✅ Seeded ${disruptions.length} disruptions`);

  await db.ref('nodes').set(nodesObj);
  console.log(`✅ Seeded ${nodes.length} nodes`);

  console.log('\n🎉 Firebase seeded successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
