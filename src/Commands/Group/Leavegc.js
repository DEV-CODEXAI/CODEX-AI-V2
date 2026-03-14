
module.exports = {
    name: 'leave',
    alias: ['out', 'exit', 'leavegc'],
    category: 'owner',
    desc: 'Make the bot leave the current group',
    usage: '.leave',
    owner: true,

    execute: async (sock, m, { reply }) => {
        if (!m.isGroup) return reply('✘ This command only works in groups.');

        const userName = m.pushName || "Owner";

        try {
            // 1. Send a farewell message
            let farewellMsg = `*❍ CODEX DEPARTURE* ❍\n\n`;
            farewellMsg += `_codex is now leaving this group._\n`;
            farewellMsg += `*Reason:* Command triggered by ${userName}\n\n`;
            farewellMsg += `© *CODEX AI FAREWELL*`;

            await reply(farewellMsg);

            // 2. Short delay so the message actually sends before leaving
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 3. Exit the group
            await sock.groupLeave(m.chat);

        } catch (err) {
            console.error('[LEAVE ERROR]', err);
            reply('✘ *CODEX ERROR:* Failed to leave the group protocol.');
        }
    }
};
