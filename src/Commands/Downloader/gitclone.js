
const axios = require('axios');

module.exports = {
  name: 'gitclone',
  alias: ['git', 'clone'],
  category: 'downloader',
  desc: 'Download a GitHub repository as a ZIP file',
  execute: async (sock, m, { args, reply }) => {
    try {
      // 1. VALIDATE INPUT
      const gitUrl = args[0];
      if (!gitUrl || !gitUrl.includes('github.com')) {
        return reply('* 𝐂𝐎𝐃𝐄𝐗 𝐀𝐈 *\n\n*✘ ERROR: PLEASE PROVIDE A VALID GITHUB LINK*');
      }

      // 2. EXTRACT OWNER AND REPO NAME
      const regex = /github\.com\/([^/]+)\/([^/]+)/;
      const match = gitUrl.match(regex);
      if (!match) return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈 *\n\n*✘ ERROR: INVALID URL STRUCTURE*');

      const owner = match[1];
      const repo = match[2].replace('.git', '');

      // 3. AUTO-DETECT DEFAULT BRANCH (Logic Fix)
      // We fetch repo info first to see if the default branch is 'main' or 'master'
      const repoInfo = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
      const defaultBranch = repoInfo.data.default_branch || 'main';

      reply('*🥏 CLONING REPOSITORY...*');

      // 4. DOWNLOAD ZIP DATA
      const zipUrl = `https://api.github.com/repos/${owner}/${repo}/zipball/${defaultBranch}`;
      const response = await axios.get(zipUrl, {
        responseType: 'arraybuffer',
        headers: { 
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Axios/1.0.0' // GitHub API requires a User-Agent header
        }
      });

      // 5. SEND FILE WITH THE SPECIFIC BOLD CAPTION
      await sock.sendMessage(m.chat, {
        document: Buffer.from(response.data),
        fileName: `${repo}.zip`,
        mimetype: 'application/zip',
        caption: `*DOWNLOADED VIA CODEX AI*`
      }, { quoted: m });

    } catch (error) {
      console.error('GitClone Error:', error.message);
      if (error.response && error.response.status === 404) {
        return reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈 *\n\n*✘ ERROR: REPOSITORY NOT FOUND OR PRIVATE*');
      }
      reply('*𝐂𝐎𝐃𝐄𝐗 𝐀𝐈*\n\n*✘ ERROR: FAILED TO PROCESS CLONE REQUEST*');
    }
  }
};


