
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Branding & Configuration
const SIG = '‎‎‎‎'; // Your invisible signature/prefix
const SETTINGS_FILE = path.join(__dirname, '../../../database/crysnova-settings.json');

/**
 * Logic: Group Check
 */
function isGroup(jid) {
    return jid && jid.endsWith('@g.us');
}

/**
 * Logic: Load Settings from JSON
 */
function loadSettings() {
    try {
        if (fs.existsSync(SETTINGS_FILE)) {
            return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
        }
    } catch (err) {
        console.error('[CODEX] Failed to load settings:', err.message);
    }
    return {};
}

/**
 * Logic: Save Settings to JSON
 */
function saveSettings(settings) {
    try {
        fs.mkdirSync(path.dirname(SETTINGS_FILE), { recursive: true });
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    } catch (err) {
        console.error('[CODEX] Failed to save settings:', err.message);
    }
}

function getChatSettings(jid) {
    if (typeof jid !== 'string') return { enabled: false, tagOnly: false };
    const settings = loadSettings();
    return {
        enabled: settings[jid]?.enabled || false,
        tagOnly: settings[jid]?.tagOnly || false
    };
}

function setChatSettings(jid, enabled, tagOnly = false) {
    if (typeof jid !== 'string') return false;
    const settings = loadSettings();
    settings[jid] = { enabled, tagOnly };
    saveSettings(settings);
    return true;
}

/**
 * Logic: Clean prompt for API
 */
function escapePrompt(prompt) {
    return prompt
        .replace(/[\\"]/g, '\\$&')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/`/g, '\\`')
        .replace(/\${/g, '\\${');
}

module.exports = {
    name: 'ai',
    alias: ['bot', 'codex', 'cdxai'],
    category: 'ai',
    desc: 'Chat with CODEX AI (GPT-4.5)',

    execute: async (sock, m, { args, text, prefix, reply }) => {
        const jid = m.key.remoteJid;
        const cmd = args[0]?.toLowerCase();
        const subCmd = args[1]?.toLowerCase();

        // Check if Group (Original logic: React and return)
        if (isGroup(jid)) {
            try { await sock.sendMessage(jid, { react: { text: '👀', key: m.key } }); } catch (e) {}
            return;
        }

        // Control Logic: ON / OFF
        if (cmd === 'on' && (subCmd === 'all' || subCmd === 'tag')) {
            const isTagOnly = subCmd === 'tag';
            setChatSettings(jid, true, isTagOnly);
            return reply(`📊 *CODEX AI Status*\n\nMode: ${isTagOnly ? '🏷️ Tag Only' : '🥏 _*All Messages*_'}`);
        }

        if (cmd === 'off') {
            setChatSettings(jid, false, false);
            return reply(`📊 *CODEX AI Status*\n\nMode: ✪ \`Disabled\``);
        }

        if (cmd === 'status') {
            const settings = getChatSettings(jid);
            const mode = settings.enabled ? (settings.tagOnly ? '🏷️ Tag Only' : '🥏 _*All Messages*_') : '✪ `Disabled`';
            return reply(SIG + `📊 *CODEX AI Status*\n\nMode: ${mode}`);
        }

        // Chat Logic
        const promptText = text?.trim();
        if (!promptText) {
            return reply(SIG + `🤖 *CODEX AI*\n\n*Control:*\n• ${prefix}ai on all\n• ${prefix}ai on tag\n• ${prefix}ai off\n\n*Chat:* ${prefix}ai <message>`);
        }

        // Avoid self-reply loops
        if (m.text && m.text.startsWith(SIG)) return;

        try {
            await sock.sendPresenceUpdate('composing', jid);
            
            const escaped = escapePrompt(promptText);
            const systemContext = `\nYou are CODEX AI Assistant.\nReply naturally and intelligently. Be concise and helpful.\nAlways behave as CODEX AI.\n\nUser Question:\n`;
            
            const apiUrl = `https://all-in-1-ais.officialhectormanuel.workers.dev/?query=${encodeURIComponent(systemContext + escaped)}&model=gpt-4.5`;
            
            const response = await axios.get(apiUrl, { timeout: 60000 });
            const result = response.data;

            if (result?.status && result?.message?.content) {
                const out = SIG + result.message.content;
                await sock.sendMessage(jid, { text: out }, { quoted: m });
            } else {
                await reply(SIG + `𓉤 _*CODEX response invalid*_.`);
            }
            
            await sock.sendPresenceUpdate('paused', jid);
        } catch (err) {
            console.error('[CODEX AI ERROR]', err.message);
            await reply(SIG + `𓄄 \`I am tired\`. _ask again later_.`);
        }
    },

    /**
     * Auto-Response Logic (onMessage)
     */
    onMessage: async (sock, m) => {
        const jid = m.key.remoteJid;
        if (isGroup(jid)) return;
        if (m.text && m.text.startsWith(SIG)) return;

        const settings = getChatSettings(jid);
        if (!settings.enabled) return;

        // Skip if it's a command
        const prefixes = ['.', '!', '/', '#', '$', '%', '&'];
        if (m.text && prefixes.some(p => m.text.startsWith(p))) return;
        if (!m.text || m.text.trim().length === 0) return;

        try {
            await sock.sendPresenceUpdate('composing', jid);
            
            const escaped = escapePrompt(m.text);
            const systemContext = `\nYou are CODEX AI Assistant.\nReply naturally and intelligently. Be concise and helpful.\nAlways behave as CODEX AI.\n\nUser Question:\n`;
            
            const apiUrl = `https://all-in-1-ais.officialhectormanuel.workers.dev/?query=${encodeURIComponent(systemContext + escaped)}&model=gpt-4.5`;
            
            const response = await axios.get(apiUrl, { timeout: 60000 });
            const result = response.data;

            if (result?.status && result?.message?.content) {
                const out = SIG + result.message.content;
                await sock.sendMessage(jid, { text: out }, { quoted: m });
            }
            
            await sock.sendPresenceUpdate('paused', jid);
        } catch (err) {
            console.error('[CODEX AUTO ERROR]', err.message);
        }
    }
};


                                                       
