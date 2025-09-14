// api/index.js
// SEMUA LOGIKA BACKEND ADA DI SATU FILE INI
const admin = require('firebase-admin');
const fetch = require('node-fetch');

// ===================================================================
// ==                   KONFIGURASI WAJIB DIISI                     ==
// ===================================================================
const pterodactylConfig = {
  domain: "https://rofiksoleh.cloud-hosting.biz.id",
  apiKey: "ptla_REyLUYSXyLS6BE0Up3YSyd3fTV52mMQnjs07cFU0uDZ",
  eggId: "15",
  nestId: "5",
  locationId: "1"
};

// KUNCI RAHASIA FIREBASE-MU SUDAH GW MASUKKAN DI SINI
const serviceAccount = {
  "type": "service_account",
  "project_id": "web-gw-f63be",
  "private_key_id": "8cecd6628c745d2a298ffce7057a4ee3c6455723",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCtmF/E+F1Z3vtY\nAQUqlC9AKKHQAxnIe54Rrtc5y/MLYy64DZN7mXE0/Y37tjHSPuootzA9uyMdIQYQ\n+RD5PCkCk1k+W6iOnpCzyB6ok3cxJ+axtbj8gGv2rYGZIUnquaomTlkjxg5iPO9c\ngIVO0I3/zmBd1cqPATh2H+mjkoZDIIu6OUoedXy7n/Ka47ttZWKfAFfjB7FSUWLn\ng1QH3oZk+64PBxFMlWkNrYReoOIj62HAr08qMNan3fZlHImXiqCLJFdVhNAH/DIE\nLv+OLHJRq5SgihcF52qdmIU1PvjvulR7Zxsei/4pHwKcjPgfAwf6w9xafPfyAjhm\ng/bvJoKnAgMBAAECggEACHk6m4PAEsX2oNoT5XssP0Z8d4nfNVELazOMn+6bo3+o\n5SUMgOkBhKOnzZScI/YcOfaPLUQ4N5DIGgX+VRwhqFWG8qtItAV7bLsk+/eOxuB6\nu0vyhqjCHF1lyRK95+4+JvaGFV/yjcsJqAtB9pHpjIYHYC0yYP6fQezW27woP5h/\nfP9gSebpU2oY6wVLWObs8nm+rSH2loSogUcF31yvoJU+iZZhyG68I+EixuQ3FND0\n2RAMhz+qRRRQHtjNgE1kwXz1j/Y90HLpXZnOEGJDQ8eMzKQVuJItg+mY7qLy7kB/\nXhlQCqgvQ5lO2dq/nLEC0qBFYEcttyk3fGyzVoShKQKBgQDeu6c1BBQvAdSjGfKy\nAT3u/Vgl7zNJP3cAzRirqiR2zfYZZdNkWh9xEWhqISc1quFAeweEqJBhd1q1Z9XB\nMcNTsVeB2hW7w/0MrN8Xj/QDJCm7cEegffeSizStbulPlQis3/G1ME/ywm/qKUpd\nq2PsbaajD/elAp7zI3fj8RuQrQKBgQDHheddvlXXgLPWLSNsUVLq1i2VrGVvKEey\nDaaBH4CvDujXk0gNZF/++ny/VFzyaYL+nqbIj9sTGWs6+YV+myni6Do5XBRtwiNU\n/rX3Bcvy0MXnQfRUY0slSesY+fXTgumK6RvCSCogEJx+Y5t5ST0JLK0wSMu/Ggvp\nV4TFWcEHIwKBgHnlo1X9fHpZeyEkQ1GuIlIYbtSb+6p7xEo49OaGQFyQzb4Kn02N\nkSWVTFrA+C+D7LEYY/3zLslYw9kCEdcgv/Ce3vBfBYP0eBomxhWkH/xUH07I3Tp1\nljeqXdMJH0EBpHTQPv1VinumdA9oN53Z/d7YB9m4FGVHcOxKHgQu4VIlAoGAGH+h\nlAod4jMkYcTzF4a4xqr7t+gOIGLywrMYYbxrgZM0Fdw4uaQ8gUNic9+49e7srbTv\nR6saPDMfzoL62DvXHcxj8c0TmRKAYhxQXX9xtmPaGPYpOP9kJ7T2z/9JJuppIKxU\nwzs3KO7BOGeknHTYsLqynT4i/lkFY2ZioBTQNb8CgYAAiwGEAhzoPdeGYbcGGZ5K\ngci3E5xcFdhVOfY3Dc+V5N10WFWA2w+RJPacpjRKM8pXiwLQ5JY52Bk8O8qDwnpx\nENR4J9CuVWhJB3DfbTLzaKUnpYCgCQrGBl8DSf1K6yrQiTJptZgkn45eXqvdwbZb\ntKYYaxKp9HCgWJmT0tO4XA==\n-----END PRIVATE KEY-----\n".replace(/\\n/g, '\n'),
  "client_email": "firebase-adminsdk-fbsvc@web-gw-f63be.iam.gserviceaccount.com",
  "client_id": "100664801948515319555",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40web-gw-f63be.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};
// ===================================================================

// Inisialisasi Firebase Admin
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Firebase admin initialization error.', error);
  }
}

const db = admin.firestore();
const auth = admin.auth();

