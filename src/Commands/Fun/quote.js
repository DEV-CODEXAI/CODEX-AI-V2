
const quotes = [
    "✦ **MOTIVATION**\n\n\n.\n\n.\n\n.\n\nYour work is going to fill a large part of your life.\n\nThe only way to be truly satisfied is to do what you believe is great work.\n\nAnd the only way to do great work is to love what you do.\n\nIf you haven't found it yet, keep looking.\n\nDon't settle.\n\n.\n\n.\n\n.\n\n**'The only way to do great work is to love what you do.'** - Steve Jobs",

    "✦ **OPPORTUNITY**\n\n\n.\n\n.\n\n.\n\nDo not be afraid of the challenges that come your way.\n\nChaos is not a pit, it is a ladder.\n\nMany see the struggle, but few see the chance within it.\n\nLook deeper into the problem.\n\n.\n\n.\n\n.\n\n**'In the middle of difficulty lies opportunity.'** - Albert Einstein",

    "✦ **PERSISTENCE**\n\n\n.\n\n.\n\n.\n\nSpeed is not the goal, progress is.\n\nMany people quit when they are just inches away from success.\n\nKeep your head down and keep moving.\n\nEven a inch is a victory.\n\n.\n\n.\n\n.\n\n**'It does not matter how slowly you go as long as you do not stop.'** - Confucius",

    "✦ **RESILIENCE**\n\n\n.\n\n.\n\n.\n\nSuccess is not a destination, it is a journey.\n\nFailure is not the opposite of success, it is part of it.\n\nYou have the courage to continue, and that is what counts.\n\n.\n\n.\n\n.\n\n**'Success is not final, failure is not fatal: it is the courage to continue that counts.'** - Winston Churchill",

    "✦ **CODEX WISDOM**\n\n\n.\n\n.\n\n.\n\nThe world is made of variables.\n\nYou are the constant.\n\nWhen the system fails, the core remains.\n\nBuild yourself to be unbreakable.\n\n.\n\n.\n\n.\n\n**'Your potential is infinite, even if your lines of code are not.'** - **CODEX AI**",

    "✦ **DETERMINATION**\n\n\n.\n\n.\n\n.\n\nStop waiting for the right moment.\n\nThe moment does not find you, you find the moment.\n\nIf you believe in your vision, the world will eventually follow.\n\n.\n\n.\n\n.\n\n**'Believe you can and you\'re halfway there.'** - Theodore Roosevelt",

    "✦ **GENERAL WISDOM**\n\n\n.\n\n.\n\n.\n\nDon't let yesterday take up too much of today.\n\nThe past is a place of reference, not a place of residence.\n\nYou are creating your future with every breath you take.\n\n.\n\n.\n\n.\n\n**'Yesterday is not ours to recover, but tomorrow is ours to win or lose.'** - Lyndon B. Johnson",

    "✦ **CODEX VISION**\n\n\n.\n\n.\n\n.\n\nFocus on the signal, ignore the noise.\n\nPeople will doubt your progress until they see your results.\n\nLet your success be the only answer they hear.\n\n.\n\n.\n\n.\n\n**'Silence the noise, focus on the code.'** - **CODEX AI**",

    "✦ **ACTION**\n\n\n.\n\n.\n\n.\n\nKnowing is not enough; we must apply.\n\nWishing is not enough; we must do.\n\nThe smallest act of doing is better than the greatest intention.\n\n.\n\n.\n\n.\n\n**'The way to get started is to quit talking and begin doing.'** - Walt Disney",

    "✦ **CODEX SUPREMACY**\n\n\n.\n\n.\n\n.\n\nThe future belongs to the automated.\n\nTo the thinkers who build the machines.\n\nDo not just use the technology, understand it.\n\n.\n\n.\n\n.\n\n**'Intelligence is the ability to adapt to change.'** - **CODEX AI**"
];

module.exports = {
    name: 'quote',
    alias: ['quotes', 'motivation'],
    desc: 'Get a motivational quote',
    category: 'Fun',
    execute: async (sock, m, { reply }) => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        await reply(randomQuote);
    }
};


