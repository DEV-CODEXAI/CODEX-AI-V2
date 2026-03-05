
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'obf',
    alias: ['obfuscate'],
    desc: 'Protect source code by obfuscating it',
    category: 'Owner',
    reactions: {
        start: '🛠️',
        success: '✅',
        fail: '🚫'
    },

    execute: async (sock, m, { args, reply, prefix }) => {
        const sender = m.sender || m.key.remoteJid;
        const ownerNumber = '2347019135989@s.whatsapp.net';

        if (sender !== ownerNumber) {
            await sock.sendMessage(m.chat, { react: { text: '🚫', key: m.key } });
            return reply(`✦ CODEX ACCESS\n❌ Permission Denied. Only the dev of this bot which is *CODEX* can use this cmd.`);
        }

        if (!args[0]) {
            return reply(`✦ CODEX SYSTEM\n❌ Usage: ${prefix}obf [path/to/file]`);
        }

        const filePath = args[0];

        if (!fs.existsSync(filePath)) {
            return reply(`✦ CODEX ERROR\n❌ File not found: ${filePath}`);
        }

        try {
            const backupPath = filePath + '.bak';
            if (!fs.existsSync(backupPath)) {
                fs.copyFileSync(filePath, backupPath);
            }

            const command = `npx javascript-obfuscator "${filePath}" --output "${filePath}"`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    return reply(`✦ CODEX OBF FAIL\n❌ Error: ${error.message}`);
                }

                reply(`✦ CODEX PROTECT\n❍ FILE: ${path.basename(filePath)}\n❍ STATUS: *Codes Obfuscated Successfully*✅\n❍ BACKUP: Saved (.bak) 🪄`);
            });

        } catch (err) {
            reply(`✦ CODEX SYSTEM FAIL\n❌ Process failed: ${err.message}`);
        }
    }
};


