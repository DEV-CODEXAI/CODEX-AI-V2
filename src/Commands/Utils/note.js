
module.exports = {
  name: 'addnote',
  alias: ['setnote', 'sn'],
  category: 'utils',
  desc: 'Save a permanent note by replying or typing',
  execute: async (sock, m, { args, reply, pushName }) => {
    // 1. DATA INITIALIZATION
    const noteName = args[0]?.toLowerCase();
    let content = args.slice(1).join(' ');

    // 2. CHECK FOR REPLIED MESSAGE LOGIC
    if (m.quoted) {
      // If you reply to a message, use that text as content
      content = m.quoted.text || m.quoted.caption || content;
    }

    // 3. VALIDATION
    if (!noteName) {
      return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ USAGE ERROR: NAME_REQUIRED*\n*> REPLY TO A MSG:* *.addnote [Name]*\n*> OR TYPE:* *.addnote [Name] [Content]*');
    }

    if (!content) {
      return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: NO_CONTENT_DETECTED*');
    }

    // 4. SAVE TO PERMANENT DATABASE
    global.db = global.db || { notes: {} };
    global.db.notes[noteName] = {
      content: content,
      author: pushName,
      time: new Date().toLocaleTimeString('en-GB', { timeZone: 'Africa/Lagos' })
    };

    // Commit to database.json
    if (typeof global.saveDb === 'function') global.saveDb();

    // 5. CLEAN BOLD OUTPUT (NO BOXES)
    const successMsg = 
`*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈 : 𝐍𝐎𝐓𝐄_𝐒𝐀𝐕𝐄𝐃*

📁 *NAME*: *${noteName.toUpperCase()}*
🕒 *TIME*: *${global.db.notes[noteName].time}*
💨 *STATUS*: *DATABASE_ENTRY_SUCCESS*

*𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*`;

    reply(successMsg);
  }
};




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

