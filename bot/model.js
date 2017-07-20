const mongoose = require("mongoose");

const commandSchema = new mongoose.Schema({
    id: mongoose.SchemaTypes.ObjectId,
    name: String,
    alias: [String],
    help: String,
    usage: String,
    data: {},
    callback: String
});

const commandModel = new mongoose.Model("Command", commandSchema);

module.exports = {
    /**
     * Create a new CommandModel
     */
    CommandModel = commandModel
};