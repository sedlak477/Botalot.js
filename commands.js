const package = require("./package.json");

module.exports = {};

[
    {
        name: "test",
        callback: function(message, args) {
            message.channel.send("WololoBot v" + package.version + " written by " + package.author);
        }
    },
    {
        name: "help",
        callback: function(message, args) {
            message.channel.send("Type !commands for a list of all commands");
        }
    },
    {
        name: "commands",
        callback: function(message, args) {
            message.channel.send("Available commands:\n"+Object.keys(module.exports).join(", "));
        }
    },
    {
        name: "kawaii",
        callback: function(message, args) {
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
        name: "setPrefix",
        callback: function(message, args) {
            
        }
    }
]
.forEach(function(commandDef) {
    module.exports[commandDef.name] = {
        execute: function(message, args) {
            commandDef.callback.bind(commandDef.context?commandDef.context:{})(message, args);
        },
        usage: commandDef.usage
    };
}, this);