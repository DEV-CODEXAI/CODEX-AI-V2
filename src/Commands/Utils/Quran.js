
const axios = require('axios');

module.exports = {
  name: 'quran',
  alias: ['surah', 'ayah'],
  category: 'utils',
  desc: 'Fetch a specific Quran verse (Ayah)',
  execute: async (sock, m, { args, reply }) => {
    try {
      const query = args[0]; // Logic: Expects format 2:255

      // 1. USAGE CHECK (Pattern matching John 3:16 style)
      if (!query || !query.includes(':')) {
        return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ USAGE ERROR: NO VERSE SPECIFIED*\n\n*📖 USE:* *.quran 2:255*\n*📖 USE:* *.quran 18:10*');
      }

      // 2. FETCH DATA FROM GLOBAL API
      const response = await axios.get(`https://api.alquran.cloud/v1/ayah/${query}/en.asad`);
      
      if (!response.data || response.data.status !== "OK") {
        return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: VERSE NOT FOUND*');
      }

      const { text, surah, numberInSurah } = response.data.data;

      // 3. CLEAN BOLD OUTPUT (NO BOXES)
      const quranMsg = 
`*📖 ${surah.englishName.toUpperCase()} ${surah.number}:${numberInSurah}*

*“${text.trim()}”*

*𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*`;

      await sock.sendMessage(m.chat, { text: quranMsg }, { quoted: m });

    } catch (error) {
      console.error('Quran Cmd Error:', error.message);
      reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: DATABASE CONNECTION FAILED*');
    }
  }
};




