const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

module.exports = {
    name: 'x',
    alias: ['run', 'cmd'],
    desc: 'Run shell commands on the server (Admin Only)',
    category: 'owner',
    usage: '.x <command>',
    owner: true,

    execute: async (sock, m, { args, reply }) => {
        const userName = m.pushName || "Owner";

        // 1. Check for input
        if (args.length === 0) {
            let usageMsg = `⚙️ *CODEX SHELL EXECUTOR*\n\n`;
            usageMsg += `Usage: .x <terminal command>\n\n`;
            usageMsg += `*Examples:*\n`;
            usageMsg += `• .x ls\n`;
            usageMsg += `• .x node -v\n`;
            usageMsg += `• .x npm install\n\n`;
            usageMsg += `© *CODEX ADMIN SYSTEM*`;
            return reply(usageMsg);
        }

        const command = args.join(' ');

        // 2. Safety Filter (Blocks dangerous system-killing commands)
        const restricted = [
            'rm -rf', 'sudo rm', 'shutdown', 'reboot', 'mkfs', 
            'poweroff', 'halt', 'del /f', ':(){:|:&};:', 'rd /s'
        ];

        if (restricted.some(word => command.toLowerCase().includes(word))) {
            return reply('✘ *SECURITY ALERT:* Dangerous command blocked for safety.');
        }

        await reply(`⚡ _Running command for ${userName}..._`);

        try {
            // 3. Execute Command
            const { stdout, stderr } = await execPromise(command, {
                cwd: process.cwd(),
                timeout: 60000, // 1 minute limit
                maxBuffer: 1024 * 1024 * 5 // 5MB limit
            });

            let output = '';
            if (stdout.trim()) output += `*STDOUT:*\n\`\`\`${stdout.trim()}\`\`\`\n`;
            if (stderr.trim()) output += `*STDERR:*\n\`\`\`${stderr.trim()}\`\`\`\n`;

            if (!output) output = '```Command executed successfully (no output)```';

            // 4. Handle Long Output (WhatsApp limit)
            if (output.length > 4000) {
                const chunks = output.match(/.{1,4000}/g);
                for (const chunk of chunks) {
                    await reply(chunk);
                }
            } else {
                // Final Codex Result
                let finalRes = `*❍ CODEX SHELL RESULT* ❍\n\n`;
                finalRes += output + `\n`;
                finalRes += `© *CODEX AI SYSTEM*`;
                await reply(finalRes);
            }

        } catch (error) {
            let errorMsg = `❌ *COMMAND FAILED*\n\n`;
            errorMsg += `\`\`\`${error.stderr || error.message || 'Unknown Error'}\`\`\`\n`;
            if (error.code) errorMsg += `\n*Exit Code:* ${error.code}`;
            
            reply(errorMsg);
        }
    }
};
