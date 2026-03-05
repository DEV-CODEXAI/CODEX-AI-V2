
module.exports = {
    name: 'invite',
    alias: ['gclink', 'link', 'grouplink'],
    desc: 'Get the current shareable group invite link (with preview)',
    category: 'group',
    usage: '.linkgc',

    execute: async (sock, m, { reply }) => {
        if (!m.isGroup) {
            return reply('𓉤 🥏 This command works only in group chats');
        }

        try {
            const code = await sock.groupInviteCode(m.chat);

            if (!code) {
                return reply('✘ 🥏 Could not retrieve invite link');
            }

            const link = `https://chat.whatsapp.com/${code}`;

            await sock.sendMessage(m.chat, { text: link }, { quoted: m });

        } catch (err) {
            console.error('[LINKGC ERROR]', err?.message || err);

            let msg = '✘ ⚉ Failed to get group link\n\n';

            if (err?.message?.includes('admin') || err?.message?.includes('permission') || err?.message?.includes('not-authorized')) {
                msg += '𓉤 Bot must be an admin to get the invite link';
            } else {
                msg += `𓉤 ${err?.message || 'Unknown error'}`;
            }

            reply(msg);
        }
    }
};


