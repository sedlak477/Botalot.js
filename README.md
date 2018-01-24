# IdoiaBot
Botalot.js is a simple bot-making framework for [Discord](https://discordapp.com/).

## Development
Botalot.js is a side project to get familiar with Node.js, it's under development and may have bugs. I'm constantly trying out new stuff so expect the code to change alot.

## Usage
If you are using Botalot.js as a [Node.js](https://nodejs.org/) module try this:
```javascript
const { Bot } = require("bot.js");

let bot = new Bot();

bot.login(apiToken);
```
else you just start the server with: `npm start`, and stop it by typing `exit`.

## Requirements
* [discord.js](https://github.com/hydrabolt/discord.js)
