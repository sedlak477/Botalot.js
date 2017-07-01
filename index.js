const discordjs = require("discord.js");
const commands = require("./commands.js");
const settings = require("./settings.json");

const client = new discordjs.Client({
    apiRequestMethod: 'burst'
});

client.on("ready", function() {
    console.log("WololoBot started");
    client.user.setPresence({game: {name: settings.statusText}});
});

client.on('message', function (message) {
    if (!message.author.bot && message.content.startsWith(settings.commandPrefix)) {
        let args = message.content.split(" ");
        let command = args.shift().slice(settings.commandPrefix.length);
        if (commands[command]) {
            try {
                commands[command].execute(message, args);
            } catch(e) {
                console.error("Error executing command '" + command + "':\n" + e);
            }
        }
    }
});

if (process.env.DISCORD_API_TOKEN) {
    client.login(process.env.DISCORD_API_TOKEN);
} else {
    console.error('Error: Environment variable "DISCORD_API_TOKEN" not found!');
}

const stdin = process.openStdin();
stdin.addListener("data", function(data) {
    if(data.toString().trim() === "exit") {
        client.destroy().then(function() {
            process.exit();
        });
    }
});
