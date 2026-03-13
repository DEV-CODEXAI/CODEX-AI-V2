x## ✦ CODEX AI V2.2.7


<!-- CODEX WA BOT | Modern Profile README  -->

<p align="center">
  <img src="https://crysnovax-media-api.crysnovax.workers.dev/1771948318227-media" alt="CODEX BOT" width="100%">
  <p align="center">
  <a href="https://github.com/DEV-CODEX">
    <img 
      src="https://files.catbox.moe/zke3bj.jpg" 
      alt="CODEX AI V2 - Holographic Neon Circle Logo" 
      width="380" 
      style="
        border-radius: 50%;
        box-shadow: 
          0 0 40px rgba(0, 255, 240, 0.9),
          0 0 80px rgba(0, 255, 240, 0.6),
          inset 0 0 30px rgba(255, 255, 255, 0.4);
        transition: all 0.3s ease;
      "
    />
  </a>
</p>

<p align="center">
  <strong>CODEX AI V2</strong><br>
  <em>Professional WhatsApp Bot • Built by codex</em>
</p>
A modular WhatsApp bot built using Node.js and Baileys — the perfect foundation for my YouTube tutorial series.  
This is a More integrated version of CODEX AI V1.0 with Amazing Customizable features tagging along the much more established WhatsApp bot.
it's completely user friendly and requires less labor compared to V1.0 everything is now sorted for easy access and manipulation 
> codex official 

## 💡 Key Features
- **Dynamic Plugin System**: Simply add .js files for new commands — no complex setup required.
- **Auto-Reload Functionality**: Changes take effect instantly without restarting the bot.
- **Permission Controls**: Built-in support for owner and admin roles to manage access.
- **Organized Command Categories**: Keeps your bot structured and easy to navigate.
- **Essential Tools**: Includes system utilities, media handling, and more.
- **Beginner-Friendly**: Clean, readable code designed for learning and experimentation.

Follow along with the tutorial series: Each episode introduces 1–2 new commands, building your skills step by step.

## 👾 FORK CODEX-AI
    
  <a href="https://github.com/DEV-CODEXAI/CODEX-AI-V2/fork"><img title="CODEX AI" src="https://img.shields.io/badge/FORK-CODEX AI-h?color=blue&style=for-the-badge&logo=stackshare"></a>

