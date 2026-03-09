const { getDevice } = require('@whiskeysockets/baileys');

module.exports = {
  name: 'device',
  alias: ['getdevice', 'platform'],
  category: 'utils',
  desc: 'Identify the device used to send the message',
  execute: async (sock, m, { reply }) => {
    try {
      // 1. Target the quoted message or the command itself
      const messageId = m.quoted ? m.quoted.id : m.key.id;
      
      // 2. Extract Device Type
      const deviceType = getDevice(messageId);

      // 3. Format Output
      const output = 
  `*𝐃𝐄𝐕𝐈𝐂𝐄_𝐈𝐍𝐅𝐎*

📱 *𝐏𝐋𝐀𝐓𝐅𝐎𝐑𝐌*:*${deviceType.toUpperCase()}*
`;

      return reply(output);

    } catch (e) {
      console.log("Device Cmd Error:", e);
      return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: DETECTION_FAILED*');
    }
  }
};
