module.exports = {
  name: 'getnote',
  alias: ['note', 'readnote', 'gn'],
  category: 'utilities',
  desc: 'Retrieve a saved permanent note',
  execute: async (sock, m, { args, reply }) => {
    // 1. ACCESS PERMANENT DATABASE
    global.db = global.db || { notes: {} };
    const noteName = args[0]?.toLowerCase();

    // 2. USAGE CHECK (John 3:16 style pattern)
    if (!noteName) {
      return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ USAGE ERROR: NAME_REQUIRED*\n*> USE: .note [Name]*\n*> EXAMPLE: .note rules*');
    }

    // 3. DATABASE LOOKUP
    const note = global.db.notes[noteName];

    if (!note) {
      return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: NOTE_NOT_FOUND_IN_DISK*');
    }

    // 4. CLEAN BOLD OUTPUT (NO BOXES)
    const output = 
`*📓 NOTE: ${noteName.toUpperCase()}*

*“${note.content}”*

 👤 *SAVED_BY*: *${note.author.toUpperCase()}*
 🕒 *LOGGED_AT*: *${note.time}*
 💨 *STATUS*: *DATA_RETRIEVED*

*𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*`;
    
    reply(output);
  }
};

