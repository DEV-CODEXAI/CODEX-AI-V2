const fs = require('fs');
const path = require('path');

const WARN_FILE = path.join(__dirname, '../../../database/warns.json');

let warns = {};

try {
    if (fs.existsSync(WARN_FILE)) {
        warns = JSON.parse(fs.readFileSync(WARN_FILE, 'utf8'));
    }
} catch (e) {
    console.error('[WARN LOAD]', e.message);
}

function saveWarns() {
    try {
        fs.writeFileSync(WARN_FILE, JSON.stringify(warns, null, 2));
    } catch (e) {}
}

module.exports = {
    name: 'warn',
    alias: ['resetwarn'],
    desc: 'Warn user or reset warns',
    category: 'group',
    usage: '.warn @user [reason] | .resetwarn @user',

    execute: async (sock, m, { args, reply }) => {

        if (!m.isGroup)
            return reply(' Group only');

        const cmd = m.body.toLowerCase().split(/\s+/)[0].slice(1);
        const groupJid = m.chat;

        let target;
        if (m.mentionedJid?.length) {
            target = m.mentionedJid[0];
        } else if (args[0]) {
            const number = args[0].replace(/[^0-9]/g, '');
            if (number.length < 10)
                return reply('✘ Invalid number');
            target = number + '@s.whatsapp.net';
        } else {
            return reply(' Tag user\n `.warn @user [reason]` or `.resetwarn @user`');
        }

        if (!warns[groupJid]) warns[groupJid] = {};

        if (cmd === 'warn') {

            const reason = args.slice(1).join(' ') || 'No reason given';

            warns[groupJid][target] = (warns[groupJid][target] || 0) + 1;
            const count = warns[groupJid][target];

            saveWarns();

            await reply(`✓ Warned @${target.split('@')[0]} (${count}/3)`);

            await sock.sendMessage(m.chat, {
                text: ` Warning ${count}/3\nReason: ${reason}`,
                mentions: [target]
            });

            if (count >= 3) {
                try {
                    await sock.groupParticipantsUpdate(m.chat, [target], 'remove');
                    await sock.sendMessage(m.chat, {
                        text: ` @${target.split('@')[0]} kicked (3 warns)`,
                        mentions: [target]
                    });
                    delete warns[groupJid][target];
                    saveWarns();
                } catch (e) {
                    reply('✘ Kicked failed — check bot admin rights');
                }
            }

            return;
        }

        if (cmd === 'resetwarn') {

            if (!warns[groupJid][target]) {
                return reply(`✘ @${target.split('@')[0]} has no warns`);
            }

            delete warns[groupJid][target];
            saveWarns();

            await reply(`🏵️ Warns reset for @${target.split('@')[0]}`);

            return;
        }

        reply('✘ Invalid\nUse: .warn @user [reason] | .resetwarn @user');
    }
};
