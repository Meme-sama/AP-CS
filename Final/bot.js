const Discord = require('discord.js');
const botsuki = new Discord.Client();
const {token, prefix} = require('./auth.json');
const ytdl = require('ytdl-core');
const serverQ = {}; // used to store the Q (queue) of servers that request music

let thisServer; // specifies which server is actively looking for directions

botsuki.on('ready', () => {
    console.log(`${botsuki.user.tag} has awoken!`);
});


botsuki.login(token);

function playMusic(connection, msg) {
  /*
  Adds url to Q then
  plays current url and then removes it from Q.

  Check if another song is in Q,
  if not, leave VC
  */
  thisServer = serverQ[msg.guild.id];
  const stream = ytdl(thisServer.q[0], {filter: ('audioonly')});
  console.log(stream);
  thisServer.dispatcher = connection.playStream(stream, {volume : 100});
  thisServer.q.shift();
  thisServer.dispatcher.on('end', () => {
    if (thisServer[0]) {
      playMusic(connection, msg);
    }
    else connection.diconnect();
    });
}

botsuki.on('message', msg=> {
  if (msg.content.substr(0, 1) === prefix) {
    const cmd = msg.content.substr(1).split(' ');
    switch (cmd[0]) {
      case 'ping':
        msg.reply('pang!');
        break;
      case 'play':
        if (!cmd[1]) {
          msg.channel.send('Umm... a link, Please!'); return;
        }
        if (!msg.member.voiceChannel) {
          msg.channel.send('Join a voice channel, Please!'); return;
        }
        if (!serverQ[msg.guild.id]) {
          serverQ[msg.guild.id] = { // creates property 'msg.guild.id'
            q: [],
          };
        }
        msg.member.voiceChannel.join()
        .then(connection=> {
            msg.channel.send('Let\'s talk, Please!');
            serverQ[msg.guild.id].q.push(cmd[1]);
            playMusic(connection, msg);
        }).catch(console.err);
        break;
      case 'clearQ':
        serverQ[msg.guild.id] = false;
        console.log(serverQ);
        break;
      case 'stop':
        if (msg.voiceConnection) {
          for (var i = 0; i < thisServer.q.length - 1; i++) {
            thisServer.q.splice(i, 1);
          }
          thisServer.dispatcher.end();
          console.log('bye!').catch(err => console.log(err));
        }
    }
  }
});
