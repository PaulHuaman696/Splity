const admin = require('firebase-admin');

// Aquí es donde debes colocar la ruta al archivo JSON descargado
const serviceAccount = require('./firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
