module.exports = {
    name: 'invite',
    alias: ['grouplink', 'gclink'],
    category: 'group',
    desc: 'Get group invite link with preview',

    execute: async (sock, m, { reply }) => {

        if (!m.isGroup) return reply('✘ Group only')

        try {
            const metadata = await sock.groupMetadata(m.chat)
            const code = await sock.groupInviteCode(m.chat)
            const link = `https://chat.whatsapp.com/${code}`
            const userName = m.pushName || "User";

            // Get group icon URL
            let iconUrl = null
            try {
                iconUrl = await sock.profilePictureUrl(m.chat, 'image')
            } catch {} 

            await sock.sendMessage(
                m.chat,
                {
                    text: `*❍GROUP LINK*❍\n\n${link}\n\n© *CODEX AI SYSTEM*\n_Requested by ${userName}_`,
                    contextInfo: {
                        externalAdReply: {
                            title: metadata.subject,
                            body: "WhatsApp Group Invitation",
                            sourceUrl: link,
                            thumbnailUrl: iconUrl || undefined,
                            mediaType: 1,
                            renderLargerThumbnail: true,
                            showAdAttribution: false
                        }
                    }
                },
                { quoted: m }
            )

        } catch (err) {
            console.log(err)
            reply('✘ Failed to fetch group link. Make sure I am an Admin.')
        }
    }
}
