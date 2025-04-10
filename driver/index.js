const TelegramBot = require('node-telegram-bot-api');

const routes = {};

const bot = new TelegramBot(process.env.API_KEY_BOT, {

    polling: true
    
});

bot.on("polling_error", err => console.log(err.data.error.message));

bot.on('text', async msg => {
    console.log(msg);

    if (routes[msg.text]) {
        routes[msg.text](msg, bot);
    } else {
        routes['*'](msg, bot);
    }
})

const add = (key, cb) => {
    console.log(`${key} - setted`)
    routes[key] = cb;
}

const setCommands = (commands) => {
    bot.setMyCommands(commands);
}

module.exports = { add, setCommands }