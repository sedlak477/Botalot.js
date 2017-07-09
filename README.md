# IdoiaBot
IdoiaBot is a bot for [Discord](https://discordapp.com/).

## Development
IdoiaBot is a side project to get familiar with Node.js, it's under development and may have bugs. I'm constantly trying out new stuff so expect the code to change alot. If you have any recommendation how I could improve my code tell me! I'm always happy to hear any suggestions you might have!

## Usage
If you are using IdoiaBot as a [Node.js](https://nodejs.org/) module try this:
```javascript
const Bot = require("idoiabot.js").Bot;

var bot = new Bot();

bot.login(apiToken);
```
else you just start the server with: `npm start`, and stop it by typing `exit`.

## Requirements
* [discord.js](https://github.com/hydrabolt/discord.js)
