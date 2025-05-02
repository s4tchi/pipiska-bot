const { getCollection } = require("../db/index.js");
const randomDamage = require("../utils/randomDamage.js");
const createLog = require("../services/logger/createLog.js");

const battleHandler = async (msg, bot) => {
  const { reply_to_message } = msg;
  const chatId = msg.chat.id;

  if (!reply_to_message) {
    return bot.sendMessage(
      chatId,
      "Напиши в ответ на сообщение обладателя пиписьки /battle, чтобы померяться письками",
      { parse_mode: "HTML" },
    );
  }

  if (reply_to_message.from.id === msg.from.id) {
    return bot.sendMessage(chatId, "Нельзя бить самого себя", {
      parse_mode: "HTML",
    });
  }

  const me = await getCollection("pipisa").findOne({
    id: reply_to_message.from.id,
    chatId: chatId,
  });
  const you = await getCollection("pipisa").findOne({
    id: msg.from.id,
    chatId: chatId,
  });

  if (you.lastAttack && you.lastAttack + 1000 * 60 * 60 * 6 > Date.now()) {
    return bot.sendMessage(
      chatId,
      `Атаковать можно раз в 6 часов, до следующей драки ${6 * 60 - Math.floor((Date.now() - you.lastAttack) / 1000 / 60)} минут`,
      { parse_mode: "HTML" },
    );
  }

  if (!me) {
    return bot.sendMessage(chatId, "У пользователя нет пиписьки", {
      parse_mode: "HTML",
    });
  }

  if (me.size < 5 || you.size < 5) {
    return bot.sendMessage(chatId, "У кого-то маленькая пиписька", {
      parse_mode: "HTML",
    });
  }

  const damage = randomDamage();
  await getCollection("pipisa").updateOne(
    { id: reply_to_message.from.id, chatId: chatId },
    { $inc: { size: -damage } },
  );
  await getCollection("pipisa").updateOne(
    { id: msg.from.id, chatId: chatId },
    { $inc: { size: damage }, $set: { lastAttack: Date.now() } },
  );

  await createLog(msg.from.id, reply_to_message.from.id, chatId, damage);

  if (damage >= 0) {
    return bot.sendMessage(
      chatId,
      "Ты ударил писькой по лбу <b><i>" +
        reply_to_message.from.first_name +
        "</i></b> и забрал себе " +
        damage +
        " см. Теперь у тебя " +
        (you.size + damage) +
        " см, Герой",
      { parse_mode: "HTML" },
    );
  }

  return bot.sendMessage(
    chatId,
    "Ты попытался ударить писькой по лбу <b><i>" +
      reply_to_message.from.first_name +
      "</i></b>, но он был готов и забрал у тебя " +
      -damage +
      " см. Не расстраивайся, у тебя осталось целых " +
      (you.size + damage) +
      ")",
    { parse_mode: "HTML" },
  );
};

module.exports = battleHandler;
