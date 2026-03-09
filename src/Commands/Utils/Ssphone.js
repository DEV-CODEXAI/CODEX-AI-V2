const axios = require('axios');

module.exports = {
  name: 'ssphone',
  alias: ['ssmobile', 'mobs'],
  category: 'utils',
  desc: 'Capture a mobile-view screenshot of a website',
  execute: async (sock, m, { args, reply }) => {
    try {
      // 1. EXTRACT LINK
      let link = args[0] || (m.quoted && m.quoted.text);
      
      if (!link) {
          return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: LINK_NOT_FOUND*');
      }

      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const foundLinks = link.match(urlRegex);
      const targetUrl = foundLinks ? foundLinks[0] : null;

      if (!targetUrl) {
          return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: INVALID_URL*');
      }

      // 2. REACTION
      await sock.sendMessage(m.chat, {
          react: { text: "⏰", key: m.key }
      });

      // 3. FETCH IMAGE (Device set to phone)
      const apiUrl = `https://api-rebix.zone.id/api/ssweb?url=${encodeURIComponent(targetUrl)}&device=phone`;
      const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'utf-8');

      // 4. CLEAN BOLD CAPTION
      const caption = `*𝐂𝐀𝐏𝐓𝐔𝐑𝐄𝐃 𝐁𝐘 𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*`;

      return await sock.sendMessage(m.chat, { 
        image: buffer, 
        caption: caption 
      }, { quoted: m });

    } catch (err) {
      console.error(err);
      return reply(`*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: SYSTEM_FAILURE*`);
    }
  }
};
