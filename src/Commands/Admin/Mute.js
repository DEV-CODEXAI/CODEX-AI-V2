const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

// Persistent schedules
const SCHEDULE_FILE = path.join(__dirname, '../../../database/mute-schedules.json');

let schedules = [];

try {
    if (fs.existsSync(SCHEDULE_FILE)) {
        schedules = JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8'));
    }
} catch (e) {
    console.error('[MUTE SCHED] Load error:', e.message);
}

function saveSchedules() {
    try {
        fs.mkdirSync(path.dirname(SCHEDULE_FILE), { recursive: true });
        fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(schedules, null, 2));
    } catch (e) {}
}

// Re-schedule on bot start
schedules.forEach(sch => {
    if (sch.once && new Date(sch.time) < Date.now()) return;

    cron.schedule(sch.cron, async () => {
        try {
            if (sch.action === 'mute') {
                await sock.groupSettingUpdate(sch.group, 'announcement');
                await sock.sendMessage(sch.group, { text: '🔇 Group auto-muted (scheduled)' });
            } else if (sch.action === 'unmute') {
                await sock.groupSettingUpdate(sch.group, 'not_announcement');
                await sock.sendMessage(sch.group, { text: '🔊 Group auto-unmuted (scheduled)' });
            }

            if (sch.once) {
                schedules = schedules.filter(s => s.id !== sch.id);
                saveSchedules();
            }
        } catch (e) {
            console.error('[SCHED MUTE]', e);
        }
    });
});

module.exports = {
    name: 'mute',
    alias: ['unmute'],
    desc: 'Mute/unmute group instantly or schedule',
    category: 'group',
    adminOnly: true,
    ownerOnly: false,

    execute: async (sock, m, { args, reply }) => {
        if (!m.isGroup) return reply('🥏 This command works only in groups');

        const groupJid = m.chat;
        const cmd = m.body.toLowerCase().split(/\s+/)[0].slice(1);
        const sub = args[0]?.toLowerCase();

        // ── INSTANT MUTE ────────────────────────────────────────────
        if (cmd === 'mute') {
            if (sub === 'for') {
                const timeArg = args[1];
                const match = timeArg?.match(/^(\d+)(s|m|h|d|w)$/i);

                if (!match) {
                    return reply('🥏 _*Use:*_ `.mute for 15m | 2h | 1d | 10s | 2w` 🥏');
                }

                const amount = parseInt(match[1]);
                const unit = match[2].toLowerCase();

                const multipliers = {
                    s: 1000,
                    m: 60000,
                    h: 3600000,
                    d: 86400000,
                    w: 604800000
                };

                const duration = amount * multipliers[unit];

                if (duration > 60 * 24 * 60 * 60 * 1000) {
                    return reply('🥏 _*Maximum mute duration is 60 days*_🥏');
                }

                await sock.groupSettingUpdate(groupJid, 'announcement');
                reply(`🔇 Group muted for ${amount}${unit} (${duration / 60000} minutes)`);

                if (global.muteTimers?.[groupJid]) clearTimeout(global.muteTimers[groupJid]);

                global.muteTimers = global.muteTimers || {};
                global.muteTimers[groupJid] = setTimeout(async () => {
                    await sock.groupSettingUpdate(groupJid, 'not_announcement');
                    await sock.sendMessage(groupJid, { text: '🔊 Group auto-unmuted' });
                    delete global.muteTimers[groupJid];
                }, duration);

                return;
            }

            if (sub === 'sch') {
                await reply(
                    `⏱️ *Mute Scheduler*\n\n` +
                    `Reply with:\n` +
                    `1. Time (e.g. 7pm)\n` +
                    `2. Duration (e.g. 8 hours)\n` +
                    `3. once or daily\n\n` +
                    `Example reply: 7pm 8 hours daily`
                );
                return;
            }

            // New: .mute from 12pm to 5am daily
            if (sub === 'from') {
                const startTime = args[1]; // e.g. 12pm
                const toWord = args[2];    // should be "to"
                const endTime = args[3];   // e.g. 5am
                const repeat = args[4]?.toLowerCase() || 'daily';

                if (!startTime || !endTime || toWord !== 'to') {
                    return reply('🥏 Use: `.mute from 12pm to 5am daily` or `once`');
                }

                // Parse times to cron format (24h)
                const startCron = timeToCron(startTime);
                const endCron = timeToCron(endTime);

                if (!startCron || !endCron) {
                    return reply('🥏 Invalid time format. Use: 12pm, 5am, 17:00, etc.');
                }

                const scheduleId = `${groupJid}-mute-${Date.now()}`;

                // Schedule mute at start time
                schedules.push({
                    id: scheduleId + '-start',
                    group: groupJid,
                    cron: startCron,
                    action: 'mute',
                    repeat: repeat === 'daily' ? true : false,
                    once: repeat !== 'daily',
                    time: startTime
                });

                // Schedule unmute at end time
                schedules.push({
                    id: scheduleId + '-end',
                    group: groupJid,
                    cron: endCron,
                    action: 'unmute',
                    repeat: repeat === 'daily' ? true : false,
                    once: repeat !== 'daily',
                    time: endTime
                });

                saveSchedules();

                reply(
                    `⏱️ *Mute Schedule Set!*\n\n` +
                    `• Mute at: ${startTime} every day\n` +
                    `• Unmute at: ${endTime} every day\n` +
                    `• Repeat: ${repeat}\n\n` +
                    `Use .cancel schedule to remove`
                );

                return;
            }

            // Normal instant mute
            await sock.groupSettingUpdate(groupJid, 'announcement');
            return reply('🔇 Group muted — only the group administrators can send messages');
        }

        // ── INSTANT UNMUTE ──────────────────────────────────────────
        if (cmd === 'unmute') {
            if (global.muteTimers?.[groupJid]) {
                clearTimeout(global.muteTimers[groupJid]);
                delete global.muteTimers[groupJid];
            }

            await sock.groupSettingUpdate(groupJid, 'not_announcement');
            return reply('🔊 Group unmuted — Everyone is now allowed to communicate in the group chat ');
        }

        // ── CANCEL SCHEDULE ─────────────────────────────────────────
        if (cmd === 'cancel' && sub === 'schedule') {
            schedules = schedules.filter(s => s.group !== groupJid);
            saveSchedules();
            reply('🗑️ All mute schedules for this group cancelled');
            return;
        }

        reply('🥏 Invalid mute command\nUse: .mute | .unmute | .mute for <time> | .mute sch | .mute from <start> to <end> <daily/once> | .cancel schedule');
    }
};

// Helper: convert 12pm → cron (* 12 * * *)
function timeToCron(timeStr) {
    const match = timeStr.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)?$/i);
    if (!match) return null;

    let hour = parseInt(match[1]);
    const min = match[2] ? parseInt(match[2]) : 0;
    const period = match[3]?.toLowerCase();

    if (period === 'pm' && hour < 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;

    if (hour < 0 || hour > 23 || min < 0 || min > 59) return null;

    return `${min} ${hour} * * *`; // min hour day month weekday
}
