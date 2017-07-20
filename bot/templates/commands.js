/**
 * Responde with a random text
 * @param {Object} data 
 */
function respondeRandomText(data) {
    data.message.reply(this.data[Math.floor(Math.random() * this.data.length)]);
}

module.exports = {};