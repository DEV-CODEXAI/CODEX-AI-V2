
const axios = require("axios");

/* ===============================
   WEATHER EMOJI ENGINE
=============================== */

function getWeatherEmoji(weather) {
    const map = {
        Thunderstorm: "⛈️",
        Drizzle: "🌦️",
        Rain: "🌧️",
        Snow: "❄️",
        Mist: "🌫️",
        Smoke: "💨",
        Haze: "🌫️",
        Dust: "🌪️",
        Fog: "🌫️",
        Sand: "🏜️",
        Ash: "🌋",
        Squall: "💨",
        Tornado: "🌪️",
        Clear: "☀️",
        Clouds: "☁️"
    };

    return map[weather] || "🌍";
}

/* ===============================
   EXPORT PLUGIN
=============================== */

module.exports = {
    name: "weather",
    alias: ["wthr", "forecast"],
    category: "tools",
    reactions: {
        start: '⛅',
        success: '✨'
    },

    execute: async (sock, m, { args, reply }) => {
        const city = args.join(" ").trim();
        if (!city) return reply("✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n⚉ 𝙋𝙡𝙚𝙖𝙨𝙚 𝙥𝙧𝙤𝙫𝙞𝙙𝙚 𝙖 𝙘𝙞𝙩𝙮 𝙣𝙖𝙢𝙚.");

        try {
            await sock.sendPresenceUpdate("composing", m.key.remoteJid);

            const API_KEY = "e6926030169752d7e0d85377e489c415";
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

            const { data } = await axios.get(url);
            const emoji = getWeatherEmoji(data.weather[0].main);

            const weatherText = `╔═══〔 ❍ 𝙒𝞢𝘼𝙏𝙃𝞢𝙍 𝙍𝞢𝙎𝙐𝙇𝙏 ❍ ❒
║╭───────────────◆
║│ 📍 𝙇𝙤𝙘𝙖𝙩𝙞𝙤𝙣: ${data.name}, ${data.sys.country}
║│ ${emoji} 𝙎𝙩𝙖𝙩𝙪𝙨: ${data.weather[0].description}
║│
║│ 🌡️ 𝙏𝙚𝙢𝙥: ${data.main.temp}°C
║│ 🤒 𝙁𝙚𝙚𝙡𝙨: ${data.main.feels_like}°C
║│ 💧 𝙃𝙪𝙢𝙞𝙙𝙞𝙩𝙮: ${data.main.humidity}%
║│ 🌬️ 𝙒𝙞𝙣𝙙: ${data.wind.speed} 𝙢/𝙨
║│ 📊 𝙋𝙧𝙚𝙨𝙨𝙪𝙧𝙚: ${data.main.pressure} 𝙝𝙋𝙖
║│
║│ 🌐 𝘾𝙤𝙤𝙧𝙙: ${data.coord.lat}, ${data.coord.lon}
║╰───────────────◆
╚══════════════════❒
 ╰─ 🥏 \`\`\`𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\`\`\``;

            await sock.sendMessage(
                m.key.remoteJid,
                { text: weatherText },
                { quoted: m }
            );

            await sock.sendPresenceUpdate("paused", m.key.remoteJid);

        } catch (error) {
            console.error("Weather Error:", error.response?.data || error.message);
            await reply("✦ 𝘾𝞗𝘿𝞢𝙓 𝘼𝙄\n❌ 𝙐𝙣𝙖𝙗𝙡𝙚 𝙩𝙤 𝙛𝙚𝙩𝙘𝙝 𝙬𝙚𝙖𝙩𝙝𝙚𝙧. 𝘾𝙝𝙚𝙘𝙠 𝙘𝙞𝙩𝙮 𝙣𝙖𝙢𝙚.");
        }
    }
};


