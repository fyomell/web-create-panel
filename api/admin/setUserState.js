// api/admin/setUserState.js
const { db, auth, verifyUser } = require('../_firebase-admin.js');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    try {
        await verifyUser(req, 'owner');
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
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};