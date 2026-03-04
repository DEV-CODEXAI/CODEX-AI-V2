
const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

const DATA_FILE = path.join(__dirname, '../../../database/vv-reactions.json');

let reactionTriggers = {};
try {
    if (fs.existsSync(DATA_FILE)) {
        reactionTriggers = JSON.parse(fs.readFileSync(DATA_FILE));
    }
} catch (e) {
    reactionTriggers = {};
}

function saveTriggers() {
    if (!fs.existsSync(path.dirname(DATA_FILE))) {
        fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(reactionTriggers, null, 2));
}

module.exports = {
    name: 'vv',
    alias: ['vview', 'vvp', 'viewonce'],
    category: 'cmd',
    owner: true,
    reactions: {
        start: '👌',
        success: '🤫'
    },

    execute: async (sock, m, { args, reply }) => {
        try {
            const command = m.body.split(' ')[0].toLowerCase();
            const sender = m.sender;

            if (command === '.vv' && args[0] === 'set' && args[1]) {
                reactionTriggers[sender] = args[1];
                saveTriggers();
                return reply(`╔═══〔 ❍ *CODEX AI* ❍ 〕═══❒\n║╭───────────────◆\n║│ ✓ Reaction trigger set: ${args[1]}\n║╰───────────────◆\n╚══════════════════❒`);
            }

            let quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quoted) return reply(`╔═══〔 ❍ *CODEX AI* ❍ 〕═══❒\n║╭───────────────◆\n║│ ✘ Reply to a view-once message.\n║╰───────────────◆\n╚══════════════════❒`);

            if (quoted.ephemeralMessage) quoted = quoted.ephemeralMessage.message;
            if (quoted.viewOnceMessage) quoted = quoted.viewOnceMessage.message;

            const mimeType = Object.keys(quoted)[0];
            if (!['imageMessage', 'videoMessage', 'stickerMessage'].includes(mimeType)) {
                return reply(`╔═══〔 ❍ *CODEX AI* ❍ 〕═══❒\n║╭───────────────◆\n║│ ✘ Only view-once media supported.\n║╰───────────────◆\n╚══════════════════❒`);
            }

            const stream = await downloadContentFromMessage(
                quoted[mimeType], 
                mimeType.replace('Message', '').toLowerCase()
            );
            
            let buffer = Buffer.alloc(0);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            const mediaType = mimeType === 'videoMessage' ? 'video' : mimeType === 'imageMessage' ? 'image' : 'sticker';

            if (command === '.vvp') {
                await sock.sendMessage(sender, { 
                    [mediaType]: buffer, 
                    caption: `╔═══〔 ❍ *CODEX AI* ❍ 〕═══❒\n║ ✓ View-once saved privately.\n╚══════════════════❒` 
                });
                return reply(`╔═══〔 ❍ *CODEX AI* ❍ 〕═══❒\n║╭───────────────◆\n║│ ✓ Sent to your DM.\n║╰───────────────◆\n╚══════════════════❒`);
            } else {
                await sock.sendMessage(m.chat, { 
                    [mediaType]: buffer, 
                    caption: `╔═══〔 ❍ *CODEX AI* ❍ 〕═══❒\n║ ✓ View-once decrypted.\n╚══════════════════❒` 
                }, { quoted: m });
            }

        } catch (err) {
            console.error('[VV ERROR]', err);
            reply(`╔═══〔 ❍ *CODEX AI* ❍ 〕═══❒\n║╭───────────────◆\n║│ ✘ Error decrypting view-once.\n║╰───────────────◆\n╚══════════════════❒`);
        }
    }
};


