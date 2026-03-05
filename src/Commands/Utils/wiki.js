
const axios = require('axios');

module.exports = {
    name: 'wiki',
    alias: ['wikipedia', 'wikisearch', 'wp'],
    desc: 'Wikipedia search with summary, image, and link',
    category: 'tools',
    usage: '.wiki <term>',
    reactions: {
        start: '🔎',
        success: '💬'
    },

    execute: async (sock, m, { args, reply, prefix }) => {
        if (!args.length) return reply(`✦ **CODEX SYSTEM**\n Please provide a search term\nExample: ${prefix}wiki peregrine falcon`);

        try {
            const query = args.join(' ');

            const searchRes = await axios.get('https://en.wikipedia.org/w/api.php', {
                params: {
                    action: 'query',
                    list: 'search',
                    srsearch: query,
                    srlimit: 1,
                    format: 'json',
                    origin: '*'
                },
                timeout: 10000
            });

            const result = searchRes.data.query?.search?.[0];
            if (!result) {
                await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return reply(`✦ **CODEX WIKI**\n✘ No results found for "**${query}**"`);
            }

            const pageTitle = result.title;

            const summaryRes = await axios.get(
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`,
                { timeout: 10000 }
            );

            const data = summaryRes.data;
            const title = data.title || pageTitle;
            const description = data.extract || 'No description available.';
            const pageUrl = data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
            const imgUrl = data.originalimage?.source || data.thumbnail?.source || null;

            await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            const responseText = `✦ **CODEX WIKIPEDIA**\n\n` +
                `🏷️ **Title:** ${title}\n` +
                `📝 **Summary:** ${description}\n\n` +
                `📎 **Link:** ${pageUrl}\n` +
                `🖋️ **Source:** Wikipedia\n\n` +
                `**Powered by CODEX AI**`;

            if (imgUrl) {
                await sock.sendMessage(m.chat, {
                    image: { url: imgUrl },
                    caption: responseText
                }, { quoted: m });
            } else {
                await reply(responseText);
            }

        } catch (err) {
            console.error('Wiki plugin error:', err.message);
            await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            return reply('✦ **CODEX ERROR**\n✘ Error fetching Wikipedia info. Please try a different term.');
        }
    }
};
