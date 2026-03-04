
module.exports = {
    name: 'alive',
    alias: ['online', 'status'],
    desc: 'Check if bot is alive',
    category: 'Bot',
    execute: async (sock, m, { reply }) => {
        const up = Math.floor((Date.now() - global.crysStats.startTime) / 1000);
        const h  = Math.floor(up / 3600);
        const mn = Math.floor((up % 3600) / 60);
        const s  = up % 60;

        let statusText = `╔═══〔 ❍ *CODEX AI* ❍ 〕══❒\n`;
        statusText += `║╭───────────────◆\n`;
        statusText += `║│ ❍ *STATUS:* Online\n`;
        statusText += `║│ ❍ *UPTIME:* ${h}h ${mn}m ${s}s\n`;
        statusText += `║│ ❍ *MSGS:* ${global.crysStats.messages}\n`;
        statusText += `║│ ❍ *CMDS:* ${global.crysStats.commands}\n`;
        statusText += `║│ ❍ *VER:* 2.0.0\n`;
        statusText += `║╰───────────────◆\n`;
        statusText += `╚══════════════════❒\n\n`;
        statusText += `*CRYSNOVA AI V2 - Professional*`;

        await reply(statusText);
    }
};




