
const axios = require('axios');

module.exports = {
  name: 'bible',
  alias: ['verse', 'scripture'],
  category: 'utils',
  desc: 'Fetch a specific Bible verse',
  execute: async (sock, m, { args, reply }) => {
    try {
      const query = args.join(' ');

      // 1. USAGE CHECK (If no verse is provided)
      if (!query) {
        return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ USAGE ERROR: NO VERSE SPECIFIED*\n\n*📝 USE:* *.bible John 3:16*\n*📝 USE:* *.bible Psalm 23*');
      }

      // 2. FETCH DATA FROM API
      const response = await axios.get(`https://bible-api.com/${encodeURIComponent(query)}`);
      
      if (!response.data || !response.data.text) {
        return reply('𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: VERSE NOT FOUND*');
      }

      const { reference, text } = response.data;

      // 3. CLEAN BOLD OUTPUT
      const bibleMsg = 
`*📖 ${reference.toUpperCase()}*

*“${text.trim()}”*

*𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*`;

      await sock.sendMessage(m.chat, { text: bibleMsg }, { quoted: m });

    } catch (error) {
      console.error(error);
      reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: DATABASE CONNECTION FAILED*');
    }
  }
};


