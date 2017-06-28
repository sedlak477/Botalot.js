const discordjs = require("discord.js");
const mongoose = require("mongoose");
const models = require("./models.js");
const commands = require("./commands.js");
const settings = require("./settings.json");

const db = mongoose.connect("localhost:27017/wololobot");
const client = new discordjs.Client({
    apiRequestMethod: 'burst'
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
    client.login(process.env.DISCORD_API_TOKEN).then(function(){
        client.user.setPresence({game: {name: settings.statusText}});
        process.on('exit', function(){
            client.destroy();
        });
    });
} else {
    console.error('Error: Environment variable "DISCORD_API_TOKEN" not found!');
}
