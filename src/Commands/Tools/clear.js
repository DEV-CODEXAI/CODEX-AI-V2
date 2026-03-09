module.exports = {
  name: 'clearchat',
  alias: ['clear', 'wipe'],
  category: 'tools',
  desc: 'Wipe chat then start a new thread with status',
  execute: async (sock, m) => {
    try {
      if (!m.key.fromMe) return; 

      // 1. PERFORM THE WIPE AND WAIT FOR IT TO FINISH
      await sock.chatModify({
        delete: true,
        lastMessages: [{ 
          key: m.key, 
          messageTimestamp: m.messageTimestamp 
        }]
      }, m.chat);

      // 2. THE CRITICAL WAIT
      // We need a short break (2 seconds) to let WhatsApp's server 
      // confirm the chat is GONE before sending a new one.
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 3. SEND THE MESSAGE AS A BRAND NEW SESSION
      // We use sock.sendMessage directly to trigger a new chat entry
      await sock.sendMessage(m.chat, { 
        text: '* 𝐒𝐓𝐀𝐓𝐔𝐒: *𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋*\n*𝐓𝐀𝐑𝐆𝐄𝐓*: *𝐋𝐎𝐂𝐀𝐋_𝐇𝐈𝐒𝐓𝐎𝐑𝐘_𝐂𝐋𝐄𝐀𝐑𝐄𝐃*' 
      });

    } catch (err) {
      console.error("Wipe Logic Error:", err);
    }
  }
};
