
const fs = require('fs');
const path = require('path');

const MUTE_FILE = path.join(__dirname,'../../database/mutedUsers.json');

const getMutedDb = () => {
    try { return JSON.parse(fs.readFileSync(MUTE_FILE,'utf8')); } catch { return {}; }
};

const saveMutedDb = data => {
    fs.writeFileSync(MUTE_FILE,JSON.stringify(data,null,2));
};

const parseTime = str => {
    const match = str?.match(/^(\d+)(s|m|h|d|w|mo)$/i);
    if(!match) return null;
    const num = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    const map = { s:1000, m:60000, h:3600000, d:86400000, w:604800000, mo:2592000000 };
    return num * map[unit];
};

module.exports = {
    name: 'unmuteuser',
    alias: ['unmute', 'speak'],
    category: 'Group',
    desc: 'Unmute a user immediately or after a delay',

    execute: async (sock, m, { args, prefix, reply, isGroup, isAdmin, mentionedJid }) => {
        if (!isGroup) return reply('✘ _*This command works only in groups*_');
        if (!isAdmin) return reply('✘ _*Only admins can use this command*_');

        const db = getMutedDb();
        const chatId = m.chat;

        let targetJid = null;
        if (mentionedJid?.length) targetJid = mentionedJid[0];
        else if (m.quoted?.sender) targetJid = m.quoted.sender;
        else {
            const match = (m.text || '').match(/@(\d+)/);
            if (match) targetJid = match[1] + '@s.whatsapp.net';
        }
        if (!targetJid && /^\d+$/.test(args[0])) targetJid = args[0] + '@s.whatsapp.net';

        if (!targetJid) return reply(`*❍ CODEX UNMUTE* ❍\n\n_Specify user._\n*Example:* ${prefix}unmute @user\n*Timed:* ${prefix}unmute @user 10m`);

        // Check if user is even muted
        if (!db[chatId] || !db[chatId][targetJid]) {
            return reply(`✘ @${targetJid.split('@')[0]} is not currently muted.`);
        }

        // --- TIME LOGIC ---
        const timeArg = args.find(a => /^\d+(s|m|h|d|w|mo)$/i.test(a));
        const delayMs = timeArg ? parseTime(timeArg) : null;

        if (delayMs) {
            // Schedule future unmute
            const newUntil = Date.now() + delayMs;
            db[chatId][targetJid].until = newUntil;
            saveMutedDb(db);

            await reply(`❍ *CODEX SCHEDULED UNMUTE* ❍\n\n✓ @${targetJid.split('@')[0]} will be unmuted in *${timeArg}*.\n\n© *CODEX AI SYSTEM*`);

            setTimeout(async () => {
                const currentDb = getMutedDb();
                if (currentDb[chatId]?.[targetJid]) {
                    delete currentDb[chatId][targetJid];
                    saveMutedDb(currentDb);
                    await sock.sendMessage(chatId, { text: `🔊 @${targetJid.split('@')[0]} unmuted (Scheduled)`, mentions: [targetJid] });
                }
            }, delayMs);

        } else {
            // Immediate Unmute
            delete db[chatId][targetJid];
            saveMutedDb(db);

            await sock.sendMessage(chatId, {
                text: `❍ *USER UNMUTED* ❍\n\n✓ @${targetJid.split('@')[0]} has been unmuted immediately.\n\n© *CODEX AI SYSTEM*`,
                mentions: [targetJid]
            }, { quoted: m });
        }
    }
};




