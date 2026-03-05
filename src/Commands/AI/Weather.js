
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
        if (!city) return reply("🥏 ⚉ Please provide a city name.");

        try {

            await sock.sendPresenceUpdate("composing", m.key.remoteJid);

            const API_KEY = "e6926030169752d7e0d85377e489c415";

            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

            const { data } = await axios.get(url);

            const emoji = getWeatherEmoji(data.weather[0].main);

            let weatherText = `╔═══〔 ❍WEATHER REPORT❍ 〕=❒\n`;
            weatherText += `║╭───────────────◆\n`;
            weatherText += `║│ 📍 LOCATION: ${data.name}, ${data.sys.country}\n`;
            weatherText += `║│ ${emoji} CONDITION: ${data.weather[0].description}\n`;
            weatherText += `║│\n`;
            weatherText += `║│ 🌡️ TEMP: ${data.main.temp}°C\n`;
            weatherText += `║│ 🤒 FEELS: ${data.main.feels_like}°C\n`;
            weatherText += `║│ 💧 HUMIDITY: ${data.main.humidity}%\n`;
            weatherText += `║│ 🌬️ WIND: ${data.wind.speed} m/s\n`;
            weatherText += `║│ 📊 PRESSURE: ${data.main.pressure} hPa\n`;
            weatherText += `║│\n`;
            weatherText += `║│ 🌐 COORDS: ${data.coord.lat}, ${data.coord.lon}\n`;
            weatherText += `║╰───────────────◆\n`;
            weatherText += `╚══════════════════❒\n`;
            weatherText += ` ╰─ 𓄄 \`\`\`*powered by codex\`\`\``;

            await sock.sendMessage(
                m.key.remoteJid,
                { text: weatherText },
                { quoted: m }
            );

            await sock.sendPresenceUpdate("paused", m.key.remoteJid);

        } catch (error) {
            console.error("Weather Error:", error.response?.data || error.message);
            await reply("🥏 Unable to fetch weather right now. Check city name.");
        }
    }
};


