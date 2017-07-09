# IdoiaBot
IdoiaBot is a bot for [Discord](https://discordapp.com/).

## Development
IdoiaBot is a side project for me to get familiar with Node.js, it's under development and may have bugs. 
I'm constantly trying new stuff so don't expect the code to stay like it is now. 
If you have any recommendation how I could improve my code tell me! I'm always open for any suggestions you might have! :smile:

## Usage
If you are using IdoiaBot as a module it goes a bit like this:
```javascript
const Bot = require("idoiabot.js").Bot;

var bot = new Bot();

bot.login(apiToken);
```
else you just start the server with:
`npm start`

## Requirements
* [discord.js](https://github.com/hydrabolt/discord.js)
