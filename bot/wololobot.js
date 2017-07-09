const discordjs = require("discord.js");
const EventEmitter = require("events").EventEmitter;
const commands = require("./commands/commands.js");
const CommandManager = require("./commands/commandManager.js")

class WololoBot extends EventEmitter {

    /**
     * Create a new WololoBot object
     * @param {Object} options
     * @param {string} options.commandPrefix - The prefix for all commands
     * @param {string} options.statusText - The string displayed as the bot's current game
     * @param {number} options.youtubeBufferSize - The size of the buffer for each youtube playback in bytes
     */
    constructor(options) {
        super();
        this.options = options;
        this.commandManager = new CommandManager(require("./commands/commands.js"));

        this.client = new discordjs.Client({
            apiRequestMethod: 'burst'
        });

        this.client.on("message", function (message) {
            if (!message.author.bot && message.content.startsWith(this.options.commandPrefix)) {
                this.commandManager.execute(message);
            }
            this.emit("message", message);
        }.bind(this));

        this.client.on("ready", function () {
            this.client.user.setPresence({ game: { name: this.options.statusText } });
        }.bind(this));
    }

    login(token) {
        this.client.login(token).then(() => this.emit("login"));
    }

    close() {
        this.client.destroy().then(() => this.emit("close"));
    }
}

module.exports = WololoBot;