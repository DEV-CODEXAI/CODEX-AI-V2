const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = {
    name: "setpp",
    alias: ["setbotpp", "setppbot"],
    category: "tools",
    desc: "Change the bot's profile picture",

    execute: async (sock, m, { reply }) => {
        try {
            // 1. Detect Image (Quoted or Direct)
            const quoted = m.quoted ? m.quoted : m;
            const mime = (quoted.msg || quoted).mimetype || '';

            if (!/image/.test(mime)) {
                return reply("*✘ please reply to an image to set as profile picture.*");
            }

            await sock.sendMessage(m.chat, { react: { text: "⏰", key: m.key } });

            // 2. Download the media
            const stream = await downloadContentFromMessage(quoted.msg || quoted, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            // 3. Update Profile Picture
            await sock.updateProfilePicture(sock.user.id, buffer);

            // 4. Success Response
            await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
            return reply("*🪄 SUCCESS: bot profile picture has been updated.**");

        } catch (err) {
            console.error("SetPP Error:", err);
            reply("**❌ error: failed to update profile picture.*");
        }
    }
};
