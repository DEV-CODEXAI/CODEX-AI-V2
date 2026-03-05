
const { getByCategory, getAll } = require('../../Plugin/crysCmd');
const { getVar } = require('../../Plugin/configManager');
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const os = require("os");

module.exports = {
    name: 'menu',
    alias: ['help', 'list', 'cmds'],
    desc: 'Show all commands with CODEX UI',
    category: 'Bot',
    reactions: {
        start: '💬',
        success: '🪄'
    },

    execute: async (sock, m, { prefix, config, reply }) => {
        const sender = m.sender || m.key?.participant || m.key?.remoteJid || '';
        const senderNumber = sender.split('@')[0] || 'Unknown';
        const cats = getByCategory();
        const botName = getVar('botName', config.settings?.title || 'CODEX AI');
        const uptime = Math.floor((Date.now() - global.crysStats.startTime) / 60000);
        
        const total = new Set(
            [...getAll().values()]
                .filter(cmd => !cmd?.isAlias)
                .map(cmd => cmd.name?.toLowerCase())
        ).size;

        const time = new Date().toLocaleTimeString('en-US', {
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
                const usedMem = totalMem - os.freemem();
                const usedGB = (usedMem / 1024 / 1024 / 1024).toFixed(1);
                const totalGB = (totalMem / 1024 / 1024 / 1024).toFixed(1);
                const percent = Math.round((usedMem / totalMem) * 100);
                return `${usedGB}/${totalGB}GB (${percent}%)`;
            } catch { return 'N/A'; }
        };

        const getWhatsAppName = async (jid) => {
            if (!jid) return 'Unknown';
            try {
                const contact = sock.store?.contacts?.get?.(jid);
                if (contact?.notify) return contact.notify;
                if (m.pushName) return m.pushName;
                const fetchedName = await sock.getName(jid);
                if (fetchedName && !fetchedName.includes('@')) return fetchedName;
                return jid.split('@')[0];
            } catch { return jid.split('@')[0]; }
        };

        const userName = await getWhatsAppName(sender);

        let text = `╔═══〔 ❍ *${botName.toUpperCase()}* ❍ 〕═══❒\n`;
        text += `║╭───────────────◆\n`;
        text += `║│ ❍ *USER:* ${userName}\n`;
        text += `║│ ❍ *HOST:* Pterodactyl (panel)\n`;
        text += `║│ ❍ *PREFIX:* ${prefix}\n`;
        text += `║│ ❍ *CMDS:* ${total}\n`;
        text += `║│ ❍ *UPTIME:* ${uptime} MIN\n`;
        text += `║│ ❍ *MODE:* ${config.status?.public ? 'PUBLIC' : 'PRIVATE'}\n`;
        text += `║│ ❍ *STORAGE:* ${getStorage()}\n`;
        text += `║╰───────────────◆\n`;
        text += `╚══════════════════❒\n${readMore}\n`;

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
        text += `║│ ✰ 𝗖𝗢𝗗𝗘𝗫 𝐀𝐈\n`;
        text += `║│ ➤ VERSION : 2.0.0\n`;
        text += `║╰───────────────◆\n`;
        text += `╚══════════════════❒\n`;
        text += ` ╰─ 𓄄 \`\`\`${time}\`\`\``;

        const imagePath = path.join(__dirname, "../../assets/menu.png");
        async function getMenuImage() {
            if (fs.existsSync(imagePath)) return fs.readFileSync(imagePath);
            try {
                const res = await axios.get(
                    config.thumbnail || config.thumbUrl || "https://i.imgur.com/BoN9kdC.png",
                    { responseType: "arraybuffer" }
                );
                if (!fs.existsSync(path.dirname(imagePath))) fs.mkdirSync(path.dirname(imagePath), { recursive: true });
                fs.writeFileSync(imagePath, res.data);
                return res.data;
            } catch { return null; }
        }

        const imageBuffer = await getMenuImage();

        await sock.sendMessage(m.chat, 
            imageBuffer ? { image: imageBuffer, caption: text } : { text: text }, 
            { quoted: m }
        );
    }
};


