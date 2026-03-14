const axios = require('axios');

module.exports = {
    name: 'dict',
    alias: ['dictionary', 'meaning', 'define'],
    category: 'tools',
    desc: 'Get the definition of a word',
    execute: async (conn, m, { args, reply }) => {
        try {
            const word = args[0];
            if (!word) return reply('🥏 _*Please provide a word to search, sir.*_');

            reply(`🪄 _*Searching for "${word}" in Codex Database...*_`);

            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            
            if (!response.data || response.data.title === "No Definitions Found") {
                return reply('✘ _*Word not found in my brain.*_');
            }

            const data = response.data[0];
            const definition = data.meanings[0].definitions[0].definition;
            const example = data.meanings[0].definitions[0].example || "No example available.";
            const pos = data.meanings[0].partOfSpeech;
            const phonetic = data.phonetic || "";

            // --- CODEX STYLE OUTPUT ---
            let resultMsg = `*CODEX DICTIONARY*\n\n`;
            resultMsg += `📚 *Word:* ${word.toUpperCase()}\n`;
            if (phonetic) resultMsg += `🔊 *Phonetic:* ${phonetic}\n`;
            resultMsg += `🏷️ *Category:* ${pos}\n\n`;
            resultMsg += `📖 *Definition:* ${definition}\n\n`;
            resultMsg += `📝 *Example:* _"${example}"_\n\n`;
            resultMsg += `*DEFINED VIA CODEX AI*`; // Your custom caption

            reply(resultMsg);

        } catch (error) {
            if (error.response && error.response.status === 404) {
                reply('✘ _*Word not found.*_');
            } else {
                console.error(error);
                reply('✘ _*An error occurred while fetching the definition.*_');
            }
        }
    }
};
