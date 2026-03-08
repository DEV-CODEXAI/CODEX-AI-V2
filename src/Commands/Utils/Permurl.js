
// © 2026 CODEX AI - Media Upload System
const axios = require('axios');
const FormData = require('form-data');

module.exports = {
    name: 'url',
    alias: ['mediaurl', 'geturl'],
    category: 'Tools',
    desc: 'Generate a public URL from replied media',

    execute: async (sock, m, { reply }) => {
        try {
            if (!m.quoted) {
                return reply('✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n 𝙋𝙡𝙚𝙖𝙨𝙚 𝙧𝙚𝙥𝙡𝙮 𝙩𝙤 𝙢𝙚𝙙𝙞𝙖 𝙩𝙤 𝙜𝙚𝙣𝙚𝙧𝙖𝙩𝙚 𝙐𝙍𝙇');
            }

            await reply('✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n📤 𝙐𝙥𝙡𝙤𝙖𝙙𝙞𝙣𝙜 𝙢𝙚𝙙𝙞𝙖...');

            const mediaBuffer = await m.quoted.download();
            if (!mediaBuffer || mediaBuffer.length < 500) {
                return reply('✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n❌ 𝙈𝙚𝙙𝙞𝙖 𝙙𝙤𝙬𝙣𝙡𝙤𝙖𝙙 𝙛𝙖𝙞𝙡𝙚𝙙');
            }

            const maxSize = 5 * 1024 * 1024;
            if (mediaBuffer.length > maxSize) {
                return reply('✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n❌ 𝙈𝙚𝙙𝙞𝙖 𝙩𝙤𝙤 𝙡𝙖𝙧𝙜𝙚 (𝙈𝙖𝙬 5𝙈𝘽)');
            }

            const cdnUrl = 'https://media.codex-ai.workers.dev';
            const form = new FormData();
            form.append('file', Buffer.from(mediaBuffer.slice(0, maxSize)), {
                filename: 'media',
                contentType: 'application/octet-stream'
            });

            const response = await axios.post(cdnUrl, form, {
                headers: form.getHeaders(),
                timeout: 30000
            });

            if (!response.data?.url) {
                return reply('✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n❌ 𝘾𝘿𝙉 𝙪𝙥𝙡𝙤𝙖𝙙 𝙛𝙖𝙞𝙡𝙚𝙙');
            }

            let successMsg = `✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n\n`;
            successMsg += `✦ 𝙈𝙚𝙙𝙞𝙖 𝙐𝙥𝙡𝙤𝙖𝙙𝙚𝙙\n\n`;
            successMsg += `🐾 𝙇𝙞𝙣𝙠:\n${response.data.url}\n\n`;
            successMsg += `🌐 𝘾𝞗𝘿𝞢𝙓 𝘾𝘿𝙉`;

            return reply(successMsg);

        } catch (err) {
            console.error('URL Generation Error:', err);
            return reply('✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n❌ 𝙐𝙍𝙇 𝙜𝙚𝙣𝙚𝙧𝙖𝙩𝙞𝙤𝙣 𝙛𝙖𝙞𝙡𝙚𝙙');
        }
    }
};


