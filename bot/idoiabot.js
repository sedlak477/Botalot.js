/**
 * @module bot/idoiabot
 */

const discordjs = require("discord.js");
const EventEmitter = require("events").EventEmitter;
const commands = require("./command.js");
const defaults = require("./defaults.json");

class Bot extends EventEmitter {

    /**
     * Create a new Bot object
     * @param {Object} options
     * @param {string} options.statusText - The string displayed as the bot's current game
     */
    constructor(options) {
        options = options || {};
        super();

        /**
         * Command manager
         * @private
         * @type bot/command.CommandManager
         */
        this._commandManager = new commands.CommandManager(commands.commands.map(e => new commands.Command(e)));

        /**
         * Discord.js client
         * @private
         */
        this._client = new discordjs.Client({
            apiRequestMethod: 'burst'
        });

        this._client.on("message", function (message) {
            if (!message.author.bot && message.content.startsWith(options.commandPrefix || defaults.commandPrefix)) {
                this._commandManager.execute(message);
            }
            this.emit("message", message);
        }.bind(this));

        this._client.on("ready", function () {
            this._client.user.setPresence({ game: { name: options.statusText || defaults.statusText || null } });
        }.bind(this));
    }

    login(token) {
        this._client.login(token).then(() => this.emit("login")).catch((err) => this.emit("error", err));
    }

    /**
     * Shut down the bot
     * @returns Promise<void>
     */
    close() {
        return this._client.destroy().then(() => this.emit("close")).catch(() => this.emit("close"));
    }
}

module.exports = {
    Bot: Bot
};