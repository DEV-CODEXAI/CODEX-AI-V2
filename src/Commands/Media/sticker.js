
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

module.exports = {
    name: 'sticker',
    alias: ['s', 'stiker'],
    desc: 'Convert image/video to sticker',
    category: 'Media',
    execute: async (sock, m, { reply, config }) => {
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || '';

        if (!/image|video/.test(mime)) return reply('✦ **CODEX ERROR**\n❌ Please reply to an image or video.');

        try {
            const media = await quoted.download();
            const sticker = new Sticker(media, {
                pack: config.sticker?.packname || 'CODEX BOT ✦', 
                author: config.sticker?.author || 'CODEX AI ✦ ',
                type: StickerTypes.FULL,
                quality: 60
            });

            const buffer = await sticker.toBuffer();
            await sock.sendMessage(m.chat, { sticker: buffer }, { quoted: m });

        } catch (e) { 
            await reply(`✦ **CODEX FAIL**\n❌ Error processing media.`); 
        }
    }
};


