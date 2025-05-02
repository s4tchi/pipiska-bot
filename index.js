require("dotenv").config();

const { add, setCommands } = require("./driver/index.js");
const { connect } = require("./db/index.js");

setCommands([
  {
    command: "start",
    description: "Запуск бота",
  },
  {
    command: "dick",
    description: "Нарастить пиписю",
  },
  {
    command: "top",
    description: "Топ пиписек",
  },
  {
    command: "stats",
    description: "График писек",
  },
  {
    command: "battle",
    description: "Битва писек",
  },
  {
    command: "log",
    description: "История одной письки",
  },
  {
    command: "anal",
    description: "Писечная аналитика",
  },
]);

add("/dick@polina_by_satchi_bot", require("./handlers/dick.js"));
add("/start@polina_by_satchi_bot", require("./handlers/start.js"));
add("/top@polina_by_satchi_bot", require("./handlers/top.js"));
add("/stats@polina_by_satchi_bot", require("./handlers/stats.js"));
add("/battle@polina_by_satchi_bot", require("./handlers/battle.js"));
add("/log@polina_by_satchi_bot", require("./handlers/log.js"));
add("/anal@polina_by_satchi_bot", require("./handlers/anal.js"));

add("/dick", require("./handlers/dick.js"));
add("/start", require("./handlers/start.js"));
add("/top", require("./handlers/top.js"));
add("/stats", require("./handlers/stats.js"));
add("/battle", require("./handlers/battle.js"));
add("/log", require("./handlers/log.js"));
add("/anal", require("./handlers/anal.js"));

add("*", () => null);

(async () => {
  await connect();
})();
