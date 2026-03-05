
const axios = require('axios');
const FormData = require('form-data');
const sharp = require('sharp');

module.exports = {
    name: 'changebg',
    alias: ['bg', 'background'],
    desc: 'AI background changer',
    category: 'ai',
    usage: '.changebg <background description> (reply image)',

    execute: async (sock, m, { args, reply, prefix }) => {

        try {

            const quoted = m.quoted;

            if (!quoted)
                return reply(
                    '🥏  𝙍𝞢𝙋𝙇𝙔 𝙏𝞗 𝘼𝙉 𝙄𝙈𝘼𝙂𝞢 𝞗𝙍 𝙎𝙏𝙄𝘾𝙆𝞢𝙍\n\n' +
                    `🪄🥏 \`${prefix}changebg beach background\``
                );

            if (!/image|webp/.test(quoted.mimetype || ''))
                return reply('✘ 🥏 𝙍𝞢𝙋𝙇𝙔 𝙈𝞐𝙎𝙏 𝘽𝞢 𝘼𝙉 𝙄𝙈𝘼𝙂𝞢 𝞗𝙍 𝙎𝙏𝘼𝙏𝙄𝘾 𝙎𝙏𝙄𝘾𝙆𝞢𝙍');

            const prompt = args.join(' ').trim();
            if (!prompt)
                return reply(
                    '🪄🥏 𝙋𝙍𝞗𝙑𝙄𝘿𝞢 𝘽𝘼𝘾𝙆𝙂𝙍𝞗𝙐𝙉𝘿 𝘿𝞢𝙎𝘾𝙍𝙄𝙋𝙏𝙄𝞗𝙉\n\n' +
                    `🪄🥏 \`${prefix}changebg dark forest\``
                );

            await sock.sendPresenceUpdate('composing', m.chat);

            let media = await quoted.download();
            if (!media)
                return reply('🪄🥏 𝙁𝘼𝙄𝙇𝞢𝘿 𝙏𝞗 𝘿𝞗𝙒𝙉𝙇𝞗𝘼𝘿 𝙈𝞢𝘿𝙄𝘼');

            if (Buffer.isBuffer(media)) {
                try {
                    media = await sharp(media)
                        .resize({
                            width: 1024,
                            height: 1024,
                            fit: 'inside'
                        })
                        .jpeg({ quality: 80 })
                        .toBuffer();
                } catch (e) {
                    console.log('Compression skipped:', e.message);
                }
            }

            const form = new FormData();
            form.append('image', media, { filename: 'image.jpg' });
            form.append('param', prompt);

            const response = await axios.post(
                'https://api.nexray.web.id/ai/gptimage',
                form,
                {
                    headers: {
                        ...form.getHeaders()
                    },
                    responseType: 'arraybuffer',
                    timeout: 180000
                }
            );

            if (!response?.data)
                return reply('✘ 🥏 𝘼𝙄 𝙍𝞢𝙏𝞐𝙍𝙉𝞢𝘿 𝞢𝙈𝙋𝙏𝙔 𝙍𝞢𝙎𝙋𝞗𝙉𝙎𝞢');

            const result = Buffer.from(response.data);

            if (!result.length)
                return reply('✘ 🥏 𝞢𝙈𝙋𝙏𝙔 𝙄𝙈𝘼𝙂𝞢 𝙍𝞢𝘾𝞢𝙄𝙑𝞢𝘿');

            if (result.length > 5 * 1024 * 1024)
                return reply('🥏  𝙍𝞢𝙎𝞐𝙇𝙏 𝞢𝙓𝘾𝞢𝞢𝘿𝙎 𝙒𝙃𝘼𝙏𝙎𝘼𝙋𝙋 𝟱𝙈𝘽 𝙇𝙄𝙈𝙄𝙏');
            
            let caption = `✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄 - 𝘽𝙂 𝘾𝙃𝘼𝙉𝙂𝞢𝙍\n\n`;
            caption += `✓ 𝘽𝘼𝘾𝙆𝙂𝙍𝞗𝙐𝙉𝘿 𝘾𝙃𝘼𝙉𝙂𝞢𝘿 𝙎𝞐𝘾𝘾𝞢𝙎𝙎𝙁𝞐𝙇𝙇𝙔\n\n`;
            caption += `🪄🥏 𝙋𝙍𝞗𝙈𝙋𝙏:\n< ${prompt.toUpperCase()} >\n\n`;
            caption += `✨ _𝙂𝞢𝙉𝞢𝙍𝘼𝙏𝞢𝘿 𝘽𝙔 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄_`;

            await sock.sendMessage(m.chat, {
                image: result,
                caption: caption
            }, { quoted: m });

        } catch (err) {

            console.error('[CHANGEBG ERROR]', err);

            if (err.response?.status === 429)
                return reply('🥏  𝙍𝘼𝙏𝞢 𝙇𝙄𝙈𝙄𝙏 𝞢𝙓𝘾𝞢𝞢𝘿𝞢𝘿');

            if (err.response?.status === 500)
                return reply('🥏  𝘼𝙄 𝙎𝞢𝙍𝙑𝞢𝙍 𝞐𝙉𝘼𝙑𝘼𝙄𝙇𝘼𝘽𝙇𝞢');

            if (err.code === 'ECONNABORTED')
                return reply('🥏  𝙋𝙍𝞗𝘾𝞢𝙎𝙎𝙄𝙉𝙂 𝙏𝙄𝙈𝞢𝞗𝞐𝙏');

            reply(`✘ 🥏 < ${err.message?.toUpperCase() || '𝞐𝙉𝙆𝙉𝞗𝙒𝙉 𝞢𝙍𝙍𝞗𝙍'} >`);
        }
    }
};



                                   
