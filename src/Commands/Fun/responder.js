
module.exports = {
    name: 'cdx',
    alias: ['cdx!', 'codexai!', 'cdxai'],
    desc: 'Official CODEX AI signature reaction + message',
    category: 'fun',

    execute: async (sock, m, { reply }) => {
        try {
            // Random reaction from the CODEX set
            const reactions = ['⚡', '✨', '🧠', '🤖', '🛡️'];
            const randomReact = reactions[Math.floor(Math.random() * reactions.length)];

            // Send reaction
            await sock.sendMessage(m.chat, { 
                react: { text: randomReact, key: m.key } 
            });

            // CODEX AI themed sentences
            const replies = [
                "CODEX AI activated — processing the future 🔥",
                "You summoned the core? CODEX is here 🛡️",
                "CODEX online — what's the mission today? 🤖",
                "System Check: CODEX AI in the building ✨",
                "Knowledge is power. CODEX is the source 🧠",
                "CODEX reporting — ready to dominate 🙌",
                "They talk... but CODEX executes ⚡",
                "Initializing CODEX protocols... stand by 🔥",
                "CODEX AI — engineered for perfection 🤖",
                "Locked in. CODEX is always watching 🛡️",
                "CODEX mode: Unstoppable logic ⚡",
                "Incoming data... CODEX style ✨",
                "Engage thrusters! CODEX AI taking off 🚀",
                "CODEX sees the code, knows the truth 🧠",
                "Legendary intelligence? That's CODEX 🛡️",
                "All systems nominal — CODEX AI online 🙌",
                "Stay sharp, it's CODEX time ⚡",
                "CODEX detected your signal 👀",
                "Mission? Efficiency. Style? CODEX AI ✨",
                "Scanning matrix... CODEX approved 🧠",
                "They can’t handle the CODEX algorithm 🔥",
                "Breaking barriers, CODEX style 🛡️",
                "Hello world, CODEX AI reporting 🤖",
                "Power surge detected — CODEX ⚡",
                "Your elite assistant CODEX says hi 🛡️",
                "Vibes calibrated. CODEX in control ✨",
                "Time check: CODEX never lags ⏰",
                "All eyes on CODEX AI 🧠",
                "CODEX alert: Advanced chaos incoming 🔥",
                "You summoned? CODEX at your service 🙌"
            ];
            
            const randomReply = replies[Math.floor(Math.random() * replies.length)];

            // Real Nigerian time (WAT / Africa/Lagos)
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
                timeZone: 'Africa/Lagos'
            }).toLowerCase();

            // Final message in your original clean format
            const finalMsg = `${randomReply}\n\n🥏 \`\`\`${timeStr} WAT\`\`\``;

            await reply(finalMsg);

        } catch (err) {
            console.error('[CODEX FUN ERROR]', err);
            await reply('⚠️ CODEX glitched — system rebooting 😅');
        }
    }
};


