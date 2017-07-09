const ytdl = require("ytdl-core");
const settings = require("../settings.json");
const package = require("../../package.json");

module.exports = [
    {
        name: "help",
        callback: function (message, args) {
            if (args.length == 0) {
                message.channel.send("WololoBot v" + package.version + " written by " + package.author + "\nType !commands for a list of all commands");
            } else if (args.length == 1) {

            } else {
                message.channel.send("WololoBot v" + package.version + " written by " + package.author + "\nType !commands for a list of all commands");
            }
        }
    },
    {
        name: "commands",
        callback: function (message, args) {
            message.channel.send("Available commands:\n" + Object.keys(module.exports).join(", "));
        }
    },
    {
        name: "kawaii",
        callback: function (message, args) {
            message.channel.send("", {
                files: [this.pictures[Math.floor(Math.random() * this.pictures.length)]]
            });
        },
        context: {
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
                    connection.playStream(ytdl(videoUrl, { quality: "lowest", highWaterMark: settings.youtubeBufferSize }), { passes: 2 }).on("end", function () {
                        channel.leave();
                    });
                });
            }
        },
        usage: settings.commandPrefix + this.name + " <channel> <youtube-url>"
    },
    {
        name: "note",
        callback: function (message, args) {
            if (args.length > 1) {
                this[args[0]] = args[1];
            } else if (args.length == 1) {
                message.reply(this[args[0]]);
            }
        }
    },
    {
        name: "howtoyouturnthison",
        callback: function (message, args) {
            message.channel.send("", {
                files: ["http://wallpapercave.com/wp/UPfurNz.jpg"]
            });
        }
    }
];