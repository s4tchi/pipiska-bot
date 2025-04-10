const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { getCollection } = require('../db/index.js');

const width = 800; //px
const height = 600; //px
const backgroundColour = 'white'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour});

const statsHandler = async (msg, bot) => { 
    const chatId = msg.chat.id;
    const top = await getCollection('pipisa').find({ chatId: chatId }).sort({ size: -1 }).toArray();

    const configuration = {
        type: 'pie',
        data: {    
            datasets: [{
                data: top.map((item) => item.size)
            }],
            labels: top.map((item) => item.name)
        },
    }

    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
    await bot.sendPhoto(msg.chat.id, image);
}

module.exports = statsHandler;
