const { getCollection } = require("../db/index.js");
const moment = require("moment");

const log = async (msg, bot) => {
  const from = msg.from.id;
  const chatId = msg.chat.id;

  const users = await getCollection("pipisa").find({ chatId }).toArray();

  const getName = (id) => users.find((u) => u.id === id).name;
  const logsFrom = [
    ...(await getCollection("logs").find({ from, chat: chatId }).toArray()),
    ...(await getCollection("logs").find({ to: from, chat: chatId }).toArray()),
  ];
  logsFrom.sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  );
  let userSize = (await getCollection("pipisa").findOne({ chatId, id: from }))
    .size;

  const result = [
    `История измениния пиписьки <b>${msg.from.first_name}</b>\n`,
    ...logsFrom.slice(0, 20).map((l) => {
      const getEmoji = (damage) => {
        if (damage > 0) return "✅";
        if (damage < 0) return "❌";
        return "🤷";
      };
      console.log(userSize, l.damage);
      if (!l.to) {
        userSize -= l.damage;
        return `${getEmoji(l.damage)} [<i>${moment(l.time).format("DD.MM.YYYY HH:mm")}</i>] Писька нарощена на <b>${l.damage} см.</b> "${userSize} ⟶ ${userSize + l.damage}"`;
      }

      if (l.from === from) {
        userSize -= l.damage;
        return `${getEmoji(l.damage)} [<i>${moment(l.time).format("DD.MM.YYYY HH:mm")}</i>] Ты напал на <b>${getName(l.to)}</b> - результат <b>${l.damage} см.</b> "${userSize} ⟶ ${userSize + l.damage}"`;
      }
      userSize += l.damage;

      return `${getEmoji(-l.damage)} [<i>${moment(l.time).format("DD.MM.YYYY HH:mm")}</i>] На тебя напал <b>${getName(l.from)}</b> - результат <b>${-l.damage} см.</b> "${userSize} ⟶ ${userSize - l.damage}"`;
    }),
  ].join("\n");

  return bot.sendMessage(chatId, result, { parse_mode: "HTML" });
};

module.exports = log;
