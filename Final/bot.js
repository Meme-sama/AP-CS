const Discord = require('discord.js');
const botsuki = new Discord.Client();
const auth = require('./auth.json');
const prefix = '!';
botsuki.on('ready', () => {
    console.log(`${botsuki.user.tag} has awoken!`);
});

botsuki.login(auth.token);

botsuki.on('message', msg=> {
  if (msg.content.substr(0, 1) === prefix) {
    const arg = msg.content.substr(1).split(' ');
    switch (arg[0]) {
      case 'ping':
        msg.reply('pong!');
        break;
      case 'clear':

        break;
    }
  }
});
