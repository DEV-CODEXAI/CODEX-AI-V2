const axios = require('axios');

module.exports = {
  name: 'convert',
  alias: ['currency', 'exch'],
  category: 'tools',
  desc: 'Convert currency using real-time market rates',
  execute: async (sock, m, { args, reply, prefix }) => {
    try {
      // 1. INPUT VALIDATION (Example: .convert 100 USD NGN)
      if (args.length < 2) {
        return reply(`*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈 𝐂𝐔𝐑𝐑𝐄𝐍𝐂𝐘*\n\n*USAGE:* *${prefix}convert [amount] [from] [to]*\n*EXAMPLE*: *${prefix}convert 100 USD NGN*`);
      }

      const amount = parseFloat(args[0]);
      const from = args[1].toUpperCase();
      const to = args[2] ? args[2].toUpperCase() : 'USD';

      if (isNaN(amount)) return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: INVALID_AMOUNT*');

      await sock.sendMessage(m.chat, { react: { text: "💱", key: m.key } });

      // 2. FETCH DATA
      // Using a reliable open-access exchange rate API
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`);
      const rate = response.data.rates[to];

      if (!rate) return reply(`* 𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: INVALID_CURRENCY_CODE*\n* LOG: COULD NOT FIND ${to}*`);

      const result = (amount * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      // 3. FORMATTED OUTPUT
      const output = 
`*𝐄𝐗𝐂𝐇𝐀𝐍𝐆𝐄_𝐑𝐀𝐓𝐄*

*𝐈𝐍𝐏𝐔𝐓:* *${amount.toLocaleString()} ${from}*
*𝐎𝐔𝐓𝐏𝐔𝐓:* *${result} ${to}*

*📊 RATE:* 1 ${from} = "*${rate.toFixed(4)} ${to}*"
*📅 UPDATED:* "*${response.data.date}*"

*CONVERTED VIA CODEX AI*`;

      return reply(output);

    } catch (err) {
      console.error("Currency Error:", err);
      return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: API_OFFLINE*\n*LOG: TRY AGAIN LATER*');
    }
  }
};
