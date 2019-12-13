const Discord = require('discord.js');
const botsuki = new Discord.Client();
const auth = require('./auth.json');

botsuki.on('ready', () => {
    console.log(`${botsuki.user.tag} has awoken!`);
});

botsuki.login(auth.token);

botsuki.on('message', msg=> {
  if (msg.content.substring(0, 1) == '!') {
    let args = msg.content.substring(0, 1).split(' ');
    switch (args[0]) {
      case 'ping':
        msg.reply('pong!');
        break;
      default:
      msg.reply('wat m8?');
    }
  }
});
