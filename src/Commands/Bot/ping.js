
const { getByCategory, getAll } = require('../../Plugin/crysCmd');
const { getVar } = require('../../Plugin/configManager');
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const os = require("os");

module.exports = {
    name: 'ping',
    alias: ['speed', 'test', 'latency'],
    desc: 'Check bot response speed',
    category: 'Bot',
    reactions: {
        start: '♻️',
        success: '🪄'
    },

    execute: async (sock, m, { prefix, config, reply }) => {
        const startTime = Date.now();

        await sock.sendPresenceUpdate('composing', m.key.remoteJid);

        const initialMsg = await sock.sendMessage(m.key.remoteJid, { text: '🚀 _*PINGING...*_' }, { quoted: m });

        const latency = Date.now() - startTime;
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: 'Africa/Lagos'
        }).toLowerCase();

        let responseText = `╔═══〔 ❍ *PONG!* ❍ 〕══❒\n`;
        responseText += `║╭───────────────◆\n`;
        responseText += `║│ ❍ *LATENCY:* ${latency}ms\n`;
        responseText += `║│ ❍ *STATUS:* Online\n`;
        responseText += `║╰───────────────◆\n`;
        responseText += `╚══════════════════❒\n`;
        responseText += ` ╰─ 🥏 \`\`\`${time}\`\`\``;

        await sock.sendMessage(m.key.remoteJid, { 
            text: responseText, 
            edit: initialMsg.key 
        });

        await sock.sendPresenceUpdate('available', m.key.remoteJid);
    }
};


