const startHandler = async (msg, bot)=> {
    await bot.sendMessage(msg.chat.id, `Привет ${msg.from.first_name} я пиписька бот, хочешь нарастить пиписька пиши /dick`);
}

module.exports = startHandler;
