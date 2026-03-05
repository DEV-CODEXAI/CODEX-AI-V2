
const { getByCategory, getAll } = require('../../Plugin/crysCmd');
const { getVar } = require('../../Plugin/configManager');
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const os = require("os");

module.exports = {
    name: 'uptime',
    alias: ['up'],
    desc: 'Show bot uptime with stylish format',
    category: 'info',
    reactions: {
        start: '📡',
        success: '🐾'
    },

    execute: async (sock, m, { prefix, config, reply }) => {
        const secondsTotal = Math.floor(process.uptime());
        const days = Math.floor(secondsTotal / 86400);
        const hours = Math.floor((secondsTotal % 86400) / 3600);
        const minutes = Math.floor((secondsTotal % 3600) / 60);
        const seconds = secondsTotal % 60;
        
        const uptimeString = `${days}d-${hours}h-${minutes}m-${seconds}s`;

        const now = new Date();
        now.setHours(now.getHours() + 1); 
        const time = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).toLowerCase();

        const botName = getVar('botName', config.settings?.title || 'CODEX AI');

        let responseText = `╔═══〔 ❍ *${botName.toUpperCase()}* ❍ 〕══❒\n`;
        responseText += `║╭───────────────◆\n`;
        responseText += `║│ ❍ *UPTIME:* `${uptimeString}`\n`;
        responseText += `║│ ❍ *STATUS:* 🚀Online\n`;
        responseText += `║╰───────────────◆\n`;
        responseText += `╚══════════════════❒\n`;
        responseText += ` ╰─ 🥏 \`\`\`${time}\`\`\``;

        await reply(responseText);
    }
};


          
