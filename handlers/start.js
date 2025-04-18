const startHandler = async (msg, bot)=> {
    await bot.sendMessage(msg.chat.id, `Привет ${msg.from.first_name} я пиписька бот, хочешь нарастить пиписька пиши /dick (от -5 до 10)\n\n /battle чтобы померяться писькой (от -5 до 5)`);
}

module.exports = startHandler;
