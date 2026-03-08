const { createCanvas } = require('canvas');
const os = require('os');

module.exports = {
  name: 'cdxping',
  alias: ['speed'],
  desc: 'Show bot latency with a hacker interface',
  category: 'bot',
  execute: async (sock, m, { reply }) => {
    const ping = Date.now() - m.messageTimestamp * 1000;
    
    // --- UPDATED TIME LOGIC FOR NIGERIA ---
    const options = { timeZone: 'Africa/Lagos', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dateOptions = { timeZone: 'Africa/Lagos', weekday: 'long' };
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-GB', options); // Returns "HH:MM:SS"
    const day = now.toLocaleDateString('en-US', dateOptions);
    // --------------------------------------

    // Canvas Dimensions
    const width = 600;
    const height = 350;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 1. BACKGROUND: Pure pitch black for high contrast
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // 2. TECH SCAN LINES (Subtle horizontal lines)
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < height; i += 4) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // 3. NEON CORNER ACCENTS (Cyberpunk Brackets)
    ctx.strokeStyle = '#00FFFF'; // Cyan
    ctx.lineWidth = 2;
    // Top Left
    ctx.beginPath(); ctx.moveTo(20, 80); ctx.lineTo(20, 20); ctx.lineTo(80, 20); ctx.stroke();
    // Bottom Right
    ctx.strokeStyle = '#FF00FF'; // Magenta
    ctx.beginPath(); ctx.moveTo(580, 270); ctx.lineTo(580, 330); ctx.lineTo(520, 330); ctx.stroke();

    // 4. TOP TITLE: "CODEX AI" DECORATED
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00FFFF';
    ctx.fillStyle = '#00FFFF';
    ctx.font = 'bold 28px Courier New';
    ctx.textAlign = 'center';
    // Adding brackets around the name for "Terminal" feel
    ctx.fillText(' < 𝐂 𝐎 𝐃 𝐄 𝐗  𝐀 𝐈 > ', width / 2, 60);

    // 5. MAIN PING DISPLAY (The "Hacker" Data)
    // Layer 1: Glitch Offset (Red)
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FF0000';
    ctx.font = 'bold 110px Courier New';
    ctx.fillText(`${ping}ms`, (width / 2) - 3, 190);
    // Layer 2: Main Text (White)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`${ping}ms`, width / 2, 190);
    // Layer 3: Cyan Blur
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#00FFFF';
    ctx.fillText(`${ping}ms`, width / 2, 190);

    // 6. DECORATIVE DATA ELEMENTS
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#33FF33'; // Matrix Green
    ctx.font = '14px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText('► SYSTEM: ONLINE', 50, 260);
    ctx.fillText('► SECTOR: C-137', 50, 280);
    
    ctx.textAlign = 'right';
    ctx.fillText('STABILITY: 100%', 550, 260);
    ctx.fillText('LATENCY: STABLE', 550, 280);

    // 7. FOOTER: DATE & TIME
    ctx.textAlign = 'center';
    ctx.fillStyle = '#00FFFF';
    ctx.font = 'bold 22px Courier New';
    const timestamp = `${day.toUpperCase()} // ${timeString}`;
    ctx.fillText(timestamp, width / 2, 320);

    // 8. DATA DECORATION (Floating "bits")
    ctx.globalAlpha = 0.4;
    ctx.font = '10px Courier New';
    ctx.fillStyle = '#00FF00';
    ctx.fillText('01011010 00101101 11010101 01011011', width / 2, 20);
    ctx.fillText('SYS_LOG: SUCCESSFUL_CONNECTION_ESTABLISHED', width / 2, 340);
    ctx.globalAlpha = 1.0;

    const buffer = canvas.toBuffer('image/png');
    
    // Send to WhatsApp
    await sock.sendMessage(m.chat, { 
        image: buffer, 
        caption: `*─── [ 𝐂𝐎𝐃𝐄𝐗 𝐓𝐄𝐑𝐌𝐈𝐍𝐀𝐋 ] ───*\n\n` +
                 `*ʟᴀᴛᴇɴᴄʏ:* \`${ping}ms\`\n` +
                 `*ᴛ𝐢𝐦𝐞:* \`${timeString}\`\n` +
                 `*ᴅᴀʏ:* \`${day}\`\n\n` +
                 `*ꜱᴛᴀᴛᴜꜱ:* \`SYSTEM_OPTIMIZED\`` 
    }, { quoted: m });
  }
};
