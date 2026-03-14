const { PDFDocument } = require('pdf-lib');

module.exports = {
    name: 'pdf',
    alias: ['topdf', 'imgtopdf', 'pdf'],
    category: 'tools',
    desc: 'Build multi-page PDF (add images one by one)',
    reactions: { start: '📃', success: '📂' },

    execute: async (conn, m, { args, reply, prefix }) => {
        try {
            if (!global.pdfQueue) global.pdfQueue = {};
            
            const senderId = m.sender;
            if (!global.pdfQueue[senderId]) {
                global.pdfQueue[senderId] = { pages: [] };
            }

            const queue = global.pdfQueue[senderId];
            const cmd = args[0] ? args[0].toLowerCase() : null;

            // --- MENU / USAGE ---
            if (!cmd) {
                let menu = `📄 *PDF Builder*\n\nPages in queue: ${queue.pages.length}\n\n`;
                if (queue.pages.length > 0) {
                    queue.pages.forEach((page, index) => {
                        const type = page.mime.includes('png') ? 'PNG' : 'JPG';
                        menu += `${index + 1}. ${type} image\n`;
                    });
                } else {
                    menu += `🥏 _*Queue is empty!*_ _Add some images first._\n`;
                }
                menu += `\nCommands:\n`;
                menu += `• ${prefix}pdf add → add replied image\n`;
                menu += `• ${prefix}pdf del <number> → remove page\n`;
                menu += `• ${prefix}pdf clear → clear everything\n`;
                menu += `• ${prefix}pdf push → generate & send PDF\n\n`;
                menu += `Reply to an image and use the commands above.`;
                return reply(menu);
            }

            // --- ADD IMAGE TO QUEUE ---
            if (cmd === 'add') {
                const quoted = m.quoted;
                const isImage = quoted && (quoted.mtype === 'imageMessage' || quoted.message?.imageMessage);

                if (!isImage) return reply(`✘ _*Reply to a JPG or PNG image!*_`);

                const buffer = await quoted.download();
                const mime = quoted.mimetype || '';

                if (!mime.includes('jpg') && !mime.includes('jpeg') && !mime.includes('png')) {
                    return reply(`𓄄 _*Only JPG and PNG images are supported.*_`);
                }

                queue.pages.push({ buffer, mime });
                return reply(`✓ _*Page added! ❏ Total pages: ${queue.pages.length}*_`);
            }

            // --- DELETE SPECIFIC PAGE ---
            if (cmd === 'del') {
                const index = parseInt(args[1]);
                if (!index || index < 1 || index > queue.pages.length) {
                    return reply(`🥏 _*Invalid page number! Current pages: ${queue.pages.length}*_`);
                }
                queue.pages.splice(index - 1, 1);
                return reply(`✓ _*Page ${index} removed! Remaining: ${queue.pages.length}*_`);
            }

            // --- CLEAR QUEUE ---
            if (cmd === 'clear') {
                global.pdfQueue[senderId] = { pages: [] };
                return reply(`✦ _*Queue cleared!*_`);
            }

            // --- GENERATE AND SEND PDF ---
            if (cmd === 'push') {
                if (queue.pages.length === 0) return reply(`🥏 _*Queue is empty!*_`);

                const pdfDoc = await PDFDocument.create();

                for (const pageData of queue.pages) {
                    const page = pdfDoc.addPage([595, 842]); // A4 Size
                    let image;

                    if (pageData.mime.includes('jpg') || pageData.mime.includes('jpeg')) {
                        image = await pdfDoc.embedJpg(pageData.buffer);
                    } else {
                        image = await pdfDoc.embedPng(pageData.buffer);
                    }

                    const { width, height } = image;
                    const scale = Math.min(595 * 0.95 / width, 842 * 0.95 / height);
                    const imgW = width * scale;
                    const imgH = height * scale;

                    page.drawImage(image, {
                        x: (595 - imgW) / 2,
                        y: (842 - imgH) / 2,
                        width: imgW,
                        height: imgH
                    });
                }

                const pdfBytes = await pdfDoc.save();
                const finalBuffer = Buffer.from(pdfBytes);
                const fileName = `my-pdf-${Date.now()}.pdf`;

                await conn.sendMessage(m.chat, {
                    document: finalBuffer,
                    mimetype: 'application/pdf',
                    fileName: fileName
                }, { quoted: m });

                global.pdfQueue[senderId] = { pages: [] }; // Reset after sending
                return reply(`🥏 _*PDF with ${queue.pages.length} pages sent!*_`);
            }

            return reply(`❌ Unknown command! Type *${prefix}pdf* to see usage.`);

        } catch (error) {
            console.error('[PDF Error]', error);
            reply('❌ Error: ' + (error.message || 'Failed to process PDF'));
        }
    }
};
