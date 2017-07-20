/**
 * @module bot/command
 */

const ytdl = require("ytdl-core");
const defaults = require("./defaults.json");
const packageInfo = require("../package.json");
const CommandContextManager = require("./context.js").CommandContextManager;

/**
 * Represents a command that can be called by users
 */
class Command {
    /**
     * @typedef {object} commandExecuteData The data passed to a commandExecuteCallback call
     * @prop {Message} message A discord.js Message object that called the command
     * @prop {string[]} args Arguments passed to the command
     * @prop {CommandManager} commandManager The CommandManager that invoked the command
     */
    /**
     * @callback commandExecuteCallback The callback executed when the command is called
     * @param {commandExecuteData} commandExecuteData Data for command execution
     * @returns {string|undefined} Answer that will be written in the channel in which the command was received
     * @this Points to this commands execution context
     * @see CommandContextManager
     */
    /**
     * @typedef {object} commandOptions Options for creating a command
     * @prop {commandExecuteCallback} callback The callback executed when the command is called
     * @prop {string} usage A short description how to call the command
     * @prop {string} help A short description of how to use the command 
     * @prop {Object} data The object the this keyword of the command callback function points to
     */
    /**
     * Create a new command
     * @param {commandOptions} options Options
     * @param {string|string[]} name - The name or names of the command
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
         * @type {string|string[]}
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
     * Execute this command
     * @param {Message} message The discord.js Message object that invoked this command
     * @param {CommandManager} commandManager The CommandManager that invoked this command
     */
    execute(message, commandManager) {
        let args = message.content.trim().slice(1).match(/(?:[^\s"]+|"[^"]*")+/g);
        args.shift();
        let context = this._contextManager.getExecutionContext(message.channel, message.guild);
        if (this.callback) {
            let answer = this.callback.bind(context)({ message: message, args: args, commandManager: commandManager});
            if (answer) {
                message.channel.send(answer);
            }
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
     * @param {Command[]} [commands] List of commands
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
     * @param {Message} message Discord.js Message that contains command call
     */
    execute(message) {
        // Split on blanks; ingnore between quotes
        let args = message.content.trim().slice(1).split(/ (?=([^"]*"[^"]*")*[^"]*$)/, 2);
        let cmd = this.getCommand(args.shift());
        if (cmd) {
            cmd.execute(message, this);
        }
    }

    /**
     * Get a Command
     * @param {string} commandName Name of command
     * @return {Command} command or undefined if not found
     */
    getCommand(commandName) {
        return this.commands.find(c => c.isCommand(commandName));
    }

    close() {

    }
}

module.exports = {
    Command: Command,
    CommandManager: CommandManager,
    /**
     * Parse command definitions into Commands
     * @param {object[]} cmdDef List of command definitions
     * @returns {Command[]} List of Commands
     */
    parseCommands: cmdDef => cmdDef.map(d => new Command(d)),
    commands: [
        {
            name: "help",
            callback: function (data) {
                return "IdoiaBot v" + packageInfo.version + " written by " + packageInfo.author;
            }
        },
        {
            name: "kawaii",
            callback: function (data) {
                data.message.channel.send("", {
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
                if (!data.message.guild) return;
                let channel = null;
                let videoUrl = null;
                if (data.args.length == 2) {
                    videoUrl = data.args[1];
                    data.message.guild.channels.array().forEach(function (ch) {
                        if (ch.type == "voice" && ch.name == data.args[0]) {
                            channel = ch;
                            return false;
                        }
                    }, this);
                } else if (data.args.length == 1) {
                    videoUrl = data.args[0];
                    channel = data.message.member.voiceChannel;
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
            callback: function (data) {
                if (data.args.length > 1) {
                    this.context[data.args[0]] = data.args[1];
                } else if (data.args.length == 1) {
                    return this.context[data.args[0]];
                }
            }
        }
    ]
};