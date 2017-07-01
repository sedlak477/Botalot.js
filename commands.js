const discordjs = require("discord.js");
const ytdl = require("ytdl-core");
const package = require("./package.json");
const settings = require("./settings.json");

module.exports = {};

[
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
        name: "dejavu",
        callback: function (message, args) {
            if (args.length > 0) {
                message.guild.channels.array().forEach(function (channel) {
                    if (channel.type == "voice" && channel.name == args[0]) {
                        channel.join().then(function (connection) {
                            connection.playFile("D:\\Music\\Initial D - Deja Vu.mp3");
                        });
                        return false;
                    }
                }, this);
            }
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
        name: ["clear", "cls"],
        callback: function(message, args) {
            if(message.guild) {
                let messages = message.channel.fetchMessages({});
                message.channel.bulkDelete(messages, true);
            }
        }
    }
]
    .forEach(function (commandDef) {
        if (Array.isArray(commandDef.name)) {
            commandDef.name.forEach(function (name) {
                module.exports[name] = {
                    execute: function (message, args) {
                        commandDef.callback.bind(commandDef.context ? commandDef.context : {})(message, args);
                    },
                    usage: commandDef.usage
                };
            }, this);
        } else {
            module.exports[commandDef.name] = {
                execute: function (message, args) {
                    commandDef.callback.bind(commandDef.context ? commandDef.context : {})(message, args);
                },
                usage: commandDef.usage
            };
        }
    }, this);