
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
                return reply(`✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n✓ 𝙍𝙚𝙖𝙘𝙩𝙞𝙤𝙣 𝙩𝙧𝙞𝙜𝙜𝙚𝙧 𝙨𝙚𝙩: ${args[1]}`);
            }

            let quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quoted) return reply(`✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n✘ 𝙍𝙚𝙥𝙡𝙮 𝙩𝙤 𝙖 𝙫𝙞𝙚𝙬-𝙤𝙣𝙘𝙚 𝙢𝙚𝙨𝙨𝙖𝙜𝙚.`);

            if (quoted.ephemeralMessage) quoted = quoted.ephemeralMessage.message;
            if (quoted.viewOnceMessage) quoted = quoted.viewOnceMessage.message;

            const mimeType = Object.keys(quoted)[0];
            if (!['imageMessage', 'videoMessage', 'stickerMessage'].includes(mimeType)) {
                return reply(`✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n✘ 𝙊𝙣𝙡𝙮 𝙫𝙞𝙚𝙬-𝙤𝙣𝙘𝙚 𝙢𝙚𝙙𝙞𝙖 𝙨𝙪𝙥𝙥𝙤𝙧𝙩𝙚𝙙.`);
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
                    caption: `✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n✓ 𝙑𝙞𝙚𝙬-𝙤𝙣𝙘𝙚 𝙨𝙖𝙫𝙚𝙙 𝙥𝙧𝙞𝙫𝙖𝙩𝙚𝙡𝙮.` 
                });
                return reply(`✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n✓ 𝗶𝗺𝗮𝗴𝗲 𝙎𝙚𝙣𝙩 𝙩𝙤 𝙮𝙤𝙪𝙧 𝘿𝙈.`);
            } else {
                await sock.sendMessage(m.chat, { 
                    [mediaType]: buffer, 
                    caption: `✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n✓ 𝙑𝙞𝙚𝙬-𝙤𝙣𝙘𝙚 𝙙𝙚𝙘𝙧𝙮𝙥𝙩𝙚𝙙.` 
                }, { quoted: m });
            }

        } catch (err) {
            console.error('[VV ERROR]', err);
            reply(`✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n✘ 𝙀𝙧𝙧𝙤𝙧 𝙙𝙚𝙘𝙧𝙮𝙥𝙩𝙞𝙣𝙜 𝙫𝙞𝙚𝙬-𝙤𝙣𝙘𝙚.`);
        }
    }
};


                                       
