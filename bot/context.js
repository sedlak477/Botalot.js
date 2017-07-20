/**
 * @module bot/context
 */

/**
 * This CommandContextManager is responsible for managing the different contexts of a command.
 */
class CommandContextManager {

    constructor(data) {
        /**
         * Contains predefined data for the command
         * @type {object}
         */
        this.data = data || {};

        /**
         * Global context of the command
         * @type {object}
         */
        this.globalContext = {};

        /**
         * Map containing all the channel contexts
         * @private
         * @type {Map}
         */
        this._channelContexts = new Map();

        /**
         * Map containing all the guild contexts
         * @private
         * @type {Map}
         */
        this._guildContexts = new Map();
    }

    /**
     * @typedef ExecutionContext Execution context for commands
     * @prop {object} data Predefined data for execution.
     * @prop {object} globalContext An object that persists between command executions. It is global over the whole shard.
     * @prop {object} channelContext An object that persists between command executions. It is bound to the channel the command was called.
     * @prop {object} guildContext An object that persists between command executions. It is bound to the guild the command was called.
     * @prop {object} context An object that persists between command executions.
     * It is bound to the guildContext if not null, else to the channelContext if not null, else to the globalContext.
     */
    /**
     * Get the execution context for this command.
     * @param {Channel} channel A discord.js Channel object
     * @param {Guild} guild A discord.js Guild object
     * @returns {ExecutionContext} The execution context for the command
     */
    getExecutionContext(channel, guild) {
        let context = {
            data: this.data,
            globalContext: this.globalContext
        };
        if (channel) { context.channelContext = this.getChannelContext(channel.id); }
        if (guild) { context.guildContext = this.getGuildContext(guild.id); }
        if (guild) { context.context = context.guildContext; }
        else if (channel) { context.context = context.channelContext; }
        else { context.context = context.globalContext; }
        return context;
    }

    /**
     * Get a guild context
     * @param {Snowflake} id A discord.js Snowflake
     */
    getGuildContext(id) {
        if (!this._guildContexts.has(id)) {
            this._guildContexts.set(id, {});
        }
        return this._guildContexts.get(id);
    }

    /**
     * Get a channel context
     * @param {Snowflake} id A discord.js Snowflake
     */
    getChannelContext(id) {
        if (!this._channelContexts.has(id)) {
            this._channelContexts.set(id, {});
        }
        return this._channelContexts.get(id);
    }
}

module.exports = {
    CommandContextManager: CommandContextManager
};