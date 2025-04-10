const { getCollection } = require('../db/index.js');

const dickHandler = async (msg, bot)=> {
    const from = msg.from.id;
    const chatId = msg.chat.id;
    const addSize = Math.floor(Math.random() * 15 - 5);

    const about = await getCollection('pipisa').findOne({ id: from, chatId: chatId });

    if (!about) {
        await getCollection('pipisa').insertOne({ id: from, chatId: chatId, size: addSize > 0 ? addSize : -addSize, lastUpdate: Date.now(), name: msg.from.first_name });
        return bot.sendMessage(chatId, `${msg.from.first_name} увеличил пипиську на ${addSize > 0 ? addSize : -addSize} см, теперь у тебя ${addSize > 0 ? addSize : -addSize} см`);
    }

    if (new Date(about.lastUpdate).getDate() === new Date().getDate()) {
        return bot.sendMessage(chatId, `${msg.from.first_name} ты уже нарастил пипиську сегодня, у тебя ${about.size} см`);
    }

    await getCollection('pipisa').updateOne({ id: from, chatId: chatId }, { $inc: { size: (addSize + about.size) > 0 ? addSize : -addSize }, $set: { lastUpdate: Date.now(), name: msg.from.first_name } });
    return bot.sendMessage(chatId, `${msg.from.first_name} увеличил пипиську на ${(addSize + about.size) > 0 ? addSize : -addSize} см, теперь у тебя ${addSize + about.size} см`);
}

module.exports = dickHandler;
