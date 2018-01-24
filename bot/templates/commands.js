const packageInfo = require("../../package.json");
const ytdl = require("ytdl-core");
const defaults = require("../defaults.json");
const discordjs = require("discord.js");

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
        return this.data.name + " v" + packageInfo.version + " written by " + packageInfo.author;
    },

    /**
     * Play a Youtube video in the channel of the sender of the command
     * @param {object} data
     */
    playYoutubeVideo: function (data) {
        if (!data.message.guild) return;
        let channel = data.message.member.voiceChannel;
        let videoUrl = data.arg;
        if (videoUrl && channel && channel.speakable) {
            channel.join().then(function (connection) {
                connection.playStream(ytdl(videoUrl, { quality: "lowest", highWaterMark: defaults.youtubeBufferSize }), { passes: 2 }).on("end", function () {
                    channel.leave();
                });
            });
        }
    },

    /**
     * Play a radio stream in the channel of the sender of the command
     * @param {object} data
     */
    playRadioStream: function (data) {
        if (data.message.member.voiceChannel && data.arg) {
            let url = this.data[data.arg] || data.arg;
            data.message.member.voiceChannel.join().then(conn => conn.playArbitraryInput(url));
        }
    }
};