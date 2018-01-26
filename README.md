# Botalot.js
Botalot.js is a simple bot-making framework for [Discord](https://discordapp.com/).

## Development
Botalot.js is a side project to get familiar with Node.js, it's under development and may have bugs. I'm constantly trying out new stuff so expect the code to change alot.

## Usage
Using Botalot.js is not that hard:
```javascript
const { Botalot, CommandManager, parseCommands } = require("botalot.js");

let bot = new Botalot();

bot.registerCommandManager("!",  // Prefix for commands of this command manger
    new CommandManager(parseCommands({
        "name": ["hello", "hi"],  // String or array of strings; Command name people need to type to call this command
        "callback": "respondeText",  // Callback when users calls command
        "usage": "hello",  // Usage text
        "data": {  // Arbitrary data, gets passed to the callback
            "text": {
                "pre": "Hello",
                "post": "!"
            }
        }
    }, {
        // data:
        //     message: Underlying Discord.js Message object
        //     arg: Argument passed after the command (just the raw string, no splititng or anything)
        //     commandManager: CommandManager object from which the command was invoked
        //     bot: Bot object
        respondeText: data => {
            // this:
            //     data: Data from the command definition
            //     Context objects persists between command executions, save data inbetween command executions
            //     Contexts are unique to each command
            //      globalContext: global over the whole shard
            //      channelContext: it is bound to the channel the command was called
            //      guildContext: it is bound to the guild the command was called
            //      context: is either guildContext, channelContext or globalContext, in that order depending which are available
            return this.data.text.pre + " " + data.message.author.username + " " + this.data.text.post;
        }
    }))
);


bot.on("error", console.error);
bot.on("login", () => console.log("Logged in"));

bot.login(discord_api_token_goes_here);
```
An more in depth documentation will follow, but for now this is all I got.
