
module.exports = {
    name: 'join',
    alias: ['entry', 'joingc'],
    category: 'group',
    desc: 'Join a group via link',
    usage: '.join <link> or reply to a link',
    owner: true, // Recommended to keep this owner-only to prevent spam

    execute: async (sock, m, { args, reply }) => {
        const userName = m.pushName || "Owner";
        
        // 1. Get the link from either args or quoted message
        let link = args[0] || (m.quoted ? (m.quoted.text || m.quoted.caption) : null);

        if (!link || !link.includes('chat.whatsapp.com')) {
            return reply(`*❍ CODEX JOIN SYSTEM* ❍\n\n_Please provide a valid WhatsApp group link or reply to one._\n\n© *CODEX AI SYSTEM*`);
        }

        try {
            // 2. Extract the code from the link
            const code = link.split('chat.whatsapp.com/')[1].trim();

            await reply('_✦ Attempting to join group..._');

            // 3. Attempt to join
            const response = await sock.groupAcceptInvite(code);

            // 4. Success Output
            let successMsg = `*❍ CODEX JOIN SUCCESS* ❍\n\n`;
            successMsg += `✓ Successfully joined the group.\n`;
            successMsg += `*ID:* ${response}\n\n`;
            successMsg += `© *CODEX AI SYSTEM*\n`;
            successMsg += `_Action by ${userName}_`;

            await reply(successMsg);

        } catch (err) {
            console.error('[JOIN ERROR]', err);

            // 5. Group Protocols (Error Handling)
            let errorMsg = `*❍ CODEX JOIN FAILED* ❍\n\n`;

            if (err.toString().includes('401')) {
                errorMsg += `✘ *Protocol:* Unauthorized. The bot might be banned from this group.`;
            } else if (err.toString().includes('404')) {
                errorMsg += `✘ *Protocol:* Link Invalid. The link was likely *reset* or the group no longer exists.`;
            } else if (err.toString().includes('409')) {
                errorMsg += `✘ *Protocol:* Already a member of this group.`;
            } else if (err.toString().includes('410')) {
                errorMsg += `✘ *Protocol:* Link Expired. This invite link is no longer active.`;
            } else {
                errorMsg += `✘ *Protocol:* ${err.message || 'Unknown network error'}`;
            }

            reply(errorMsg);
        }
    }
};



  
