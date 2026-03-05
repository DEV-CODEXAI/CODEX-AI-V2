
module.exports = {
    name: 'sticker',
    alias: ['s', 'sticker'],
    desc: 'Convert image/video to sticker',
    category: 'Media',
    reactions: {
        start: '🎨',
        success: '✨'
    },
    execute: async (sock, m, { reply, config }) => {
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || '';

        if (!/image|video/.test(mime)) {
            return reply('✦ **CODEX ERROR**\n❌ Please reply to an image or a short video!');
        }

        try {
            const media = await quoted.download();
            
            await sock.sendMessage(m.chat, { 
                sticker: media,
                packname: config.sticker?.packname || 'CODEX Pack',
                author: config.sticker?.author || 'CODEX AI'
            }, { quoted: m });

        } catch (e) { 
            console.error('Sticker Error:', e);
            await reply(`✦ **CODEX FAIL**\n❌ Conversion failed. Ensure it is a short video/image.`); 
        }
    }
};


