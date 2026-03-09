const axios = require('axios');

module.exports = {
  name: 'translate',
  alias: ['trt', 'trans'],
  category: 'tools',
  desc: 'Translate text to any language',
  execute: async (sock, m, { args, reply, prefix }) => {
    try {
      // 1. INPUT EXTRACTION
      let text = args.join(" ");
      let targetLang = 'en'; // Default to English

      // Check if first argument is a language code (e.g., .trt fr Hello)
      if (args[0] && args[0].length <= 5 && /^[a-z]+$/i.test(args[0])) {
        targetLang = args[0].toLowerCase();
        text = args.slice(1).join(" ");
      }

      // If no text in args, check quoted message
      const content = text || (m.quoted ? (m.quoted.text || m.quoted.caption) : null);

      if (!content) {
        return reply(`*𝐓𝐑𝐀𝐍𝐒𝐋𝐀𝐓𝐎𝐑*\n\n* USAGE:* ${prefix}translate [lang] [text]\n* EXAMPLE:* ${prefix}trt hello codex\n* INFO:* Translates quoted text or provided text.`);
      }

      await sock.sendMessage(m.chat, { react: { text: "🌐", key: m.key } });

      // 2. TRANSLATION ENGINE (Cloud API)
      // Using a high-reliability translation aggregator
      const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(content)}`;

      const response = await axios.get(apiUrl);
      
      // Google's result structure: [[["translated_text", "original_text"...]]]
      const translatedText = response.data[0].map(item => item[0]).join("");
      const detectedLang = response.data[2];

      // 3. FORMATTED OUTPUT
      const output = 
`*𝐓𝐑𝐀𝐍𝐒𝐋𝐀𝐓𝐎𝐑*

*𝐃𝐄𝐓𝐄𝐂𝐓𝐄𝐃*: *${detectedLang.toUpperCase()}*
*𝐓𝐀𝐑𝐆𝐄𝐓*: *${targetLang.toUpperCase()}*

*📝 RESULT:*
*${translatedText}*

*TRANSLATED VIA CODEX AI*`;

      return reply(output);

    } catch (err) {
      console.error("Translate Error:", err);
      return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: TRANSLATION_FAILED*\n* LOG: CHECK LANGUAGE CODE AND TRY AGAIN*');
    }
  }
};
