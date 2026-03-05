module.exports = {
    name: 'promote',
    alias: ['admin'],
    desc: 'Promote a user to admin',
    category: 'group',
    usage: '.promote @user',

    execute: async (sock, m, { args, reply }) => {

        if (!m.isGroup)
            return reply(' This command works only in groups');

        let target;

        if (m.mentionedJid?.length) {
            target = m.mentionedJid[0];
        } else if (args[0]) {
            const number = args[0].replace(/[^0-9]/g, '');
            if (number.length < 10)
                return reply('✘ Invalid number format');
            target = number + '@s.whatsapp.net';
        } else {
            return reply(' Tag a user to promote\n✪ `.promote @user`');
        }

        try {

            await sock.groupParticipantsUpdate(m.chat, [target], 'promote');

            await new Promise(r => setTimeout(r, 1500));

            const promotedNumber = target.split('@')[0];

            await reply('✓  `Promoted successfully`');

            await sock.sendMessage(m.chat, {
                text: ` @${promotedNumber} is now admin`,
                mentions: [target]
            });

        } catch (err) {

            console.error('[PROMOTE ERROR]', err?.message || err);

            let msg = '✘ Failed to promote user\n\n';

            if (err.message?.includes('admin') || err.message?.includes('permission')) {
                msg += ' Bot lacks admin permission';
            } else if (err.message?.includes('not-authorized')) {
                msg += ' Cannot promote this user';
            } else {
                msg += ` <${err.message || 'Unknown error'}>`;
            }

            reply(msg);
        }
    }
};
