
module.exports = {
  name: 'allnotes',
  alias: ['notes', 'listnotes', 'lsn'],
  category: 'utilities',
  desc: 'List all permanently saved notes',
  execute: async (sock, m, { reply }) => {
    // 1. ACCESS DATABASE
    global.db = global.db || { notes: {} };
    const noteNames = Object.keys(global.db.notes);

    // 2. CHECK IF DATABASE IS EMPTY
    if (noteNames.length === 0) {
      return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: DATABASE_EMPTY*\n*> No notes found on disk.*');
    }

    // 3. GENERATE BOLD LIST (NO BOXES)
    let listMsg = `*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈 : 𝐀𝐋𝐋_𝐒𝐀𝐕𝐄𝐃_𝐍𝐎𝐓𝐄𝐒*\n\n`;
    
    noteNames.forEach((name, index) => {
      listMsg += `*${index + 1}.* *${name.toUpperCase()}*\n`;
    });

    listMsg += `\n* 📊 *TOTAL_NOTES*: *${noteNames.length}*
🕒 *SYSTEM_TIME*: *${new Date().toLocaleTimeString('en-GB', { timeZone: 'Africa/Lagos' })}*

*𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*`;

    // 4. OUTPUT
    reply(listMsg);
  }
};


