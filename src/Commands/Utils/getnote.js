const fs = require('fs');

module.exports = {
  name: 'getnote',
  alias: ['note', 'readnote', 'gn'],
  category: 'utils',
  desc: 'Retrieve a saved permanent note',
  execute: async (sock, m, { args, reply }) => {
    const dbPath = './database.json';
    const noteName = args[0]?.toLowerCase();

    // 1. SYNC DATABASE
    if (fs.existsSync(dbPath)) {
        global.db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    }

    if (!noteName) {
      return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ USAGE ERROR: NAME_REQUIRED*\n*> USE: .note [Name]*');
    }

    // 2. SAFETY CHECK (Ensures notes object exists)
    if (!global.db || !global.db.notes || !global.db.notes[noteName]) {
      return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: NOTE_NOT_FOUND*');
    }

    const note = global.db.notes[noteName];
    
    // 3. TYPO FIX & UNDEFINED PROTECTION
    // We use (note.author || "UNKNOWN") to stop the "undefined" error
    const authorName = (note.author || "UNKNOWN").toUpperCase(); 

    // 4. CLEAN BOLD OUTPUT
    const output = 
`*📓 NOTE: ${noteName.toUpperCase()}*

*“${note.content}”*

 👤 *SAVED_BY*: *${authorName}*
 🕒 *LOGGED_AT*: *${note.time}*
 💨 *STATUS*: *DATA_RETRIEVED*

*𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*`;
    
    reply(output);
  }
};

