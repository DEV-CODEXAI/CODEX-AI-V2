
// © 2026 CODEX AI - Multi-Bot System
module.exports = {
    name: 'creator',
    alias: ['test', 'ping', 'update', 'alive'],
    desc: 'Test command for bot status and details',
    category: 'Owner',
    usage: '.creator',
    ownerOnly: true,
    reactions: {
        start: '🐾',
        success: '💫'
    },

    execute: async (sock, m, { reply, prefix, botNumber, pushName }) => {
        try {
            const botName = sock.user.name || 'CODEX Bot';
            const currentPrefix = prefix || '.';
            const triggerUser = pushName || 'User';

            let response = `╔❍**CODEX-SYSTEM**❍═❒\n`;
            response += `║╭───────────────◆\n`;
            response += `║│ 🤖 **Bot:** ${botName}\n`;
            response += `║│ 亗 **Number:** ${botNumber.split('@')[0]}\n`;
            response += `║│ ✯ **Prefix:** ${currentPrefix}\n`;
            response += `║│ 🚀 **Status:** Online\n`;
            response += `║│ 🪄 **Command:** ${currentPrefix}creator\n`;
            response += `║│ ✦ **User:** ${triggerUser}\n`;
            response += `║╰───────────────◆\n`;
            response += `╚══════════════════❒\n`;
            response += ` ╰─ 🥏 \`\`\`CODEX AI\`\`\``;

            await reply(response);

        } catch (err) {
            console.error('[CREATOR ERROR]', err);
            await reply(`✦ **CODEX AI**\n✘ Error executing creator command.`);
        }
    }
};


