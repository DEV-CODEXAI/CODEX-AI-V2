
const axios = require('axios');
const FormData = require('form-data');

module.exports = {
    name: 'newbg',
    alias: ['addbg'],
    desc: 'Smart AI background changer (remove bg → add bg)',
    category: 'ai',
    usage: '.changebg <background prompt> (reply image)',

    execute: async (sock, m, { args, reply, prefix }) => {
        try {
            if (!m.quoted) return reply(`✘ 𝙍𝞢𝙋𝙇𝙔 𝙏𝞗 𝘼𝙉 𝙄𝙈𝘼𝙂𝞢\n𝞢𝙓𝘼𝙈𝙋𝙇𝞢: ${prefix}changebg island`);

            const prompt = args.join(' ').trim();
            if (!prompt) return reply(`✘ 𝙋𝙍𝞗𝙑𝙄𝘿𝞢 𝘽𝘼𝘾𝙆𝙂𝙍𝞗𝙐𝙉𝘿 𝘿𝞢𝙎𝘾𝙍𝙄𝙋𝙏𝙄𝞗𝙉\n𝞢𝙓𝘼𝙈𝙋𝙇𝞢: ${prefix}changebg beach sunset`);

            if (!/image|webp/.test(m.quoted.mimetype || '')) return reply('✘ 𝙍𝞢𝙋𝙇𝙔 𝙈𝞐𝙎𝙏 𝘽𝞢 𝘼𝙉 𝙄𝙈𝘼𝙂𝞢');

            await reply('✦ 𝙋𝙍𝞗𝘾𝞢𝙎𝙎𝙄𝙉𝙂 𝙄𝙈𝘼𝙂𝞢, 𝙋𝙇𝞢𝘼𝙎𝞢 𝙒𝘼𝙄𝙏...');

            const imageBuffer = await m.quoted.download();
            const removeBgForm = new FormData();
            removeBgForm.append('image_file', imageBuffer, { filename: 'image.jpg', contentType: 'image/jpeg' });
            removeBgForm.append('size', 'auto');

            const removeBgRes = await axios.post('https://api.remove.bg/v1.0/removebg', removeBgForm, {
                headers: {
                    ...removeBgForm.getHeaders(),
                    'X-Api-Key': 'wPFjD5dk6JXo6P5UoxtH6dJW'
                },
                responseType: 'arraybuffer',
                timeout: 30000 
            });

            const transparentImage = Buffer.from(removeBgRes.data);
            if (!transparentImage || transparentImage.length < 100) return reply('✘ 𝘽𝘼𝘾𝙆𝙂𝙍𝞗𝙐𝙉𝘿 𝙍𝞢𝙈𝞗𝙑𝘼𝙇 𝙁𝘼𝙄𝙇𝞢𝘿');

            const addBgForm = new FormData();
            addBgForm.append('image', transparentImage, { filename: 'transparent.png' });
            addBgForm.append('param', prompt);

            const aiRes = await axios.post('https://api.nexray.web.id/ai/gptimage', addBgForm, {
                headers: { ...addBgForm.getHeaders() },
                responseType: 'arraybuffer',
                timeout: 180000 
            });

            if (!aiRes?.data) return reply('✘ 𝘼𝙄 𝘽𝘼𝘾𝙆𝙂𝙍𝞗𝙐𝙉𝘿 𝙂𝞢𝙉𝞢𝙍𝘼𝙏𝙄𝞗𝙉 𝙁𝘼𝙄𝙇𝞢𝘿');

            const finalBuffer = Buffer.from(aiRes.data);
            if (!finalBuffer.length) return reply('✘ 𝞢𝙈𝙋𝙏𝙔 𝘼𝙄 𝙍𝞢𝙎𝞐𝙇𝙏');
            
            if (finalBuffer.length > 5 * 1024 * 1024) return reply('✘ 𝙍𝞢𝙎𝞐𝙇𝙏 𝞢𝙓𝘾𝞢𝞢𝘿𝙎 𝙒𝙃𝘼𝙏𝙎𝘼𝙋𝙋 𝟱𝙈𝘽 𝙇𝙄𝙈𝙄𝙏');

            let caption = `✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄 - 𝘽𝙂 𝘾𝙃𝘼𝙉𝙂𝞢𝙍\n\n`;
            caption += `✓ 𝘽𝘼𝘾𝙆𝙂𝙍𝞗𝙐𝙉𝘿 𝘾𝙃𝘼𝙉𝙂𝞢𝘿 𝙎𝙐𝘾𝘾𝞢𝙎𝙎𝙁𝙐𝙇𝙇𝙔\n\n`;
            caption += `✦ 𝙋𝙍𝞗𝙈𝙋𝙏: < ${prompt.toUpperCase()} >\n\n`;
            caption += `✨ _𝙂𝞢𝙉𝞢𝙍𝘼𝙏𝞢𝘿 𝘽𝙔 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄_`;

            await sock.sendMessage(m.chat, { image: finalBuffer, caption: caption }, { quoted: m });

        } catch (err) {
            console.error('[CHANGE BG ERROR]', err);
            
            if (err.response?.status === 402) return reply('✘ 𝙍𝞢𝙈𝞗𝙑𝞢.𝘽𝙂 𝘾𝙍𝞢𝘿𝙄𝙏𝙎 𝞢𝙓𝙃𝘼𝙎𝙐𝙎𝙏𝞢𝘿');
            if (err.response?.status === 401) return reply('✘ 𝙄𝙉𝙑𝘼𝙇𝙄𝘿 𝙍𝞢𝙈𝞗𝙑𝞢.𝘽𝙂 𝘼𝙋𝙄 𝙆𝞢𝙔');
            if (err.code === 'ECONNABORTED') return reply('✘ 𝙋𝙍𝞗𝘾𝞢𝙎𝙎𝙄𝙉𝙂 𝙏𝙄𝙈𝞢𝞗𝙐𝙏');
            
            reply(`✘ 𝞢𝙍𝙍𝞗𝙍: ${err.message}`);
        }
    }
};


