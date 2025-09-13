// api/admin/setUserState.js
import { db, auth, verifyUser } from '../_firebase-admin.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    try {
        await verifyUser(req, 'owner'); // Hanya owner yang bisa akses

        const { username, role, banned } = req.body;
        if (!username) {
            return res.status(400).json({ message: 'Username is required.' });
        }

        const usersRef = db.collection('users');
        const q = usersRef.where('username', '==', username.toLowerCase());
        const querySnapshot = await usersRef.where('username', '==', username.toLowerCase()).get();

        if (querySnapshot.empty) {
            return res.status(404).json({ message: `User '${username}' not found.` });
        }
        
        const userDoc = querySnapshot.docs[0];
        const updateData = {};
        if (role !== undefined) updateData.role = role;
        if (banned !== undefined) updateData.banned = banned;
        
        // Jika user di-ban, disable juga akun Auth-nya
        if (banned === true) {
            await auth.updateUser(userDoc.id, { disabled: true });
        } else if (banned === false) {
            await auth.updateUser(userDoc.id, { disabled: false });
        }

        await userDoc.ref.update(updateData);
        
        res.status(200).json({ message: `User ${username} has been updated successfully.` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
