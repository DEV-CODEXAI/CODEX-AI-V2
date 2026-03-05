
// © 2026 CODEX AI V2.0 - All Rights Reserved.

const fs = require('fs');
const path = './database/groupEvents.json';

if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));

module.exports = {
    name: 'events',
    alias: [],
    desc: '🥏 Toggle Group Events System 🥏',
    category: 'group',
    group: true,
    admin: true, 
    owner: true, 

    execute: async (sock, m, { reply }) => {
        try {
            const args = m.body.trim().split(/\s+/);
            const option = args[1]?.toLowerCase();

            const db = JSON.parse(fs.readFileSync(path));
            if (!db[m.chat]) db[m.chat] = { enabled: false, welcome: null, goodbye: null };

            if (!option) {
                let eventText = `╔═══〔 ❍ GROUP EVENTS ❍ 〕═❒\n`;
                eventText += `║╭───────────────◆\n`;
                eventText += `║│ ❍ USAGE:\n`;
                eventText += `║│ .events on | .events off\n`;
                eventText += `║│\n`;
                eventText += `║│ ❍ FEATURES:\n`;
                eventText += `║│ • Premium Welcome Card\n`;
                eventText += `║│ • Goodbye Messages\n`;
                eventText += `║│ • Editable Welcome Text\n`;
                eventText += `║│ • Member Count Display\n`;
                eventText += `║│ • Join Time Display\n`;
                eventText += `║│ • @User Tagging\n`;
                eventText += `║│ • Online Tracker (Future)\n`;
                eventText += `║╰───────────────◆\n`;
                eventText += `╚══════════════════❒\n`;
                eventText += ` ╰─ 🥏 \`\`\`CODEX AI\`\`\``;

                return await reply(eventText);
            }

            if (option === 'on') {
                db[m.chat].enabled = true;
                fs.writeFileSync(path, JSON.stringify(db, null, 2));
                return await reply('✓ *Group Events Enabled Successfully!*🥏');
            }

            if (option === 'off') {
                db[m.chat].enabled = false;
                fs.writeFileSync(path, JSON.stringify(db, null, 2));
                return await reply('✘ *Group Events Disabled!*🥏');
            }

            return await reply('✘ *Invalid option!* Use "on" or "off"𓄄');
        } catch (e) {
            console.error('Events Plugin Error:', e);
            return await reply('✘ *Something went wrong!*🥏');
        }
    }
};


