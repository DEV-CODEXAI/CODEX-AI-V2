
const axios = require('axios');

// 1. GLOBAL INITIALIZATION
global.defaultTrt = global.defaultTrt || 'en'; 

module.exports = {
  name: 'translate',
  alias: ['trt', 'trans', 'settrt', 'setlang'], 
  category: 'tools',
  desc: 'Translate text or set the session default language',
  execute: async (sock, m, { args, reply, prefix, isCreator }) => {
    try {
      // Robust command detection
      const cmd = m.body.slice(prefix.length).split(/\s+/)[0].toLowerCase();

      // --- SECTION A: THE SETTER (.settrt) ---
      if (cmd === 'settrt' || cmd === 'setlang') {
        if (!m.key.fromMe && !isCreator) return reply("*✘ ERROR: OWNER_ONLY_COMMAND*");
        if (!args[0]) return reply(`*USAGE: ${prefix}settrt [lang_code]*\n*EXAMPLE: ${prefix}settrt fr*`);

        const newLang = args[0].toLowerCase();
        if (newLang.length > 5) return reply("**✘ ERROR: INVALID_CODE**");

        global.defaultTrt = newLang; 
        // "Default language updated to" stays normal, the code stays bold
        return reply(`*𝐂𝐎𝐍𝐅𝐈𝐆_𝐔𝐏𝐃𝐀𝐓𝐄𝐃*\n\n*Default language updated to* *${newLang.toUpperCase()}*`);
      }

      // --- SECTION B: THE TRANSLATOR (.trt) ---
      let targetLang = global.defaultTrt; 
      let text = args.join(" ");

      if (args[0] && args[0].length <= 5 && /^[a-z]+$/i.test(args[0])) {
        if (args.length > 1 || m.quoted) {
            targetLang = args[0].toLowerCase();
            text = args.slice(1).join(" ");
        }
      }

      const content = text || (m.quoted ? (m.quoted.text || m.quoted.caption) : null);

      if (!content) {
        return reply(`*𝐓𝐑𝐀𝐍𝐒𝐋𝐀𝐓𝐎𝐑*\n\n*USAGE: ${prefix}trt [text]*\n*CURRENT DEFAULT: ${targetLang.toUpperCase()}*\n*TO CHANGE: ${prefix}settrt [code]*`);
      }

      await sock.sendMessage(m.chat, { react: { text: "🌐", key: m.key } });

      const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(content)}`;
      const response = await axios.get(apiUrl);
      
      const translatedText = response.data[0].map(item => item[0]).join("");
      const detectedLang = response.data[2] || "AUTO";

      const output = 
`*𝐓𝐑𝐀𝐍𝐒𝐋𝐀𝐓𝐎𝐑*

*𝐃𝐄𝐓𝐄𝐂𝐓𝐄𝐃*: *${detectedLang.toUpperCase()}*
*𝐓𝐀𝐑𝐆𝐄𝐓*: *${targetLang.toUpperCase()}*

**📝 RESULT:**
**${translatedText}**

*TRANSLATED VIA CODEX AI*`;

      return reply(output);

    } catch (err) {
      console.error("Translate Error:", err);
      return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: TRANSLATION_FAILED*');
    }
  }
};


