module.exports = {
    name: 'setgdesc',
    alias: ['setgroupdesc', 'setdescription'],
    desc: 'Set group description',
    category: 'group',
    usage: '.setdesc new description',

    execute: async (sock, m, { args, reply }) => {

        if (!m.isGroup)
            return reply('❌ Group only');

        const newDesc = args.join(' ').trim();

        if (!newDesc)
            return reply(' Provide new description\n🥏 `.setdesc codex is coded`');

        try {

            await sock.groupUpdateSubject(m.chat, newDesc);

            await reply('✓ Group description updated successfully');

        } catch (err) {

            console.error('[SETDESC ERROR]', err?.message || err);

            let msg = '🪄 Failed to set description\n\n';

            if (err.message?.includes('admin') || err.message?.includes('permission')) {
                msg += '🪄 Bot lacks admin permission';
            } else {
                msg += `🪄 <${err.message || 'Unknown error'}>`;
            }

            reply(msg);
        }
    }
};
