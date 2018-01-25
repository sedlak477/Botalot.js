const { Bot } = require("./bot/bot.js");
const command = require("./bot/command.js");
const log = require("loglevel");

log.info("Creating bot");
let bot = new Bot();

log.info("Registering command managers");
bot.registerCommandManager("!",
    new command.CommandManager(command.parseCommands(
        require("./bot/commandsets/commands.json")
    ))
);
log.info("Command managers registered");

bot.on("error", console.error);
bot.on("login", () => log.info("Logged in"));

if (process.env.DISCORD_API_TOKEN) {
    log.info("Logging in...");
    bot.login(process.env.DISCORD_API_TOKEN);
} else {
    log.error('Error: Environment variable "DISCORD_API_TOKEN" not found!');
    bot.close();
}

var stdin = process.openStdin();

stdin.addListener("data", function (d) {
    let command = d.toString().trim();
    switch (command) {
        case "exit":
            bot.close().then(() => process.exit());
            break;
    }
});