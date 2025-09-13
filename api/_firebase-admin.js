// api/_firebase-admin.js
import admin from 'firebase-admin';

// Inisialisasi Firebase Admin hanya sekali
if (!admin.apps.length) {
  try {
    // Kunci ini dibaca dari Vercel Environment Variable
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

const db = admin.firestore();
const auth = admin.auth();

// Fungsi untuk memverifikasi token dan role user
export async function verifyUser(req, requiredRole = 'user') {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new Error('Unauthorized: No token provided.');
    }
    const idToken = authorization.split('Bearer ')[1];
    
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
        throw new Error('User not found in Firestore.');
    }
    
    const userData = userDoc.data();
    
    if (userData.banned) {
        throw new Error('User is banned.');
    }

    const userRole = userData.role || 'user';
    const roles = ['user', 'reseller', 'owner'];
    
    if (roles.indexOf(userRole) < roles.indexOf(requiredRole)) {
        throw new Error('Insufficient permissions.');
    }

    return { uid, userDoc, userData };
}

export { db, auth };
