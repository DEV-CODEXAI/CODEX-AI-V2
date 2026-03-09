module.exports = {
  name: 'delete',
  alias: ['del', 'unsend'],
  category: 'admin',
  desc: 'Delete a message by replying to it',
  execute: async (sock, m, { reply }) => {
    try {
      if (!m.quoted) return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: NO_TARGET_FOUND*');

      if (m.isGroup) {
        // 1. FORCE UPDATE METADATA (This fixes the "Not Admin" bug)
        const groupMetadata = await sock.groupMetadata(m.chat);
        const participants = groupMetadata.participants;
        
        // 2. FIND BOT AND SENDER STATUS
        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const isBotAdmin = participants.find(p => p.id === botId)?.admin !== null;
        const isUserAdmin = participants.find(p => p.id === m.sender)?.admin !== null;

        if (!isBotAdmin) return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: BOT_IS_NOT_ADMIN_YET*\n* LOG: TRY MAKING THE BOT AN ADMIN*');
        if (!isUserAdmin) return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: ACCESS_DENIED*\n* LOG: ONLY ADMINS CAN USE THIS*');
      }

      // 3. THE DELETE KEY
      const key = {
        remoteJid: m.chat,
        fromMe: m.quoted.fromMe,
        id: m.quoted.id,
        participant: m.quoted.sender
      };

      // 4. ACTION
      await sock.sendMessage(m.chat, { react: { text: "🧹", key: m.key } });
      return await sock.sendMessage(m.chat, { delete: key });

    } catch (err) {
      console.error(err);
      return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: ACTION_FAILED*');
    }
  }
};
