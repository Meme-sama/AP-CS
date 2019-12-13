const Discord = require('discord.js');
const botsuki = new Discord.Client();
const auth = require('./auth.json');

botsuki.on('ready', () => {
    console.log(`${botsuki.user.tag} has awoken!`);
});

botsuki.login(auth.token);

botsuki.on('message', msg=> {
  let args = msg.content.substring(0,1).split(" ");
  if (msg.content.substring(0,1) == "!") {
    switch (args) {
      case 'ping':
        message.channel.reply('pong!');
        break;
      default:
      message.channel.reply('wat m8?');
}};
