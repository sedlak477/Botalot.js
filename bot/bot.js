/**
 * @module bot/bot
 */

const discordjs = require("discord.js");
const EventEmitter = require("events").EventEmitter;
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
         * Map mapping command prefixes to their CommandManagers
         * @private
         * @type Map<string, CommandManager[]>
         */
        this._commandManagers = new Map();

        /**
         * Discord.js client
         * @private
         */
        this._client = new discordjs.Client({
            apiRequestMethod: 'burst'
        });

        this._client.on("message", function (message) {
            for (var [prefix, cmdMgrs] of this._commandManagers) {
                if (message.content.startsWith(prefix)) {
                    cmdMgrs.forEach(function(cmdMgr) {
                        try {
                            cmdMgr.execute(message);
                        } catch (error) {
                            this.emit("error", error);
                        }
                    }.bind(this));
                }
            }
            this.emit("message", message);
        }.bind(this));

        this._client.on("ready", function () {
            this._client.user.setPresence({ game: { name: options.statusText || defaults.statusText || null } });

            setInterval(() => {
                this._client.voiceConnections.array().forEach(c => {
                    if (c.channel.members.array().length <= 1)
                        c.channel.leave();
                });
            }, 1000 * 60 * 5);   // Check every 5 mins if alone in a channel and leave if alone
        }.bind(this));
    }

    /**
     * Register a CommandManager for a specific prefix.
     * 
     * NOTE: if one prefix is a substring of another one, both will be called
     * 
     * @param {string} prefix Prefix that invokes the CommandManager
     * @param {CommandManager} cmdMgr The CommandManager
     */
    registerCommandManager(prefix, cmdMgr) {
        if (!this._commandManagers.has(prefix)) {
            this._commandManagers.set(prefix, [cmdMgr]);
        } else {
            this._commandManagers.get(prefix).append(cmdMgr);
        }
    }

    /**
     * Login into the Discord API
     * @param {string} token Discord API token
     */
    login(token) {
        this._client.login(token).then(() => this.emit("login")).catch((err) => this.emit("error", err));
    }

    /**
     * Shut down the bot
     * @returns Promise<void>
     */
    close() {
        for (var cmdMgr in this._commandManagers.values()) {
            cmdMgr.close();
        }
        return this._client.destroy().then(() => this.emit("close")).catch(() => this.emit("close"));
    }
}

module.exports = {
    Bot: Bot
};