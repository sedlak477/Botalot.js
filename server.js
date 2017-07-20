const idoiabot = require("./bot/idoiabot.js");
const command = require("./bot/command.js");

let bot = new idoiabot.Bot();

bot.on("error", (err) => console.error("" + err));
bot.on("login", () => console.log("Logged in"));

if (process.env.DISCORD_API_TOKEN) {
    bot.login(process.env.DISCORD_API_TOKEN);
} else {
    console.error('Error: Environment variable "DISCORD_API_TOKEN" not found!');
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