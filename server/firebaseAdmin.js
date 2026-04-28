const admin = require('firebase-admin');

// For Railway deployment: store the entire serviceAccountKey JSON as an env var string
// Locally: use the serviceAccountKey.json file
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  try {
    serviceAccount = require('./serviceAccountKey.json');
  } catch (e) {
    console.warn('⚠️  No Firebase service account found. Firebase features disabled.');
    module.exports = null;
    return;
  }
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DB_URL
  });
}

const db = admin.database();
module.exports = db;
