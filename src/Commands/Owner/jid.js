
const axios = require('axios');

module.exports = {
    name: 'jid',
    alias: ['getjid', 'id', 'whois', 'getid'],
    desc: 'Extract JID from user, group, channel, or URL',
    category: 'Utility',
    usage: '.jid [reply/mention/url] or .jid in group/channel',
    reactions: {
        start: '🔍',
        success: '🐾'
    },

    execute: async (sock, m, { args, prefix, reply, isGroup, isChannel }) => {
        
        let targetJid = null;
        let targetType = 'Unknown';
        let extraInfo = {};

        // Method 1: Check quoted message
        if (m.quoted && m.quoted.sender) {
            targetJid = m.quoted.sender;
            targetType = 'Quoted User';
            extraInfo.quotedMsg = m.quoted.mtype || 'message';
        }
        
        // Method 2: Check mentioned users
        else if (m.mentionedJid && m.mentionedJid.length > 0) {
            targetJid = m.mentionedJid[0];
            targetType = 'Mentioned User';
            if (m.mentionedJid.length > 1) {
                extraInfo.totalMentions = m.mentionedJid.length;
            }
        }
        
        // Method 3: Check if command has args (URL or number)
        else if (args && args.length > 0) {
            const input = args.join(' ').trim();
            
            const waUrlMatch = input.match(/(?:https?:\/\/)?(?:chat\.whatsapp\.com\/|whatsapp\.com\/channel\/)?([a-zA-Z0-9_-]{20,})/);
            const waMeMatch = input.match(/(?:https?:\/\/)?wa\.me\/(\d+)/);
            const waNumberMatch = input.match(/(?:https?:\/\/)?api\.whatsapp\.com\/send\?phone=(\d+)/);
            
            if (waUrlMatch) {
                const code = waUrlMatch[1];
                try {
                    const groupInfo = await sock.groupGetInviteInfo(code).catch(() => null);
                    if (groupInfo) {
                        targetJid = groupInfo.id;
                        targetType = 'Group (from invite)';
                        extraInfo.groupName = groupInfo.subject;
                        extraInfo.participants = groupInfo.size;
                    } else {
                        targetJid = `${code}@newsletter`;
                        targetType = 'Channel (from invite)';
                    }
                } catch {
                    targetJid = `${code}@g.us`;
                    targetType = 'Group/Channel (from invite)';
                }
            }
            else if (waMeMatch || waNumberMatch) {
                const number = (waMeMatch || waNumberMatch)[1];
                targetJid = `${number}@s.whatsapp.net`;
                targetType = 'User (from wa.me)';
            }
            else if (input.includes('@')) {
                targetJid = input;
                targetType = 'Direct JID';
            }
            else if (/^\d+$/.test(input)) {
                targetJid = `${input}@s.whatsapp.net`;
                targetType = 'User (from number)';
            }
        }
        
        // Method 4: Current chat (group/channel)
        else if (isGroup && m.chat) {
            targetJid = m.chat;
            targetType = 'Current Group';
            try {
                const meta = await sock.groupMetadata(m.chat);
                extraInfo.name = meta.subject;
                extraInfo.participants = meta.participants.length;
                extraInfo.owner = meta.owner;
            } catch {}
        }
        
        // Method 5: Current channel
        else if (isChannel && m.chat) {
            targetJid = m.chat;
            targetType = 'Current Channel';
        }
        
        // Method 6: Sender themselves
        else if (m.sender) {
            targetJid = m.sender;
            targetType = 'Yourself';
        }

        if (!targetJid) {
            return reply(
                `✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n` +
                `✘ 𝘾𝙤𝙪𝙡𝙙 𝙣𝙤𝙩 𝙚𝙭𝙩𝙧𝙖𝙘𝙩 𝙅𝙄𝘿\n\n` +
                `𝙐𝙨𝙖𝙜𝙚:\n` +
                `• ${prefix}𝙟𝙞𝙙 *(𝙞𝙣 𝙜𝙧𝙤𝙪𝙥/𝙘𝙝𝙖𝙣𝙣𝙚𝙡)*\n` +
                `• ${prefix}𝙟𝙞𝙙 @𝙪𝙨𝙚𝙧 *(𝙢𝙚𝙣𝙩𝙞𝙤𝙣)*\n` +
                `• ${prefix}𝙟𝙞𝙙 *(𝙧𝙚𝙥𝙡𝙮 𝙩𝙤 𝙢𝙚𝙨𝙨𝙖𝙜𝙚)*\n` +
                `• ${prefix}𝙟𝙞𝙙 𝙝𝙩𝙩𝙥𝙨://𝙘𝙝𝙖𝙩.𝙬𝙝𝙖𝙩𝙨𝙖𝙥𝙥.𝙘𝙤𝙢/𝙭𝙭𝙭\n` +
                `• ${prefix}𝙟𝙞𝙙 𝙝𝙩𝙩𝙥𝙨://𝙬𝙝𝙖𝙩𝙨𝙖𝙥𝙥.𝙘𝙤𝙢/𝙘𝙝𝙖𝙣𝙣𝙚𝙡/𝙭𝙭𝙭\n` +
                `• ${prefix}𝙟𝙞𝙙 𝙝𝙩𝙩𝙥𝙨://𝙬𝙖.𝙢𝙚/1234567890`
            );
        }

        const cleanJid = targetJid.split(':')[0]; 
        const number = cleanJid.split('@')[0];
        
        let serverType = 'Unknown';
        if (cleanJid.endsWith('@s.whatsapp.net')) serverType = 'User/Personal';
        else if (cleanJid.endsWith('@g.us')) serverType = 'Group';
        else if (cleanJid.endsWith('@newsletter')) serverType = 'Channel/Newsletter';
        else if (cleanJid.endsWith('@broadcast')) serverType = 'Status/Broadcast';
        else if (cleanJid.includes('@')) serverType = cleanJid.split('@')[1];

        let displayName = number;
        try {
            const contact = sock.store?.contacts?.get?.(cleanJid);
            if (contact?.notify) displayName = contact.notify;
            else if (contact?.name) displayName = contact.name;
            else {
                const fetched = await sock.getName(cleanJid);
                if (fetched && fetched !== cleanJid) displayName = fetched;
            }
        } catch {}

        let response = `╔═══〔 ❍ 𝙅𝙄𝘿 𝞢𝙓𝙏𝙍𝞐𝘾𝙏𝞗𝙍 ❍ 〕═══❒\n`;
        response += `║╭───────────────◆\n`;
        response += `║│ 🔍 𝙏𝙮𝙥𝙚: ${targetType}\n`;
        response += `║│ 📁 𝘾𝙖𝙩𝙚𝙜𝙤𝙧𝙮: ${serverType}\n`;
        response += `║│\n`;
        response += `║│ 🔢 𝙉𝙪𝙢𝙗𝙚𝙧: ${number}\n`;
        response += `║│ 🆔 𝙁𝙪𝙡𝙡 𝙅𝙄𝘿:\n`;
        response += `║│ \`\`\`${cleanJid}\`\`\`\n`;
        
        if (displayName !== number) {
            response += `║│ 👤 𝙉𝙖𝙢𝙚: ${displayName}\n`;
        }
        
        if (extraInfo.name) {
            response += `║│ 🏷️ 𝙏𝙞𝙩𝙡𝙚: ${extraInfo.name}\n`;
        }
        if (extraInfo.participants) {
            response += `║│ 👥 𝙈𝙚𝙢𝙗𝙚𝙧𝙨: ${extraInfo.participants}\n`;
        }
        if (extraInfo.owner) {
            response += `║│ 👑 𝞗𝙬𝙣𝙚𝙧: ${extraInfo.owner.split('@')[0]}\n`;
        }
        if (extraInfo.totalMentions) {
            response += `║│ 📢 𝙏𝙤𝙩𝙖𝙡 𝙈𝙚𝙣𝙩𝙞𝙤𝙣𝙨: ${extraInfo.totalMentions}\n`;
        }
        
        response += `║╰───────────────◆\n`;
        response += `╚══════════════════❒\n`;
        response += ` ╰─ 𓄄 \`\`\`𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\`\`\``;

        await sock.sendMessage(m.chat, {
            text: response,
            contextInfo: {
                externalAdReply: {
                    title: '𝙅𝙄𝘿 𝞢𝙓𝙏𝙍𝞐𝘾𝙏𝞢𝘿',
                    body: number,
                    renderLargerThumbnail: false
                }
            },
            buttons: [
                {
                    buttonId: 'copy',
                    buttonText: { displayText: '📋 𝘾𝙤𝙥𝙮 𝙅𝙄𝘿' },
                    type: 1,
                    nativeFlowInfo: {
                        name: 'cta_copy',
                        paramsJson: JSON.stringify({
                            display_text: '📋 𝘾𝙤𝙥𝙮 𝙅𝙄𝘿',
                            copy_code: cleanJid
                        })
                    }
                }
            ],
            headerType: 1
        }, { quoted: m });
    }
};


