
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




