const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const moment = require("moment");

const { getCollection } = require("../db/index.js");

const width = 1200; //px
const height = 900; //px
const backgroundColour = "white"; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width,
  height,
  backgroundColour,
});

const anal = async (msg, bot) => {
  const from = msg.from.id;
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, "Начинаю собирать аналитику...", {
    parse_mode: "HTML",
  });

  const users = await getCollection("pipisa").find({ chatId }).toArray();

  const logsFrom = [
    ...(await getCollection("logs").find({ from, chat: chatId }).toArray()),
    ...(await getCollection("logs").find({ to: from, chat: chatId }).toArray()),
  ];
  logsFrom.sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  );
  let userSize = (await getCollection("pipisa").findOne({ chatId, id: from }))
    .size;

  const [xValues, yValues] = logsFrom.slice(0, 30).reduce(
    (acc, item) => {
      const damage = item.from === from ? item.damage : item.damage;
      userSize -= damage;

      return [
        [moment(item.time).format("DD.MM.YYYY HH:mm"), ...acc[0]],
        [userSize + damage, ...acc[1]],
      ];
    },
    [[], []],
  );

  const configuration = {
    type: "line",
    data: {
      labels: xValues,
      datasets: [
        {
          label: msg.from.name,
          data: yValues,
          borderColor: "red",
          fill: false,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "График роста письки",
        },
      },
    },
  };

  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  await bot.sendPhoto(msg.chat.id, image);

  const attakerStats = Object.entries(
    logsFrom
      .slice(0, 30)
      .filter((i) => i.from && i.from !== from)
      .reduce((acc, i) => {
        return {
          ...acc,
          [i.from]: acc[i.from] ? acc[i.from] + i.damage : i.damage,
        };
      }, {}),
  ).reduce((acc, i) => (!acc || acc[1] < i[1] ? i : acc), null);

  const victimrStats = Object.entries(
    logsFrom
      .slice(0, 30)
      .filter((i) => i.to && i.to !== from)
      .reduce((acc, i) => {
        return { ...acc, [i.to]: acc[i.to] ? acc[i.to] + i.damage : i.damage };
      }, {}),
  ).reduce((acc, i) => (!acc || acc[1] < i[1] ? i : acc), null);
  if (!victimrStats[0] || !attakerStats[0]) {
    return;
  }
  const attacker = await getCollection("pipisa").findOne({
    chatId,
    id: +attakerStats[0],
  });
  const victim = await getCollection("pipisa").findOne({
    chatId,
    id: +victimrStats[0],
  });

  return bot.sendMessage(
    chatId,
    `Чаще всего тебя атковал <b><i>${attacker.name}</i></b> в сумме украл <b><i>${attakerStats[1]} см</i></b>.\nЧаще всего ты атковал <b><i>${victim.name}</i></b> в сумме украл <b><i>${victimrStats[1]} см</i></b>`,
    { parse_mode: "HTML" },
  );
};

module.exports = anal;
