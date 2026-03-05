
const axios = require('axios');
const FormData = require('form-data');

module.exports = {
    name: 'rembg',
    alias: ['removebg', 'nobg', 'bgremove'],
    desc: 'Remove background from replied image',
    category: 'Tools',
    usage: '.rembg (reply to an image)',
    owner: false,

    execute: async (sock, m, { reply }) => {
        if (!m.quoted) {
            return reply('✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n✘ 𝙋𝙡𝙚𝙖𝙨𝙚 𝙧𝙚𝙥𝙡𝙮 𝙩𝙤 𝙖𝙣 𝙞𝙢𝙖𝙜𝙚.');
        }

        const quoted = m.quoted;
        const mimeType = quoted.mtype || quoted.type || '';

        if (!['imageMessage', 'image'].includes(mimeType)) {
            return reply('✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n✘ 𝙋𝙡𝙚𝙖𝙨𝙚 𝙧𝙚𝙥𝙡𝙮 𝙩𝙤 𝙖𝙣 𝙞𝙢𝙖𝙜𝙚 𝙤𝙣𝙡𝙮.');
        }

        try {
            await reply('✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n✪ 𝙍𝙚𝙢𝙤𝙫𝙞𝙣𝙜 𝙗𝙖𝙘𝙠𝙜𝙧𝙤𝙪𝙣𝙙...');

            const imageBuffer = await m.quoted.download();
            if (!imageBuffer || imageBuffer.length < 100) {
                return reply('✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n✘ 𝙁𝙖𝙞𝙡𝙚𝙙 𝙩𝙤 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙞𝙢𝙖𝙜𝙚.');
            }

            const form = new FormData();
            form.append('image_file', imageBuffer, { filename: 'image.jpg', contentType: 'image/jpeg' });
            form.append('size', 'auto');

            const response = await axios.post('https://api.remove.bg/v1.0/removebg', form, {
                headers: {
                    ...form.getHeaders(),
                    'X-Api-Key': 'wPFjD5dk6JXo6P5UoxtH6dJW' 
                },
                responseType: 'arraybuffer',
                timeout: 30000
            });

            const caption = '\n✦ 𝘽𝙖𝙘𝙠𝙜𝙧𝙤𝙪𝙣𝙙 𝙧𝙚𝙢𝙤𝙫𝙚𝙙 𝙨𝙪𝙘𝙘𝙚𝙨𝙨𝙛𝙪𝙡𝙡𝙮 𝙗𝙮 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄';

            await sock.sendMessage(m.key.remoteJid, {
                image: Buffer.from(response.data),
                mimetype: 'image/png',
                caption: caption
            }, { quoted: m });

        } catch (error) {
            let errorMsg = '✘ 𝙁𝙖𝙞𝙡𝙚𝙙 𝙩𝙤 𝙧𝙚𝙢𝙤𝙫𝙚 𝙗𝙖𝙘𝙠𝙜𝙧𝙤𝙪𝙣𝙙.';
            
            if (error.response?.status === 402) {
                errorMsg = '✦ 𝘼𝙋𝙄 𝙘𝙧𝙚𝙙𝙞𝙩𝙨 𝙚𝙭𝙝𝙖𝙪𝙨𝙩𝙚升级.';
            } else if (error.response?.status === 401) {
                errorMsg = '✦ 𝙄𝙣𝙫𝙖𝙡𝙞𝙙 𝘼𝙋𝙄 𝙠𝙚𝙮.';
            } else if (error.code === 'ECONNABORTED') {
                errorMsg = '✦ 𝙍𝙚𝙦𝙪𝙚𝙨𝙩 𝙩𝙞𝙢𝙚𝙙 𝙤𝙪𝙩.';
            }

            await reply(`✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n${errorMsg}`);
        }
    }
};


