const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
    name: "hack",
    alias: ["hacking", "exploit"],
    category: "fun",
    desc: "Long protocol hack with message editing",

    execute: async (sock, m, { args, reply }) => {
        const jid = m.key.remoteJid;
        const target = m.quoted ? m.quoted.sender : m.mentionedJid?.[0] || m.chat;
        const user = target.split('@')[0];

        try {
            // 1. INITIAL MESSAGE (The anchor for all edits)
            const { key } = await sock.sendMessage(jid, { 
                text: `**INITIALIZING HACK PROTOCOL...**\n**[ ░ ░ ░ ░ ░ ░ ░ ░ ░ ░ ] 5%**` 
            });
            await delay(2000);

            // 2. ALL STEPS BELOW USE THE 'EDIT' PROPERTY
            await sock.sendMessage(jid, { 
                text: `**CONNECTING TO REMOTE SERVER...**\n**[ █ ░ ░ ░ ░ ░ ░ ░ ░ ░ ] 10%**`, 
                edit: key 
            });
            await delay(2000);

            await sock.sendMessage(jid, { 
                text: `**TARGETING USER: @${user}**\n**[ ██ ░ ░ ░ ░ ░ ░ ░ ░ ░ ] 20%**`, 
                edit: key, mentions: [target] 
            });
            await delay(2000);

            await sock.sendMessage(jid, { 
                text: `**INTERCEPTING SS7 GATEWAY VIA NET CRACK...**\n**[ ███ ░ ░ ░ ░ ░ ░ ░ ░ ] 30%**`, 
                edit: key 
            });
            await delay(2000);

            await sock.sendMessage(jid, { 
                text: `**BYPASSING END-TO-END ENCRYPTION VIA CODEX LINUX BASE...**\n**[ ████ ░ ░ ░ ░ ░ ░ ░ ] 40%**`, 
                edit: key 
            });
            await delay(2000);

            await sock.sendMessage(jid, { 
                text: `**DECRYPTING SQLITE_DB MESSAGES VIA CODEX AI...**\n**[ █████ ░ ░ ░ ░ ░ ░ ] 50%**`, 
                edit: key 
            });
            await delay(2000);

            await sock.sendMessage(jid, { 
                text: `**FETCHING PRIVATE MEDIA FILES...**\n**[ ██████ ░ ░ ░ ░ ░ ░ ] 60%**`, 
                edit: key 
            });
            await delay(2000);

            await sock.sendMessage(jid, { 
                text: `**INJECTING REMOTE ACCESS TROJAN...**\n**[ ███████ ░ ░ ░ ░ ░ ] 70%**`, 
                edit: key 
            });
            await delay(2000);

            await sock.sendMessage(jid, { 
                text: `**PINGING LIVE GPS COORDINATES VIA NET HUNTER...**\n**[ ████████ ░ ░ ░ ░ ] 80%**`, 
                edit: key 
            });
            await delay(2000);

            await sock.sendMessage(jid, { 
                text: `**ERASING SYSTEM LOG TRACES VIA KALI LINUS...**\n**[ █████████ ░ ░ ░ ] 90%**`, 
                edit: key 
            });
            await delay(2000);

            await sock.sendMessage(jid, { 
                text: `**UPLOADING DATA TO CODEX AI CLOUD...**\n**[ ██████████ ░ ░ ] 95%**`, 
                edit: key 
            });
            await delay(2000);

            // FINAL RESULT
            await sock.sendMessage(jid, { 
                text: `**HACK SUCCESSFUL.**\n**[ ████████████ ] 100%**\n\n**USER @${user} HAS BEEN COMPROMISED.**`, 
                edit: key, mentions: [target] 
            });

            await sock.sendMessage(jid, { react: { text: "💀", key: m.key } });

        } catch (err) {
            console.error(err);
            reply("**ERROR: HACK_PROTOCOL_FAILED**");
        }
    }
};
