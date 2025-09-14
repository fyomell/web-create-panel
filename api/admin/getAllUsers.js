// api/admin/getAllUsers.js
import { db, verifyUser } from '../_firebase-admin.js';

export default async function handler(req, res) {
    try {
        await verifyUser(req, 'owner'); // Hanya owner yang bisa akses
        
        const usersSnapshot = await db.collection('users').get();
        const users = usersSnapshot.docs.map(doc => {
            const data = doc.data();
            delete data.email; 
            return { id: doc.id, ...data };
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
}
