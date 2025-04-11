const { getCollection } = require('../db/index.js');

const topHandler = async (msg, bot)=> {
    const chatId = msg.chat.id;
    const top = await getCollection('pipisa').find({ chatId: chatId }).sort({ size: -1 }).limit(10).toArray();
    let text = `Топ пиписек в <b><i>${msg.chat.title}</i></b>:\n\n`;
    top.forEach(element => {
        text += `${element.name}  <b><i>${element.size}см.</i></b>\n`
    });

    return bot.sendMessage(chatId, text, { parse_mode: 'HTML' });
}

module.exports = topHandler;