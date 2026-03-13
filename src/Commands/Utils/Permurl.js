
const axios = require('axios');

module.exports = {
    name: 'url',
    alias: ['upload', 'mediaurl'],
    category: 'tools',
    desc: 'Upload media and get public URL',
    execute: async (conn, m, { reply }) => {
        try {
            // Check for quoted media
            if (!m.quoted) return reply('🥏 _*Reply to image/video/audio*_');

            // Download media buffer
            const mediaBuffer = await m.quoted.download();
            if (!mediaBuffer) return reply('✘ Failed to download media');

            reply('🥏 _*Uploading media...*_');

            // POST request to the worker API
            const response = await axios.post('https://media.codex-ai.workers.dev/upload', mediaBuffer, {
                headers: {
                    'content-type': m.quoted.mimetype || 'application/octet-stream'
                },
                timeout: 60000
            });

            // Validate response data
            if (!response.data || !response.data.url) return reply('✘ Upload failed');

            // Return success message with URL
            reply('🥏 *UPLOAD SUCCESS*\n\n🪄 URL:\n' + response.data.url);

        } catch (error) {
            console.error(error);
            reply('✘ Media upload failed');
        }
    }
};


