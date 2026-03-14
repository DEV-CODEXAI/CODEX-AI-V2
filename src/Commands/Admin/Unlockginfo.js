module.exports = {
    name: 'unlock',
    alias: ['unlockset', 'uset'],
    category: 'admin',
    desc: 'All members can edit group settings',
    usage: '.unlocksettings',

    execute: async (sock, m, { reply }) => {
        if (!m.isGroup) return reply('✘ Group only');
        
        const metadata = await sock.groupMetadata(m.chat);
        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const isBotAdmin = metadata.participants.find(p => p.id === botId)?.admin !== null;
        
        if (!isBotAdmin) return reply('✘ *CODEX ERROR:* I require *Admin* rights to change settings.');

        try {
            // Protocol: 'unlocked' allows everyone to edit info
            await sock.groupSettingUpdate(m.chat, 'unlocked');
            const userName = m.pushName || "Admin";

            let res = `*❍ CODEX SETTINGS OPEN* ❍\n\n`;
            res += `🔓 *INFO EDIT:* EVERYONE\n`;
            res += `_All members can now change group name and icon._\n\n`;
            res += `© *CODEX AI SYSTEM*\n`;
            res += `_Opened by ${userName}_`;
            
            await reply(res);
        } catch (err) {
            reply('✘ *CODEX ERROR:* Failed to unlock group settings.');
        }
    }
};
