/**
 * Class for managing bot commands
 */
class CommandManager {

    /**
     * @callback commandExecuteCallback The callback executed when the command is called
     * @param {Message} message - A discord.js Message object
     * @param {string[]} args - List of arguments passed to the command
     */

    /**
     * @typedef {Object} Command Represents a command
     * @prop {string|string[]} name - The name or names of the command
     * @prop {commandExecuteCallback} callback - The callback executed when the command is called
     * @prop {string} usage - A short description of how to use the command
     * @prop {Object} context - The object the this keyword of the command callback function points to
     */

    /**
     * Create a new CommandManager
     * @param {Command[]} [commands] - List of commands
     */
    constructor(commands) {
        /**
         * @member {Command[]} commands List of managed commands
         */
        this.commands = commands || [];
    }

    /**
     * Executes a command if it exists
     * @param {Message} message - Discord.js Message that contains command call
     */
    execute(message) {
        // Split on blanks; ingnore between quotes
        let args = message.content.trim().slice(1).split(/ (?=([^"]*"[^"]*")*[^"]*$)/);
        let cmd = this.getCommand(args.shift());
        if (cmd) {
            if (!cmd.context) {
                cmd.context = {};
            }
            cmd.callback.bind(cmd.context)(message, args);
        }
    }

    /**
     * 
     * @param {string} commandName - Name of command
     * @return {Command} command or null if not found
     */
    getCommand(commandName) {
        for (var i = 0; i < this.commands.length; i++) {
            var cmd = this.commands[i];
            if (Array.isArray(cmd.name)) {
                if (cmd.name.includes(commandName)) {
                    return cmd;
                }
            } else if (cmd.name === commandName) {
                return cmd;
            }
        }
        return null;
    }

}

module.exports = CommandManager;