## 🧠 Editing Bot Files
Need to modify or customize? Download [MT Manager](https://t.me/codex) for easy file management.

## 👨‍💻 Credits
- **Base Project**: [CODEX](https://t.me/codex)
- **Tutorials & Upgrades**: **CODEX 999**
- **Library**: [Baileys by @codex](https://github.com/DEV-CODEXAI/CODEX-AI-V2/tree/main)

## 📺 Connect & Learn
- **YouTube Channel**: [CODEX](https://youtube.com/@codex)
- **WhatsApp Channel**: [Official Channel](https://whatsapp.com/channel/0029Vb6sMEy96H4VI2w3I50F)

## 🚀 Getting Started
1. Clone the repository: `git clone https://github.com/DEV-CODEXAI/CODEX-AI-V2`
2. Install dependencies: `npm install`
3. Run the bot: `node index.js`
4. Scan the QR code with WhatsApp to connect.

##HOW TO GET CODEX_AI RUNNING ON PANNEL:
USE START UP SCRIPT 
♻️ `create a new file`
paste:
```#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// --- UI CONFIGURATION ---
const styles = {
    border: { top: '╭', topR: '╮', bottom: '╯', bottomL: '╰', v: '│', h: '─' },
    colors: {
        gold: '\x1b[38;5;214m',    // Golden
        brand: '\x1b[38;5;196m',   // Red
        green: '\x1b[38;5;46m',    // Neon Green
        accent: '\x1b[38;5;51m',   // Bright Cyan
        white: '\x1b[37m',
        reset: '\x1b[0m',
        bold: '\x1b[1m'
    }
};

const PROJECT_DIR = 'DEV-CODEXAI';
const REPO_URL = 'https://github.com/DEV-CODEXAI/CODEX-AI-V2.git';
const ENTRY_FILE = 'main.js';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- UI HELPERS ---
function drawBox(title, content = []) {
    const c = styles.colors.gold;
    const width = 50;
    console.log(c + styles.border.top + styles.border.h.repeat(width) + styles.border.topR + styles.colors.reset);
    console.log(c + styles.border.v + styles.colors.bold + `  ${title.padEnd(width - 2)}` + styles.colors.reset + c + styles.border.v + styles.colors.reset);
    console.log(c + '├' + styles.border.h.repeat(width) + '┤' + styles.colors.reset);
    content.forEach(line => {
        console.log(c + styles.border.v + styles.colors.reset + `  ${line.padEnd(width - 2)}` + c + styles.border.v + styles.colors.reset);
    });
    console.log(c + styles.border.bottomL + styles.border.h.repeat(width) + styles.border.bottom + styles.colors.reset);
}

function ask(question) { return new Promise((resolve) => rl.question(question, (a) => resolve(a.trim()))); }

// --- CDX MASTER PROTOCOLS (10 STEPS) ---
async function runCdxProtocols() {
    console.clear();
    const protocols = [
        "INITIATING CODEX MASTER NETHUNTER...",
        "SYNCHRONIZING WITH CODEX CLOUD NODES...",
        "REQUESTING ENCRYPTED ACCESS TO CORE...",
        "VERIFYING CODEX RSA ENCRYPTION KEYS...",
        "ESTABLISHING SECURE MULTI-LAYER TUNNEL...",
        "DECRYPTING SYSTEM MANIFEST...",
        "OPTIMIZING COMPRESSION RATIOS...",
        "BYPASSING SECURITY FIREWALLS...",
        "HANDSHAKING WITH CODEX V2 SERVER...",
        "AUTHORIZED: SECURE CONNECTION ACTIVE..."
    ];

    for (const p of protocols) {
        console.log(`${styles.colors.brand}[CDX]${styles.colors.reset} ${styles.colors.gold}${p}${styles.colors.reset}`);
        await sleep(500);
    }
    
    console.log(`${styles.colors.brand}[CDX]${styles.colors.reset} ${styles.colors.green}CONNECTED SUCCESSFULLY TO CODEX${styles.colors.reset}\n`);
    await sleep(800);
}

// --- CORE REGISTRATION LOGIC ---
async function setupOwnerNumber() {
    const databaseDir = path.join(PROJECT_DIR, 'database');
    const userConfigPath = path.join(databaseDir, 'user-config.json');

    if (fs.existsSync(userConfigPath)) {
        const savedData = JSON.parse(fs.readFileSync(userConfigPath, 'utf8'));
        
        process.stdout.write(`\n${styles.colors.gold}❯ ${styles.colors.bold}My system detected an existing credentials if it's yours type yes. If it's not yours. Stop the server and redeploy.${styles.colors.reset}\n`);
        
        console.log(`\n    ${styles.colors.gold}➤ Owner :${styles.colors.reset} ${styles.colors.white}${savedData.owner.name}${styles.colors.reset}`);
        console.log(`    ${styles.colors.gold}➤ Number:${styles.colors.reset} ${styles.colors.white}${savedData.owner.number}${styles.colors.reset}`);
        console.log(`    ${styles.colors.gold}➤ Bot   :${styles.colors.reset} ${styles.colors.white}${savedData.bot.name}${styles.colors.reset}`);

        let response = await ask(`${styles.colors.gold}  ⤷ ${styles.colors.reset}`);
        if (response.toLowerCase() === 'yes') {
            process.stdout.write(`\n${styles.colors.green}  verified to codex cloud [✓]${styles.colors.reset}\n`);
            await sleep(1000);
            return;
        } else {
            process.exit(0);
        }
    }

    console.clear();
    drawBox('📋 INITIAL CONFIGURATION', [
        `${styles.colors.gold}Please provide the following details to sync${styles.colors.reset}`,
        `${styles.colors.gold}your identity with the CODEX.${styles.colors.reset}`
    ]);

    const fields = [
        { key: 'ownerNumber', label: 'Codex would like to know your owner number, sir.', example: '2347019135989', validator: /^\d{10,15}$/ },
        { key: 'ownerName', label: 'Codex would like to know your owner name.', example: 'CODEX', validator: /.+/ },
        { key: 'botName', label: 'Codex would like to know your preferred bot name.', example: 'CODEX-AI', validator: /.+/ }
    ];

    const answers = {};
    for (const field of fields) {
        process.stdout.write(`\n${styles.colors.gold}❯ ${styles.colors.bold}${field.label}${styles.colors.reset}\n`);
        process.stdout.write(`  ${styles.colors.white}(Example: ${field.example})${styles.colors.reset}\n`);
        let input = await ask(`${styles.colors.gold}  ⤷ ${styles.colors.reset}`);
        while (!field.validator.test(input)) {
            process.stdout.write(`${styles.colors.brand}  ! Invalid input. Try again.${styles.colors.reset}\n`);
            input = await ask(`${styles.colors.gold}  ⤷ ${styles.colors.reset}`);
        }
        answers[field.key] = input;
        
        if (field.key !== 'botName') {
            process.stdout.write(`${styles.colors.gold}» noted.${styles.colors.reset}\n`);
        } else {
            process.stdout.write(`${styles.colors.gold}» Credentials saved [✓].${styles.colors.reset}\n`);
        }
    }

    // --- NEW LOGIC: LIST CREDENTIALS IMMEDIATELY ---
    console.log(`\n${styles.colors.gold}━ SYSTEM SYNC SUMMARY ━${styles.colors.reset}`);
    console.log(`${styles.colors.gold}➤ Owner Name  :${styles.colors.reset} ${styles.colors.white}${answers.ownerName}${styles.colors.reset}`);
    console.log(`${styles.colors.gold}➤ Owner Number:${styles.colors.reset} ${styles.colors.white}${answers.ownerNumber}${styles.colors.reset}`);
    console.log(`${styles.colors.gold}➤ Bot Name    :${styles.colors.reset} ${styles.colors.white}${answers.botName}${styles.colors.reset}`);
    console.log(`${styles.colors.gold}━━━━━━━━━━━━━━━━━━━━━━━${styles.colors.reset}\n`);
    await sleep(2000);

    if (!fs.existsSync(databaseDir)) fs.mkdirSync(databaseDir, { recursive: true });
    fs.writeFileSync(userConfigPath, JSON.stringify({
        owner: { number: answers.ownerNumber, name: answers.ownerName, jid: `${answers.ownerNumber}@s.whatsapp.net` },
        bot: { number: answers.ownerNumber, name: answers.botName, public: false, prefix: "." }
    }, null, 4));
}

async function main() {
    await runCdxProtocols();

    drawBox(`${styles.colors.gold}🚀 CODEX AI V2${styles.colors.reset}`, [
        `${styles.colors.gold}DEPLOYMENT SCRIPT${styles.colors.reset}`,
        '',
        `${styles.colors.gold}CREATED BY CODEX${styles.colors.reset}`
    ]);
    await sleep(8000); 

    if (!fs.existsSync(PROJECT_DIR)) {
        console.log(`\n${styles.colors.accent}  Running: git clone REPOSITORY...${styles.colors.reset}`);
        execSync(`git clone ${REPO_URL} ${PROJECT_DIR}`, { stdio: 'inherit' });
    }

    console.log(`${styles.colors.accent}  Running: npm install...${styles.colors.reset}`);
    execSync('npm install', { cwd: PROJECT_DIR, stdio: 'inherit' });

    await setupOwnerNumber();
    rl.close();

    console.log(`\n${styles.colors.green}🎉 Codex is starting now!${styles.colors.reset}`);
    const child = spawn('node', [ENTRY_FILE], { cwd: PROJECT_DIR, stdio: 'inherit', shell: true });
    child.on('close', (code) => process.exit(code));
}

main().catch(err => {
    console.error(`\n${styles.colors.brand}❌ FAILED: ${err.message}${styles.colors.reset}`);
    process.exit(1);
});
```

`save as index.js`
`run npm start`
REMEMBER TO GO BACK TO YOUR SERVER  AFTER PAIRING WITH WHATSAPP TO VERIFY YOUR CREDENTIALS FOR THE BOT TO WORK

## FREE PANEL:
bot hosting net (https://Bot-hosting.net)
      OR
spaceify (https://spaceify.eu)

For detailed setup and command addition, check the tutorial videos!

> Built by CODEX
---

<div align="center">
  
**© 2026 CODEX AI. Powered by CODEX. All rights reserved.**

Made by codex

---

⭐ **Thank you for visiting my profile!, have a nice day fams ⭐** 
