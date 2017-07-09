const idoiabot = require("./index.js");

const bot = new idoiabot.Bot();

bot.on("login", () => console.log("Logged in"));

if (process.env.DISCORD_API_TOKEN) {
    bot.login(process.env.DISCORD_API_TOKEN);
} else {
    console.error('Error: Environment variable "DISCORD_API_TOKEN" not found!');
}

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
    if (d.toString().trim() == "exit") {
        bot.close();
        process.exit();
    }
});