// --- ROUTER SEDERHANA ---
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Hanya metode POST yang diizinkan.' });
    }
    const { action } = req.body;
    try {
        if (action === 'create_panel') {
            await handleCreatePanel(req, res);
        } else if (action === 'get_all_users') {
            await handleGetAllUsers(req, res);
        } else if (action === 'set_user_state') {
            await handleSetUserState(req, res);
        } else {
            res.status(400).json({ message: 'Aksi tidak valid.' });
        }
    } catch (error) {
        console.error(`Error processing action '${action}':`, error);
        res.status(500).json({ message: error.message || "Terjadi error internal." });
    }
};

// --- HANDLER UNTUK SETIAP AKSI ---
async function handleCreatePanel(req, res) {
    const { domain, apiKey, eggId, locationId } = pterodactylConfig;
    const { username, password, serverName, ram } = req.body;
    if (!username || !password || !ram) {
        return res.status(400).json({ message: 'Username Pterodactyl, password, dan RAM wajib diisi.' });
    }
    const finalServerName = serverName || username;
    const userResponse = await fetch(`${domain}/api/application/users`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: `${username}@${domain.replace(/^https?:\/\//, '')}`, username, first_name: username, last_name: 'User', password }),
    });
    const userData = await userResponse.json();
    if (!userResponse.ok) throw new Error(userData.errors ? userData.errors[0].detail : 'Gagal membuat user Ptero.');
    const userId = userData.attributes.id;
    const { ram: memory, disk, cpu } = getServerResources(ram);
    const serverResponse = await fetch(`${domain}/api/application/servers`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
            name: finalServerName, user: userId, egg: parseInt(eggId),
            docker_image: "ghcr.io/parkervcp/yolks:nodejs_18",
            startup: "if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == \"1\" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; if [[ ! -z ${CUSTOM_ENVIRONMENT_VARIABLES} ]]; then vars=$(echo ${CUSTOM_ENVIRONMENT_VARIABLES} | tr \";\" \"\\n\"); for line in $vars; do export $line; done fi; /usr/local/bin/${CMD_RUN};",
            environment: { "CMD_RUN": "npm start" },
            limits: { memory, swap: 0, disk, io: 500, cpu },
            feature_limits: { databases: 5, allocations: 1, backups: 5 },
            deploy: { locations: [parseInt(locationId)], dedicated_ip: false, port_range: [] },
        }),
    });
    const serverData = await serverResponse.json();
    if (!serverResponse.ok) {
        await fetch(`${domain}/api/application/users/${userId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${apiKey}` } });
        throw new Error(serverData.errors ? serverData.errors[0].detail : 'Gagal membuat server Ptero.');
    }
    res.status(200).json({ message: 'Panel berhasil dibuat!', loginUrl: domain, username, password });
}

async function handleGetAllUsers(req, res) {
    await verifyTokenAndGetRole(req, 'owner');
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        delete data.email;
        return { id: doc.id, ...data };
    });
    res.status(200).json(users);
}

async function handleSetUserState(req, res) {
    await verifyTokenAndGetRole(req, 'owner');
    const { username, role, banned } = req.body;
    if (!username) return res.status(400).json({ message: 'Username is required.' });
    const usersRef = db.collection('users');
    const q = usersRef.where('username', '==', username.toLowerCase());
    const querySnapshot = await q.get();
    if (querySnapshot.empty) return res.status(404).json({ message: `User '${username}' not found.` });
    const userDoc = querySnapshot.docs[0];
    const updateData = {};
    if (role !== undefined) updateData.role = role;
    if (banned !== undefined) {
        updateData.banned = banned;
        await auth.updateUser(userDoc.id, { disabled: banned });
    }
    if (Object.keys(updateData).length > 0) {
        await userDoc.ref.update(updateData);
    }
    res.status(200).json({ message: `User ${username} has been updated successfully.` });
}

// --- FUNGSI BANTUAN ---
async function verifyTokenAndGetRole(req, requiredRole) {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) throw new Error('Unauthorized');
    const idToken = authorization.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists) throw new Error('User not found.');
    const userData = userDoc.data();
    if (userData.banned) throw new Error('User is banned.');
    const roles = ['user', 'reseller', 'owner'];
    if (roles.indexOf(userData.role) < roles.indexOf(requiredRole)) {
        throw new Error('Insufficient permissions.');
    }
    return userData;
}

function getServerResources(ramSelection) {
    const resources = { ram: 0, disk: 0, cpu: 0 };
    switch (ramSelection) {
        case "1gb": resources.ram = 1024; resources.disk = 3072; resources.cpu = 40; break;
        case "2gb": resources.ram = 2048; resources.disk = 5120; resources.cpu = 60; break;
        case "3gb": resources.ram = 3072; resources.disk = 7168; resources.cpu = 80; break;
        case "4gb": resources.ram = 4096; resources.disk = 8192; resources.cpu = 100; break;
        case "5gb": resources.ram = 5120; resources.disk = 10240; resources.cpu = 120; break;
        case "6gb": resources.ram = 6144; resources.disk = 11264; resources.cpu = 140; break;
        case "7gb": resources.ram = 7168; resources.disk = 12288; resources.cpu = 160; break;
        case "8gb": resources.ram = 8192; resources.disk = 13312; resources.cpu = 180; break;
        case "9gb": resources.ram = 9216; resources.disk = 14336; resources.cpu = 200; break;
        case "10gb": resources.ram = 10240; resources.disk = 15360; resources.cpu = 220; break;
        case "unlimited": resources.ram = 0; resources.disk = 0; resources.cpu = 0; break;
        default: throw new Error("Pilihan RAM tidak valid.");
    }
    return resources;
}
