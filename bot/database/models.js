const mongoose = require("mongoose");

const commandSchema = new mongoose.Schema({
    "name": String,
    "callback": String,
    "usage": String,
    "help": String,
    "data": mongoose.SchemaTypes.Mixed,
    "permissions": [String]
});

const commandModel = mongoose.model("command", commandSchema);

const userScheme = new mongoose.Schema({
    "id": String,
    "permissions": [String],
    "developer": Boolean
});

const userModel = mongoose.model("user", userScheme);

module.exports = {
    User: userModel,
    Command: commandModel
};