const { getCollection } = require("../../db/index.js");

const createLog = async (from, to, chat, damage) => {
  await getCollection("logs").insertOne({
    chat,
    damage,
    from,
    to,
    time: new Date(),
  });
};

module.exports = createLog;
