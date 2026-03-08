
const fs = require('fs');

module.exports = {
  name: 'getnote',
  alias: ['note', 'readnote', 'gn'],
  category: 'utils',
  desc: 'Retrieve a saved permanent note',
  execute: async (sock, m, { args, reply }) => {
    const dbPath = './database.json';
    const noteName = args[0]?.toLowerCase();

    // 1. RE-SYNC DATABASE (Fixes the "Not Working" issue after restart)
    if (fs.existsSync(dbPath)) {
        global.db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    } else {
        global.db = global.db || { notes: {} };
    }

    // 2. USAGE CHECK
    if (!noteName) {
      return reply('*『 𝐂𝐎𝐃𝐄𝐗 𝐀𝐈 』*\n\n*✘ USAGE ERROR: NAME_REQUIRED*\n*> USE: .note [Name]*');
    }

    // 3. RETRIEVAL LOGIC
    const note = global.db.notes ? global.db.notes[noteName] : null;

    if (!note) {
      return reply('*『 𝐂𝐎𝐃𝐄𝐗 𝐀𝐈 』*\n\n*✘ ERROR: NOTE_NOT_FOUND_IN_DISK*');
    }

    // 4. CLEAN BOLD OUTPUT (NO BOXES)
    const output = 
`*📓 NOTE: ${noteName.toUpperCase()}*

*“${note.content}”*

*> 👤 SAVED_BY:* *${note.author.toUpperCase()}*
*> 🕒 LOGGED_AT:* *${note.time}*
*> 🛡️ STATUS:* *DATA_RETRIEVED*

*𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*`;
    
    reply(output);
  }
};




