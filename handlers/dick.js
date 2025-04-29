const { getCollection } = require('../db/index.js');
const randomAdd = require('../utils/randomAdd.js');
const createLog = require('../services/logger/createLog.js');

const dickHandler = async (msg, bot)=> {
    const from = msg.from.id;
    const chatId = msg.chat.id;
    const addSize = randomAdd();

    const about = await getCollection('pipisa').findOne({ id: from, chatId: chatId });

    if (!about) {
        await getCollection('pipisa').insertOne({ id: from, chatId: chatId, size: addSize > 0 ? addSize : -addSize, lastUpdate: Date.now(), name: msg.from.first_name });
        const allPiski = await getCollection('pipisa').find({ chatId: chatId }).sort({ size: -1 }).toArray();

        allPiski.forEach((item, index) => {
            if (item.id === from) {
                createLog(from, null, chatId, item.size);
                return bot.sendMessage(chatId, `${item.name} увеличил пипиську на ${item.size} см, теперь у тебя ${item.size} см. Ты занимаешь ${index + 1} место в рейтинге`);
            }
        });

        return
    }

    if (new Date(about.lastUpdate).getDate() === new Date().getDate()) {
        const allPiski = await getCollection('pipisa').find({ chatId: chatId }).sort({ size: -1 }).toArray();

        allPiski.forEach((item, index) => {
            if (item.id === from) {
                return bot.sendMessage(chatId, `${msg.from.first_name} ты уже нарастил пипиську сегодня, у тебя ${about.size} см. Ты занимаешь ${index + 1} место в рейтинге`);
            }
        });
        return;
    }

    await getCollection('pipisa').updateOne({ id: from, chatId: chatId }, { $inc: { size: (addSize + about.size) > 0 ? addSize : -addSize }, $set: { lastUpdate: Date.now(), name: msg.from.first_name } });
    const allPiski = await getCollection('pipisa').find({ chatId: chatId }).sort({ size: -1 }).toArray();

    allPiski.forEach((item, index) => {
        if (item.id === from) {
            createLog(from, null, chatId, (addSize + about.size) > 0 ? addSize : -addSize);
            return bot.sendMessage(chatId, `${item.name} увеличил пипиську на ${(addSize + about.size) > 0 ? addSize : -addSize} см, теперь у тебя ${item.size} см. Ты занимаешь ${index + 1} место в рейтинге`);
        }
    });

    return;
}

module.exports = dickHandler;
