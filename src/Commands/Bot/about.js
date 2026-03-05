
module.exports = {
    name: 'about',
    alias: ['info', 'Bot'],
    desc: 'About this bot',
    category: 'about',
    reactions: {
        start: '💬',
        success: '✨'
    },
    execute: async (sock, m, { reply, config }) => {
        const infoMessage = `╔═══〔 ❍ *CODEX V2.0* ❍ 〕═══❒\n` +
            `║╭───────────────◆\n` +
            `║│ 🤖 *Bot:* ${config.settings.title}\n` +
            `║│ 👑 *Owner:* ✦ 𝗖𝗢𝗗𝗘𝗫\n` +
            `║│ ⚡ *Version:* 2.0.0\n` +
            `║│ 🌐 *Library:* Baileys\n` +
            `║│ 📦 *CMDS:* crysnovax styles\n` +
            `║│ 🔗 *Connection:* 𝗖𝗢𝗗𝗘𝗫 𝐨𝐟𝐟𝐢𝐜𝐢𝐚𝐥 V1.0\n` +
            `║╰───────────────◆\n` +
            `╚══════════════════❒\n\n` +
            `📢 Channel: https://whatsapp.com/channel/0029Vb6sMEy96H4VI2w3I50F\n` +
            `🐙 GitHub: ${config.settings.repo}`;

        await reply(infoMessage);
    }
};


