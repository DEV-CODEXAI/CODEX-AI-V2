module.exports = {
    name: 'tagadmin',
    alias: ['admins', 'admin'],
    category: 'group',
    desc: 'Tag all group admins',
    usage: '.tagadmin <message>',
    reactions: {
        start: '💫',
        success: '🌟'
    },

    execute: async (sock, m, { args, reply }) => {

        if (!m.isGroup) return reply('✘ This command works only in groups');

        const metadata = await sock.groupMetadata(m.chat);
        const admins = metadata.participants
            .filter(p => p.admin !== null)
            .map(p => p.id);

        const userName = m.pushName || "User";
        const text = args.join(' ') || '📢 Attention required';

        // --- CODEX STYLE OUTPUT ---
        let message = `❍ *CODEX ADMIN SUMMON* ❍\n\n`;
        message += `*Message:* ${text}\n\n`;

        for (let admin of admins) {
            message += `➤ @${admin.split('@')[0]}\n`;
        }

        message += `\n© *CODEX AI SYSTEM*\n`;
        message += `_Summoned by ${userName}_`;

        await sock.sendMessage(
            m.chat,
            {
                text: message,
                mentions: admins
            },
            { quoted: m }
        );
    }
};
