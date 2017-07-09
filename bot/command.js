/**
 * @module bot/command
 */

const ytdl = require("ytdl-core");
const defaults = require("./defaults.json");
const package = require("../package.json");
const CommandContextManager = require("./context.js").CommandContextManager;

/**
 * Represents a command that can be called by users
 */
class Command {
    /**
     * @callback commandExecuteCallback The callback executed when the command is called
     * @param {Message} message - A discord.js Message object
     * @param {string[]} args - List of arguments passed to the command
     * @this Points to this commands execution context
     * @see CommandContextManager
     */
    /**
     * Create a new command
     * @param {Object} options Options
     * @param {string|string[]} name - The name or names of the command
     * @param {commandExecuteCallback} options.callback - The callback executed when the command is called
     * @param {string} options.usage - A short description how to call the command
     * @param {string} options.help - A short description of how to use the command 
     * @param {Object} options.data - The object the this keyword of the command callback function points to
     */
    constructor(options, name) {
        options = options || {};
        /**
         * Predefined data for the execution of the command
         * @type {object}
         */
        this.data = options.data || {};

        /**
         * Usage definition
         * @type {string}
         */
        this.usage = options.usage || defaults.commands.usage || "";

        /**
         * Help string
         * @type {string}
         */
        this.help = options.help || defaults.commands.help || "";

        /**
         * Name or names of the command
         */
        this.name = name || options.name;

        this.callback = options.callback || function() {};

        /**
         * Manager managing all the contexts
         * @private
         */
        this._contextManager = new CommandContextManager(this.data);
    }

    /**
     * 
     * @param {Message} message A discord.js Message object
     */
    execute(message) {
        let args = message.content.trim().slice(1).match(/(?:[^\s"]+|"[^"]*")+/g);
        args.shift();
        let context = this._contextManager.getExecutionContext(message.channel, message.guild);
        if (this.callback) {
            this.callback.bind(context)(message, args);
        }
    }

    /**
     * Check if this command has this name
     * @param {string} name Name to check
     */
    isCommand(name) {
        if (Array.isArray(this.name)) {
                return this.name.includes(name);
        }
        return this.name == name;
    }
}

/**
 * Class for managing bot commands
 */
class CommandManager {

    /**
     * Create a new CommandManager
     * @param {Command[]} [commands] - List of commands
     */
    constructor(commands) {
        /**
         * List of managed commands
         * @type {Command[]}
         */
        this.commands = commands || [];
    }

    /**
     * Executes a command if it exists
     * @param {Message} message - Discord.js Message that contains command call
     */
    execute(message) {
        // Split on blanks; ingnore between quotes
        let args = message.content.trim().slice(1).split(/ (?=([^"]*"[^"]*")*[^"]*$)/, 2);
        let cmd = this.getCommand(args.shift());
        if (cmd) {
            cmd.execute(message);
        }
    }

    /**
     * 
     * @param {string} commandName - Name of command
     * @return {Command} command or null if not found
     */
    getCommand(commandName) {
        for (var i = 0; i < this.commands.length; i++) {
            if (this.commands[i].isCommand(commandName)) {
                return this.commands[i];
            }
        }
        return null;
    }

}

module.exports = {
    Command: Command,
    CommandManager: CommandManager,
    commands: [
        {
            name: "help",
            callback: function (message, args) {
                message.channel.send("IdoiaBot v" + package.version + " written by " + package.author);
            }
        },
        {
            name: "kawaii",
            callback: function (message, args) {
                message.channel.send("", {
                    files: [this.data.pictures[Math.floor(Math.random() * this.data.pictures.length)]]
                });
            },
            data: {
                pictures: ["http://pm1.narvii.com/5772/caa1dc8887917ba80ee15e0e0a8a7c889f6cf14f_hq.jpg",
                    "http://pm1.narvii.com/5772/930f75b937b39d850e3ccdf672277e3d9cbabf63_hq.jpg",
                    "http://pm1.narvii.com/5772/6e5d047862c2e063902c7c5226c60f6e6b6387fd_hq.jpg"]
            }
        },
        {
            name: ["yt", "youtube"],
            callback: function (message, args) {
                if (!message.guild) return;
                let channel = null;
                let videoUrl = null;
                if (args.length == 2) {
                    videoUrl = args[1];
                    message.guild.channels.array().forEach(function (ch) {
                        if (ch.type == "voice" && ch.name == args[0]) {
                            channel = ch;
                            return false;
                        }
                    }, this);
                } else if (args.length == 1) {
                    videoUrl = args[0];
                    channel = message.member.voiceChannel;
                }
                if (channel && videoUrl) {
                    channel.join().then(function (connection) {
                        connection.playStream(ytdl(videoUrl, { quality: "lowest", highWaterMark: defaults.youtubeBufferSize }), { passes: 2 }).on("end", function () {
                            channel.leave();
                        });
                    });
                }
            },
            usage: defaults.commandPrefix + this.name + " <channel> <youtube-url>"
        },
        {
            name: "note",
            callback: function (message, args) {
                if (args.length > 1) {
                    this.channelContext[args[0]] = args[1];
                } else if (args.length == 1) {
                    message.reply(this.channelContext[args[0]]);
                }
            }
        }
    ]
};