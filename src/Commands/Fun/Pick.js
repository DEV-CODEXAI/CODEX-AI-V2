module.exports = {
    name: "pick",
    alias: ["choose", "who"],
    category: "fun",
    desc: "Pick a random option or a random group member",

    execute: async (sock, m, { text, reply }) => {
        try {
            if (!text) return reply("*Usage: .pick <question> or .pick choice1, choice2*");

            // 1. Logic for picking between specific choices (if commas exist)
            if (text.includes(',')) {
                const options = text.split(',').map(v => v.trim()).filter(v => v !== "");
                const choice = options[Math.floor(Math.random() * options.length)];
                return reply(`**🪄 I CHOOSE: ${choice.toUpperCase()}**`);
            }

            // 2. Logic for picking a random member (for questions like "who is...")
            if (!m.isGroup) return reply("**🥏 I can only pick members inside a group.**");

            const meta = await sock.groupMetadata(m.chat);
            const participants = meta.participants;
            const randomMember = participants[Math.floor(Math.random() * participants.length)].id;

            await sock.sendMessage(m.chat, { react: { text: "🎯", key: m.key } });

            // Send the result tagging the person
            return await sock.sendMessage(m.chat, {
                text: `**🪄 THE CHOSEN ONE IS: @${randomMember.split('@')[0]}**\n**Question: ${text}**`,
                mentions: [randomMember]
            }, { quoted: m });

        } catch (err) {
            console.error("Pick Error:", err);
            reply("**❌ error: could not pick anyone.**");
        }
    }
};
