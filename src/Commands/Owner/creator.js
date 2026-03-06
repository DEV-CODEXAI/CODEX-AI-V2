
// © 2026 CODEX AI - Multi-Bot System
module.exports = {
    name: 'creator',
    alias: ['test', 'ping', 'update', 'alive'],
    desc: 'Test command that works across all bots with their own prefixes',
    category: 'Owner',
    usage: '.creator',
    ownerOnly: true,
    reactions: {
        start: '🐾',
        success: '💫'
    },

    execute: async (sock, m, { reply, prefix, botNumber, pushName }) => {
        try {
            const botName = sock.user.name || '𝘾𝞗𝘿𝞢𝙓 *BOT*';
            const currentPrefix = prefix || '.';
            const triggerUser = pushName || '𝙐𝙨𝙚𝙧';

            const response = `╔═══〔 ❍ 𝙈𝙐𝙇𝙏𝙄-𝘽𝞗𝙏 𝙎𝙔𝙎𝙏𝞢𝙈 ❍ 〕═❒
║╭───────────────◆
║│ 🥏 𝘽𝙤𝙩: *${botName}*
║│ ✯ 𝙋𝙧𝙚𝙛𝙞𝙭: *${currentPrefix}*
║│ 🚀 𝙎𝙩𝙖𝙩𝙪𝙨: ✓ 𝞗𝙣𝙡𝙞𝙣𝙚 
║| 💨 𝙉𝙪𝙢𝙗𝙚𝙧: *Default bot number*
║│ 💫 *CODEX*:  *ACTIVE*✓✓
║│ 🪄 𝘾𝙤𝙢𝙢𝙖𝙣𝙙: *${currentPrefix}𝙘𝙧𝙚𝙖𝙩𝙤𝙧*
║│ ✦ 𝙏𝙧𝙞𝙜𝙜𝙚𝙧𝙚𝙙 𝙗𝙮: ${triggerUser}
║╰───────────────◆
╚══════════════════❒
 ╰─ 🥏 \`\`\`𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\`\`\``;

            await reply(response);

        } catch (err) {
            console.error('[CREATOR ERROR]', err);
            
            await reply(`✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n✘ 𝙀𝙧𝙧𝙤𝙧 𝙚𝙭𝙚𝙘𝙪𝙩𝙞𝙣𝙜 𝙘𝙧𝙚𝙖𝙩𝙤𝙧 𝙘𝙤𝙢𝙢𝙖𝙣𝙙.`);
        }
    }
};

