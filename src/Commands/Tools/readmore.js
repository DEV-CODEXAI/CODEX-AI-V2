module.exports = {
    name: 'readmore',
    alias: ['rm', 'more'],
    category: 'tools',
    desc: 'Create WhatsApp read more text',
    usage: '.readmore text1 | text2',
    reactions: {
        start: '📝',
        success: '✨'
    },

    execute: async (sock, m, { args, reply }) => {
        const text = args.join(' ');
        const userName = m.pushName || "User";

        if (!text.includes('|')) {
            let help = `*❍ CODEX READ MORE* ❍\n\n`;
            help += `*Usage:* .readmore text1 | text2\n`;
            help += `*Example:* .readmore Click here | to see the secret\n\n`;
            help += `© *CODEX AI SYSTEM*`;
            return reply(help);
        }

        const [text1, text2] = text.split('|').map(v => v.trim());

        // This special character sequence triggers the "Read More" button
        const readMoreChar = String.fromCharCode(8206).repeat(4001);

        const message = `${text1}${readMoreChar}${text2}`;

        await sock.sendMessage(
            m.chat,
            { text: message },
            { quoted: m }
        );
    }
};
