const packageInfo = require("../../package.json");
const ytdl = require("ytdl-core");
const defaults = require("../defaults.json");
const models = require("../database/models.js");

module.exports = {
    /**
     * Responde with a random text from messages field in data context
     * @param {Object} data 
     * @returns {string} random string from messages
     */
    respondeRandomText: function (data) {
        return this.data.messages[Math.floor(Math.random() * this.data.messages.length)];
    },

    /**
     * Responde with a random file from files field in data context
     * @param {Object} data 
     * @returns {string} random file from files
     */
    respondeRandomFile: function (data) {
        return {
            message: "",
            options: {
                files: [this.data.files[Math.floor(Math.random() * this.data.files.length)]]
            }
        }
    },

    /**
     * Responde with a help text
     * @param {object} data
     * @returns {string} help text
     */
    respondeHelpText: function (data) {
        return "IdoiaBot v" + packageInfo.version + " written by " + packageInfo.author;
    },

    /**
     * Play a Youtube video in a defined channel or in the channel of the sender of the command
     * @param {object} data
     */
    playYoutubeVideo: function (data) {
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

    /**
     * Create a command in the database
     * @param {object} data
     */
    createCommand: function(data) {
        
    }
};