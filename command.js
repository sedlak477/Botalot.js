/**
 * @module bot/command
 */

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
     * @prop {Bot} bot The Bot that invoked the command
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
     * @prop {string|string[]} name The name or names of the command
     */
    /**
     * Create a new command
     * @param {commandOptions} options Options
     * @param {object} cmdTemplates Object containing all the functions for commands
     * @param {string|string[]} name - The name or names of the command
     */
    constructor(options, cmdTemplates, name) {
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
        this.usage = options.usage || "No usage defined";

        /**
         * Help string
         * @type {string}
         */
        this.help = options.help || "**There is no help**";

        /**
         * Name or names of the command
         * @type {string|string[]}
         */
        this.name = name || options.name;

        //If it's a string try get from templates
        if (typeof(options.callback) === "string") {
            this.callback = cmdTemplates[options.callback];
        } else {
            this.callback = options.callback;
        }
        // If nothing worked we do nothing; maybe should throw an error
        this.callback = this.callback || function() {};

        /**
         * Manager managing all the contexts
         * @private
         */
        this._contextManager = new CommandContextManager(this.data);
    }

    /**
     * Execute this command
     * @param {Message} message The discord.js Message object that invoked this command
     * @param {string} arg Argument passed to the command
     * @param {CommandManager} commandManager The CommandManager that invoked this command
     * @param {Bot} bot The bot where the command was called
     */
    execute(message, arg, commandManager, bot) {
        let context = this._contextManager.getExecutionContext(message.channel, message.guild);
        if (this.callback) {
            let answer = this.callback.bind(context)({ message: message, arg: arg, commandManager: commandManager, bot: bot});
            if(typeof(answer) === "object") {
                message.channel.send(answer.message, answer.options);
            } else if (answer) {
                message.channel.send(answer);
            } 
        }
    }

    /**
     * Check if this command has this name
     * @param {string} name Name to check
     */
    isCommand(name) {
        if (Array.isArray(this.name))
            return this.name.includes(name);
        return this.name == name;
    }
}

/**
 * Class for managing bot commands
 */
class CommandManager {

    /**
     * Create a new CommandManager
     * @param {Command[]|Command[][]} [commands] List of commands
     */
    constructor(commands) {
        // If commands is 2D flatten it
        if (commands.length > 0 && Array.isArray(commands[0])) {
            commands = [].concat.apply([], commands);
        } 

        /**
         * List of managed commands
         * @type {Command[]}
         */
        this.commands = commands || [];
    }

    /**
     * Executes a command if it exists and the invoker has permission
     * @param {Message} message Discord.js Message that contains command call
     * @param {Bot} bot The bot where the command was called
     */
    execute(message, bot) {
        // Split on blanks; ingnore between quotes
        let args = message.content.trim().slice(1).split(" ");
        let cmd = this.getCommand(args.shift());
        if (cmd)
            cmd.execute(message, args.join(" "), this, bot);
    }

    /**
     * Get a Command
     * @param {string} commandName Name of command
     * @return {Command} command or undefined if not found
     */
    getCommand(commandName) {
        return this.commands.find(c => c.isCommand(commandName));
    }

    /**
     * Register a new command
     * @param {Command} command Command to register
     */
    registerCommand(command) {
        this.commands.push(command);
    }

    /**
     * Register multiple commands at the same time
     * @param {Command[]} commands Commands to register
     */
    registerCommands(commands) {
        this.commands = this.commands.concat(commands);
    }

    close() {}
}

module.exports = {
    Command: Command,
    CommandManager: CommandManager,
    /**
     * Parse command definitions into Commands
     * @param {object[]} cmdDef List of command definitions
     * @returns {Command[]} List of Commands
     */
    parseCommands: (cmdDef, cmdTemplates) => cmdDef.map(d => Array.isArray(d)?parseCommands(d):new Command(d, cmdTemplates))
};