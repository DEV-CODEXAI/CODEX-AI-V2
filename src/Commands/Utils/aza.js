
const fs = require('fs');

module.exports = {
  name: 'aza',
  alias: ['account', 'bank'],
  category: 'utils',
  desc: 'Interactive bank account setup and display',
  execute: async (sock, m, { args, reply, prefix }) => {
    const dbPath = './database.json';
    
    // 1. INITIALIZE DATABASE
    if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, JSON.stringify({ aza: {} }, null, 2));
    let db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    if (!db.aza) db.aza = {};

    const user = m.sender;
    const input = args[0]?.toLowerCase();

    // 2. CLEAR / RESET LOGIC
    if (input === 'clear' || input === 'reset') {
      delete db.aza[user];
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
      return reply('*𝐀𝐙𝐀_𝐑𝐄𝐒𝐄𝐓*\n\n*> 📊 STATUS:* *CREDENTIALS_PURGED*');
    }

    // 3. SET LOGIC (Supports both Direct and Interactive)
    if (input === 'set') {
      let bank, no, acc;
      const rawArgs = args.slice(1).join(" ");

      // Check for Direct Format: .aza set bank: Bank no: 000 acc: Name
      if (rawArgs.includes('bank:') && rawArgs.includes('no:') && rawArgs.includes('acc:')) {
        bank = rawArgs.match(/bank:\s*([^\n]+?)(?=\s+no:|\s+acc:|$)/i)?.[1]?.trim();
        no = rawArgs.match(/no:\s*([^\n]+?)(?=\s+acc:|$)/i)?.[1]?.trim();
        acc = rawArgs.match(/acc:\s*([^\n]+)/i)?.[1]?.trim();
      } 

      if (bank && no && acc) {
        db.aza[user] = { bank: bank.toUpperCase(), no, acc: acc.toUpperCase() };
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        return reply(`*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✅ BANK CREDENTIALS SAVED*\n *USE: ${prefix}aza TO SEE YOUR ACCOUNT CREDENTIALS*`);
      } else {
        // Interactive fallback for bots without getResponse
        return reply(`*𝐀𝐙𝐀_𝐅𝐎𝐑𝐌𝐀𝐓*\n\n*✘ INVALID_FORMAT*\n *USE: \n*${prefix}aza set bank: OPAY no: 7019135989 acc: CODEX BANK*`);
      }
    }

    // 4. DISPLAY LOGIC
    const ac = db.aza[user];
    if (!ac) {
      return reply(`*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: NO_DATA_FOUND*\n *USE: ${prefix}aza set bank: OPAY no: 7019135989 acc: CODEX BANK*`);
    }

    // Clean CODEX Output
    const output = 
  `*𝐀𝐂𝐂𝐎𝐔𝐍𝐓_𝐃𝐄𝐓𝐀𝐈𝐋𝐒*

 🏦 *𝐁𝐀𝐍𝐊:* *${ac.bank}*
 🔢 *𝐍𝐔𝐌𝐁𝐄𝐑:* *${ac.no}*
 👤 *𝐍𝐀𝐌𝐄:* *${ac.acc}*

 🛡️ *STATUS*: *ACCOUNT_VERIFIED, YOU ARE PERMITTED AND SAFE TO PROCEED WITH PAYMENTS*
*NOTE*: *YOU NEED TO SCREENSHOT THE PAYMENT SLIP OR SHARE AS PDF OR IMAGE FOR VERIFICATION*`;

    reply(output);
  }
};






    
