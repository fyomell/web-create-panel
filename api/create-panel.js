// api/create-panel.js
const config = require('../config.js');
const fetch = require('node-fetch');

function getServerResources(ramSelection) {
    const resources = { ram: 0, disk: 0, cpu: 0 };
    switch (ramSelection) {
        case "1gb": resources.ram = 1024; resources.disk = 3072; resources.cpu = 40; break;
        case "2gb": resources.ram = 2048; resources.disk = 5120; resources.cpu = 60; break;
        case "3gb": resources.ram = 3072; resources.disk = 7168; resources.cpu = 80; break;
        case "4gb": resources.ram = 4096; resources.disk = 8192; resources.cpu = 100; break;
        case "5gb": resources.ram = 5120; resources.disk = 10240; resources.cpu = 120; break;
        case "10gb": resources.ram = 10240; resources.disk = 15360; resources.cpu = 220; break;
        case "unlimited": resources.ram = 0; resources.disk = 0; resources.cpu = 0; break;
        default: throw new Error("Pilihan RAM tidak valid.");
    }
    return resources;
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const { domain, apiKey, eggId, nestId, locationId } = config;
    const { username, password, serverName, ram } = req.body;

    if (!username || !password || !ram) {
        return res.status(400).json({ message: 'Username, password, dan RAM wajib diisi.' });
    }

    try {
        const finalServerName = serverName || username;
        const userResponse = await fetch(`${domain}/api/application/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Accept': 'application/json',
            },
            body: JSON.stringify({
                email: `${username}@${domain.replace(/^https?:\/\//, '')}`,
                username: username, first_name: username, last_name: 'User', password: password,
            }),
        });

        const userData = await userResponse.json();
        if (!userResponse.ok) throw new Error(userData.errors ? userData.errors[0].detail : 'Gagal membuat user Ptero.');
        
        const userId = userData.attributes.id;
        const { ram: memory, disk, cpu } = getServerResources(ram);

        const serverResponse = await fetch(`${domain}/api/application/servers`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Accept': 'application/json',
            },
            body: JSON.stringify({
                name: finalServerName,
                user: userId,
                nest: parseInt(nestId), // Nest ID penting
                egg: parseInt(eggId),
                docker_image: "ghcr.io/parkervcp/yolks:nodejs_18",
                startup: "if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == \"1\" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then /usr/local/bin/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then /usr/local/bin/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f /home/container/package.json ]; then /usr/local/bin/npm install; fi; if [[ ! -z ${CUSTOM_ENVIRONMENT_VARIABLES} ]]; then vars=$(echo ${CUSTOM_ENVIRONMENT_VARIABLES} | tr \";\" \"\\n\"); for line in $vars; do export $line; done fi; /usr/local/bin/${CMD_RUN};",
                // INI BAGIAN YANG DIBENERIN
                environment: {
                    "CMD_RUN": "npm start"
                },
                limits: { memory, swap: 0, disk, io: 500, cpu },
                feature_limits: { databases: 1, allocations: 1, backups: 1 },
                deploy: { locations: [parseInt(locationId)], dedicated_ip: false, port_range: [] },
            }),
        });
        const serverData = await serverResponse.json();
        if (!serverResponse.ok) {
            await fetch(`${domain}/api/application/users/${userId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${apiKey}` } });
            throw new Error(serverData.errors ? serverData.errors[0].detail : 'Gagal membuat server Ptero.');
        }
        
        res.status(200).json({
            message: 'Panel berhasil dibuat!', loginUrl: domain, username, password,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};