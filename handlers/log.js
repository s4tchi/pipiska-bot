const { getCollection } = require('../db/index.js');
const moment = require('moment');

const log = async (msg, bot) => {
    const from = msg.from.id;
    const chatId = msg.chat.id;

    const users = await getCollection('pipisa').find({ chatId }).toArray();

    const getName = (id) => users.find(u => u.id === id).name;
    const logsFrom = [...(await getCollection('logs').find({ from, chat: chatId }).toArray()), ... (await getCollection('logs').find({ to: from, chat: chatId }).toArray())].sort((a, b) => a.time > b.time);

    const result = [`История измениния пиписьки <b>${msg.from.first_name}</b>\n`, ...logsFrom.map(l => {
        if (!l.to) {
            return `[<i>${moment(l.time).format('DD.MM.YYYY HH:mm')}</i>] Писька нарощена на <b>${l.damage} см.</b>`;
        }

        if (l.from === from) {
            return `[<i>${moment(l.time).format('DD.MM.YYYY HH:mm')}</i>] Ты напал на <b>${getName(l.to)}</b> - результат <b>${l.damage} см.</b>`;
        }

        return `[<i>${moment(l.time).format('DD.MM.YYYY HH:mm')}</i>] На тебя напал <b>${getName(l.from)}</b> - результат <b>${l.damage} см.</b>`;
    })].join('\n')

    return bot.sendMessage(chatId, result, { parse_mode: 'HTML' });

}

module.exports = log