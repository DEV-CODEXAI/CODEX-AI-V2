const { getByCategory, getAll } = require('../../Plugin/crysCmd');
const { getVar } = require('../../Plugin/configManager');
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const os = require("os");

module.exports = {
    name: 'menu',
    alias: ['help', 'list', 'cmds'],
    desc: 'Show all commands',
    category: 'Bot',
    reactions: {
        start: '💬',
        success: '✨'
    },

    execute: async (sock, m, { prefix, config, reply }) => {

        // Safely extract sender from m object
        const sender = m.sender || m.key?.participant || m.key?.remoteJid || '';
        const senderNumber = sender.split('@')[0] || 'Unknown';

        const cats = getByCategory();

        const botName =
            getVar('botName', config.settings?.title || 'CRYSNOVA AI');

        const uptime = Math.floor((Date.now() - global.crysStats.startTime) / 60000);

        const total = new Set(
            [...getAll().values()]
                .filter(cmd => !cmd?.isAlias)
                .map(cmd => cmd.name?.toLowerCase())
        ).size;

        const now = new Date();

        const time = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: 'Africa/Lagos'
        }).toLowerCase();

        const readMore = String.fromCharCode(8206).repeat(4001);

        const getStorage = () => {
            try {
                const totalMem = os.totalmem();
                const freeMem = os.freemem();
                const usedMem = totalMem - freeMem;
                const usedGB = (usedMem / 1024 / 1024 / 1024).toFixed(1);
                const totalGB = (totalMem / 1024 / 1024 / 1024).toFixed(1);
                const percent = Math.round((usedMem / totalMem) * 100);
                return `${usedGB}/${totalGB}GB (${percent}%)`;
            } catch {
                return 'N/A';
            }
        };

        // Get WhatsApp real name
        const getWhatsAppName = async (jid) => {
            if (!jid) return 'Unknown';
            
            try {
                const contact = sock.store?.contacts?.get?.(jid);
                
                if (contact) {
                    if (contact.notify && contact.notify.trim() !== '') {
                        return contact.notify;
                    } else if (contact.name && contact.name.trim() !== '') {
                        return contact.name;
                    } else if (contact.verifiedName && contact.verifiedName.trim() !== '') {
                        return contact.verifiedName;
                    }
                }
                
                if (m.pushName && m.pushName.trim() !== '' && m.pushName !== jid.split('@')[0]) {
                    return m.pushName;
                }
                
                const fetchedName = await sock.getName(jid);
                if (fetchedName && fetchedName !== jid && fetchedName.trim() !== '' && !fetchedName.includes('@')) {
                    return fetchedName;
                }
                
                return jid.split('@')[0];
            } catch (e) {
                return jid.split('@')[0];
            }
        };

        const userName = await getWhatsAppName(sender);

        let text = '';

        text += `╔═══〔 ❍ *${botName.toUpperCase()}* ❍ 〕═══❒\n`;
        text += `║╭───────────────◆\n`;
        text += `║│ ❍ *USER:* ${userName}\n`;
        text += `║│ ❍ *PREFIX:* ${prefix}\n`;
        text += `║│ ❍ *UPTIME:* ${uptime} MIN\n`;
        text += `║│ ❍ *MODE:* ${config.status?.public ? 'PUBLIC' : 'PRIVATE'}\n`;
        text += `║│ ❍ *STORAGE:* ${getStorage()}\n`;
        text += `║╰───────────────◆\n`;
        text += `╚══════════════════❒\n${readMore}\n`; // Read more added here

        for (const [cat, cmds] of Object.entries(cats)) {

            text += `╔═══〔 ❍ *${cat.toUpperCase()}* ❍ 〕═══❒\n`;
            text += `║╭───────────────◆\n`;

            const shown = new Set();

            for (const cmd of cmds) {
                if (!cmd?.name) continue;
                const name = cmd.name.toLowerCase();
                if (shown.has(name)) continue;
                shown.add(name);
                text += `║│ ❍ ${prefix}${cmd.name}\n`;
            }

            text += `║╰───────────────◆\n`;
            text += `╚══════════════════❒\n\n`;
        }

        text += `╔═══〔 ❍ *DEVELOPER* ❍ 〕═══❒\n`;
        text += `║╭───────────────◆\n`;
        text += `║│ ✰ CODEX\n`;
        text += `║│ ➤ VERSION : 2.0.0\n`;
        text += `║╰───────────────◆\n`;
        text += `╚══════════════════❒`;

        // Image handling
        const imagePath = path.join(__dirname, "../../assets/menu.png");

        async function getMenuImage() {
            if (fs.existsSync(imagePath)) {
                return fs.readFileSync(imagePath);
            }

            try {
                const res = await axios.get(
                    config.thumbnail || config.thumbUrl || "https://i.imgur.com/BoN9kdC.png",
                    { responseType: "arraybuffer" }
                );

                fs.mkdirSync(path.dirname(imagePath), { recursive: true });
                fs.writeFileSync(imagePath, res.data);

                return res.data;
            } catch (err) {
                return null;
            }
        }

        const imageBuffer = await getMenuImage();

        await sock.sendMessage(
            m.chat,
            imageBuffer
                ? {
                    image: imageBuffer,
                    caption: text
                  }
                : {
                    text: text
                  },
            { quoted: m }
        );
    }
};
