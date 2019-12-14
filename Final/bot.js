const Discord = require('discord.js');
const botsuki = new Discord.Client();
const {token, prefix} = require('./auth.json');
const ytdl = require('ytdl-core');
botsuki.on('ready', () => {
    console.log(`${botsuki.user.tag} has awoken!`);
});

const serverQ = [];

botsuki.login(token);

botsuki.on('message', msg=> {
  if (msg.content.substr(0, 1) === prefix) {
    const arg = msg.content.substr(1).split(' ');
    switch (arg[0]) {
      case 'ping':
        msg.reply('pong!');
        break;
      case 'play':
        if (!arg[1]) {
          msg.channel.send('Umm... a link, please!'); return;
        }
        if (!msg.member.voiceChannel) {
          msg.channel.send('Join a voice channel, Please!'); return;
        }
        if (!serverQ[msg.guild.id]) {
          const a = 2;
        }
        else {
          msg.member.voiceChannel.Join()
          .then(()=> {
            msg.channel.send("Let's talk, Please!");
          });
        }
        break;
    }
  }
});
