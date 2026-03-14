const axios = require('axios');
const FormData = require('form-data');

module.exports = {
    name: 'scan',
    alias: ['ocr', 'read'],
    category: 'Documents',
    desc: 'Extract text from image (OCR)',
    usage: '.scan (reply to image)',
    reactions: {
        start: '💬',
        success: '🔍'
    },

    execute: async (sock, m, { reply }) => {

        if (!m.quoted) return reply('🥏 Reply to an image to scan');

        const quoted = m.quoted;
        const mtype = quoted.mtype || quoted.type || '';

        if (!mtype.includes('image')) {
            return reply('🥏 Reply to an *image*');
        }

        try {
            const userName = m.pushName || "User";
            await reply('_✦ *codex is running a deep scan please wait*..._');

            const buffer = await quoted.download();
            if (!buffer) return reply('✘ Failed to download image');

            const form = new FormData();
            form.append('apikey', 'K82707468388957');
            form.append('language', 'eng');
            form.append('isOverlayRequired', 'false');
            form.append('file', buffer, { filename: 'scan.jpg' });

            const res = await axios.post(
                'https://api.ocr.space/parse/image',
                form,
                { headers: form.getHeaders(), timeout: 120000 }
            );

            const data = res.data;

            if (!data?.ParsedResults?.[0]?.ParsedText) {
                return reply('✘ No text detected in image');
            }

            const text = data.ParsedResults[0].ParsedText.trim();

            // --- BUILD CLEAN OUTPUT ---
            let resultText = `*❍ CODEX OCR RESULT* ❍\n\n`;
            resultText += `${text}\n\n`;
            resultText += `© *SCANNED VIA CODEX AI*\n`;
            resultText += `_Analyzed for ${userName}_`;

            await sock.sendMessage(
                m.chat,
                { text: resultText },
                { quoted: m }
            );

        } catch (err) {
            console.log('[SCAN ERROR]', err.message);
            reply('✘ OCR scan failed');
        }
    }
};
