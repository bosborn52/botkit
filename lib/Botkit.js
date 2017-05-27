var CoreBot = require(__dirname + '/CoreBot.js');
var Slackbot = require(__dirname + '/SlackBot.js');
var ConsoleBot = require(__dirname + '/ConsoleBot.js');

module.exports = {
    core: CoreBot,
    slackbot: Slackbot,
    consolebot: ConsoleBot,
};
