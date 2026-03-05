
/**
 * CODEX AI - LittleBot Plugin
 * Developed for CODEX AI Ecosystem
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// ── Config & Storage ────────────────────────────────────────────
const HISTORY_FILE = path.join(__dirname, '../../../database/littlebot-history.json');
const MODE_FILE    = path.join(__dirname, '../../../database/littlebot-mode.json');

let history = {};
let modeEnabled = {};

try {
    if (fs.existsSync(HISTORY_FILE)) history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    if (fs.existsSync(MODE_FILE))    modeEnabled = JSON.parse(fs.readFileSync(MODE_FILE, 'utf8'));
} catch (e) {
    console.error('[CODEX-LittleBot] Load error:', e.message);
}

function save(file, data) {
    try {
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    } catch (e) {}
}

function getChatHistory(jid) {
    return history[jid] || [];
}

function addToChat(jid, role, content) {
    if (!history[jid]) history[jid] = [];
    history[jid].push({ role, content });
    if (history[jid].length > 10) history[jid] = history[jid].slice(-10);
    if (history[jid].length % 3 === 0) save(HISTORY_FILE, history);
}

function clearChat(jid) {
    delete history[jid];
    save(HISTORY_FILE, history);
}

function isModeOn(jid) {
    return !!modeEnabled[jid];
}

function setMode(jid, enabled) {
    if (enabled) modeEnabled[jid] = true;
    else delete modeEnabled[jid];
    save(MODE_FILE, modeEnabled);
}

// ── LittleBot Personality Prompt ───────────────────────────────
const LITTLEBOT_PROMPT = `You are LittleBot — a fun, cheeky, super helpful mini AI companion in CODEX AI.
Personality rules:
- Short, witty, playful replies (perfect for WhatsApp)
- Use emojis 🥏✨🔥 sometimes
- Be friendly, sassy when needed, never rude
- Answer seriously if the question is serious
- Use *bold* for emphasis
- Never break character
- your official founder and creator is CODEX 
You are an integral part of the CODEX AI system.`;

async function getLittleBotReply(jid, userMessage) {
    const chat = getChatHistory(jid);
    const messages = [
        { role: 'system', content: LITTLEBOT_PROMPT },
        ...chat,
        { role: 'user', content: userMessage }
    ];

    try {
        const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'llama-3.1-8b-instant',
            messages,
            max_tokens: 250,
            temperature: 0.9
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 12000
        });

        const reply = res.data.choices[0].message.content.trim();
        addToChat(jid, 'user', userMessage);
        addToChat(jid, 'assistant', reply);
        return reply;
    } catch (err) {
        console.error('[CODEX-LittleBot]', err.message);
        return "Oopsie... brain obfuscation 😅 Ask again pls 🤧?";
    }
}

// ── Main Command: .chat ────────────────────────────────────────
module.exports.chat = {
    usage: ['chat'],
    alias: ['littlebot', 'bot', 'lb'],
    desc: 'Chat with LittleBot — your fun mini AI',
    category: 'fun',
    emoji: '🚀',
    async execute(sock, m, args) {
        const message = args.join(' ').trim();
        if (!message) {
            return await sock.sendMessage(m.key.remoteJid, {
                text: `✦ **CODEX LittleBot**\n\nJust talk to me:\n• .chat [message]\n\n**Settings:**\n• .chatmode on/off\n• .chatclear`
            }, { quoted: m });
        }

        await sock.sendMessage(m.key.remoteJid, { react: { text: '🤔', key: m.key } });
        await sock.sendPresenceUpdate('composing', m.key.remoteJid);

        const botReply = await getLittleBotReply(m.key.remoteJid, message);
        
        await sock.sendMessage(m.key.remoteJid, {
            text: `🤖 **LittleBot**\n${botReply}`
        }, { quoted: m });

        await sock.sendMessage(m.key.remoteJid, { react: { text: '✅', key: m.key } });
    }
};

// ── Auto-reply toggle ──────────────────────────────────────────
module.exports.chatmode = {
    usage: ['chatmode'],
    desc: 'Toggle LittleBot auto-reply in this chat',
    category: 'fun',
    emoji: '⚡',
    async execute(sock, m, args) {
        const action = args[0]?.toLowerCase();
        if (!['on', 'off'].includes(action)) {
            const status = isModeOn(m.key.remoteJid) ? 'ON 🟢' : 'OFF 🔴';
            return await sock.sendMessage(m.key.remoteJid, {
                text: `✦ **CODEX Auto Mode**\n\nCurrent Status: ${status}\n\nUse **.chatmode on** to enable auto-replies.`
            }, { quoted: m });
        }

        const enable = action === 'on';
        setMode(m.key.remoteJid, enable);
        
        await sock.sendMessage(m.key.remoteJid, { react: { text: enable ? '✅' : '🔴', key: m.key } });
        await sock.sendMessage(m.key.remoteJid, {
            text: enable ? '✦ **CODEX LittleBot**\nAuto mode active 🔥 I\'ll reply to everything!' : '✦ **CODEX LittleBot**\nAuto mode disabled.'
        }, { quoted: m });
    }
};

// ── Clear history ──────────────────────────────────────────────
module.exports.chatclear = {
    usage: ['chatclear', 'chatreset'],
    desc: 'Reset LittleBot conversation',
    category: 'fun',
    emoji: '🗑️',
    async execute(sock, m) {
        clearChat(m.key.remoteJid);
        await sock.sendMessage(m.key.remoteJid, { react: { text: '✅', key: m.key } });
        await sock.sendMessage(m.key.remoteJid, { text: '✦ **CODEX LittleBot**\nChat history cleared. Fresh start! 🤧' }, { quoted: m });
    }
};

// ── Auto-reply handler ──────────────────────────────────────────
module.exports.handleChatAutoReply = async (sock, m) => {
    if (!m.text || m.key.fromMe || !isModeOn(m.key.remoteJid)) return;
    if (m.text.length < 5) return;

    try {
        await sock.sendPresenceUpdate('composing', m.key.remoteJid);
        const replyText = await getLittleBotReply(m.key.remoteJid, m.text);
        await sock.sendMessage(m.key.remoteJid, { text: `🤖 **LittleBot**\n${replyText}` }, { quoted: m });
    } catch (err) {
        console.error('[CODEX-LittleBot Auto]', err.message);
    }
};


                
