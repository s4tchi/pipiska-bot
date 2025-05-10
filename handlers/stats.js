const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const { getCollection } = require("../db/index.js");
const colorFunction = require("../utils/colorFunction.js");

const width = 1200; //px
const height = 900; //px
const backgroundColour = "white"; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width,
  height,
  backgroundColour,
});

const statsHandler = async (msg, bot) => {
  const chatId = msg.chat.id;
  const top = await getCollection("pipisa")
    .find({ chatId: chatId })
    .sort({ size: -1 })
    .toArray();
  const sum = top.reduce((prev, current) => prev + current.size, 0);

  const configuration = {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: top.map((item) => item.size),
          backgroundColor: colorFunction(top.length),
        },
      ],
      labels: top.map(
        (item) =>
          `${item.name} (${item.size} см. - ${((item.size / sum) * 100).toFixed(2)}%)`,
      ),
    },
    options: {
      plugins: {
        legend: {
          position: "right",
        },
        title: {
          display: true,
          text: "Распределение пиписек",
        },
      },
    },
  };

  const image = await chartJSNodeCanvas.renderToBuffer(configuration);
  await bot.sendPhoto(msg.chat.id, image);
};

module.exports = statsHandler;
