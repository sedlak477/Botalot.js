const mongoose = require('mongoose');

module.exports = {};

[
    {
        name: 'GuildSettings',
        schema : {
            guildId: String,
            commandPrefix: String
        },
        methods: {
            'test': function() {
                console.log("--Test function");
            }
        }
    }
]
.forEach(function(def) {
    let schema = new mongoose.Schema(def.schema);
    if(def.methods) {
        for (let name in def.methods) {
            if (def.methods.hasOwnProperty(name)) {
                schema.methods[name] = def.methods[name];
            }
        }
    }
    module.exports[def.name] = mongoose.model(def.name, schema);
}, this);