
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
        const repoLink = config.repo || (config.settings && config.settings.repo) || 'https://github.com/DEV-CODEXAI/CODEX-AI-V2';
        const botTitle = (config.settings && config.settings.title) || 'CODEX AI';

        const infoMessage = `╔═══〔 ❍ **CODEX V2.0** ❍ 〕═══❒\n` +
            `║╭───────────────◆\n` +
            `║│ 🤖 **Bot:** ${botTitle}\n` +
            `║│ 👑 **Owner:** ✦ **CODEX**\n` +
            `║│ ⚡ **Version:** 2.0.0\n` +
            `║│ 🌐 **Library:** Baileys\n` +
            `║│ 📦 **CMDS:** crysnovax styles\n` +
            `║│ 🔗 **Connection:** **CODEX** official V1.0\n` +
            `║╰───────────────◆\n` +
            `╚══════════════════❒\n\n` +
            `📢 **Channel:** https:whatsapp.com/channel/0029Vb6sMEy96H4VI2w3I50F\n` +
            `🐙 **GitHub:** ${repoLink}`;

        await reply(infoMessage);
    }
};


