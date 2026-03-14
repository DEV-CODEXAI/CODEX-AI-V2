module.exports = {
    name: 'lock',
    alias: ['locksettings', 'lset'],
    category: 'admin',
    desc: 'Only admins can edit group settings',
    usage: '.locksettings',

    execute: async (sock, m, { reply }) => {
        if (!m.isGroup) return reply('✘ Group only');
        
        const metadata = await sock.groupMetadata(m.chat);
        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const isBotAdmin = metadata.participants.find(p => p.id === botId)?.admin !== null;
        
        if (!isBotAdmin) return reply('✘ *CODEX ERROR:* I require *Admin* rights to change settings.');

        try {
            // Protocol: 'locked' restricts info editing to admins
            await sock.groupSettingUpdate(m.chat, 'locked');
            const userName = m.pushName || "Admin";

            let res = `*❍ CODEX SETTINGS LOCK* ❍\n\n`;
            res += `🛡️ *INFO EDIT:* ADMIN ONLY\n`;
            res += `_Group name, icon, and description can now only be modified by admins._\n\n`;
            res += `© *CODEX AI SYSTEM*\n`;
            res += `_Locked by ${userName}_`;
            
            await reply(res);
        } catch (err) {
            reply('✘ *CODEX ERROR:* Failed to lock group settings.');
        }
    }
};
