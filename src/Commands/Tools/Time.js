
const moment = require('moment-timezone');

module.exports = {
    name: 'tm',
    alias: ['clock', 'nigtime', 'time'],
    desc: 'Get current Nigerian time with offset',
    category: 'tools',
    usage: '.tm',
    owner: false,

    execute: async (sock, m, { reply }) => {
        try {
            const tz = 'Africa/Lagos';
            const now = moment().tz(tz);
            
            const day = now.format('dddd');
            const date = now.format('Do MMMM');
            const year = now.format('YYYY');
            const time = now.format('HH:mm:ss');
            const offset = now.format('Z'); // This gives +01:00
            const hour = parseInt(now.format('H'));

            let period = '';
            if (hour >= 5 && hour < 12) {
                period = '🌅 Morning';
            } else if (hour >= 12 && hour < 17) {
                period = '☀️ Afternoon';
            } else if (hour >= 17 && hour < 21) {
                period = '🌆 Evening';
            } else {
                period = '🌙 Night';
            }

            let timeMsg = `╔═══〔 ❍ *NIGERIAN TIME* ❍ 〕═❒\n`;
            timeMsg += `║╭───────────────◆\n`;
            timeMsg += `║│ ❍ *DAY:* ${day}\n`;
            timeMsg += `║│ ❍ *DATE:* ${date}\n`;
            timeMsg += `║│ ❍ *YEAR:* ${year}\n`;
            timeMsg += `║│ ❍ *TIME:* ${time}\n`;
            timeMsg += `║│ ❍ *GMT:* ${offset}\n`; 
            timeMsg += `║│ ❍ *PERIOD:* ${period}\n`;
            timeMsg += `║╰───────────────◆\n`;
            timeMsg += `╚══════════════════❒\n`;
            timeMsg += ` ╰─ 🥏 \`\`\`Official System v2.0\`\`\``;

            await reply(timeMsg);

        } catch (err) {
            console.error('[TIME PLUGIN ERROR]', err.message);
            await reply('❌ Could not fetch time right now.');
        }
    }
};


