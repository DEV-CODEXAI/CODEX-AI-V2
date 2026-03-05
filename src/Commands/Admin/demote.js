module.exports = {
    name: 'demote',
    alias: ['unadmin'],
    desc: 'Demote a user from admin',
    category: 'group',
    usage: '.demote @user',

    execute: async (sock, m, { args, reply }) => {

        if (!m.isGroup)
            return reply('𓉤 🥏 This command works only in group chats');

        let target;

        if (m.mentionedJid?.length) {
            target = m.mentionedJid[0];
        } else if (args[0]) {
            const number = args[0].replace(/[^0-9]/g, '');
            if (number.length < 10)
                return reply('✘ 🥏 Invalid number format');
            target = number + '@s.whatsapp.net';
        } else {
            return reply('🪄 🥏 Tag a user to demote\n✪ `.demote @user`');
        }

        try {

            await sock.groupParticipantsUpdate(m.chat, [target], 'demote');

            await new Promise(r => setTimeout(r, 1500));

            const demotedNumber = target.split('@')[0];

            await reply('✓  `Demoted successfully`');

            await sock.sendMessage(m.chat, {
                text: `🥏 @${demotedNumber} is no longer admin`,
                mentions: [target]
            });

        } catch (err) {

            console.error('[DEMOTE ERROR]', err?.message || err);

            let msg = '✘ Failed to demote user\n\n';

            if (err.message?.includes('admin') || err.message?.includes('permission')) {
                msg += '𓉤 Bot lacks admin permission';
            } else if (err.message?.includes('not-authorized')) {
                msg += '𓉤 Cannot demote this user';
            } else {
                msg += `𓉤 <${err.message || 'Unknown error'}>`;
            }

            reply(msg);
        }
    }
};
