const { Bot } = require("./bot/bot.js");
const command = require("./bot/command.js");

let bot = new Bot();

bot.registerCommandManager("!",
    new command.CommandManager(command.parseCommands(
        require("./bot/commandsets/commands.json")
    ))
);

bot.on("error", console.error);
bot.on("login", () => console.log("Logged in"));

if (process.env.DISCORD_API_TOKEN) {
    bot.login(process.env.DISCORD_API_TOKEN);
} else {
    console.error('Error: Environment variable "DISCORD_API_TOKEN" not found!');
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