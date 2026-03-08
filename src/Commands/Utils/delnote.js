
module.exports = {
  name: 'delnote',
  alias: ['removenote', 'dn'],
  category: 'utilities',
  desc: 'Permanently delete a note from the database',
  execute: async (sock, m, { args, reply }) => {
    // 1. ACCESS DATABASE
    global.db = global.db || { notes: {} };
    const noteName = args[0]?.toLowerCase();

    // 2. CHECK IF NOTE EXISTS
    if (!noteName) {
      return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ USAGE ERROR: NAME_REQUIREmD*\n*> USE: .delnote [Name]*');
    }

    if (!global.db.notes[noteName]) {
      return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: NOTE_NOT_FOUND_IN_DATABASE*');
    }

    // 3. WIPE DATA
    delete global.db.notes[noteName];

    // 4. COMMIT WIPE TO DISK (PERMANENT)
    if (typeof global.saveDb === 'function') global.saveDb();

    // 5. CLEAN BOLD OUTPUT (NO BOXES)
    const deleteMsg = 
`*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈 : 𝐍𝐎𝐓𝐄_𝐃𝐄𝐋𝐄𝐓𝐄𝐃*

📁 *TARGET*: *${noteName.toUpperCase()}*
🕒 *TIME*: *${new Date().toLocaleTimeString('en-GB', { timeZone: 'Africa/Lagos' })}*
🛡️ *STATUS*: *FILE_PERMANENTLY_PURGED*

*𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*`;

    reply(deleteMsg);
  }
};




