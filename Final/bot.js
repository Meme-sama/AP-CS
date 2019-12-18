const Discord = require('discord.js');
const musicBot = new Discord.Client(); // TODO: CAHNGE BOTSUKI. KILL HER
const serverQ = require('./serverQData.json'); // used to store the Q (queue) of servers that request music
const {token, prefix} = require('./auth.json');
const ytdl = require('ytdl-core');
let runFlag = false;
let thisServer; // specifies which server is actively looking for directions

musicBot.on('ready', () => {
    console.log(`${musicBot.user.tag} has awoken!`);
});


musicBot.login(token);

function playMusic(connection, msg) {
  /*
  Adds url to Q then
  plays current url and then removes it from Q.

  Check if another song is in Q,
  if not, leave VC
  */
  runFlag = true;
  thisServer = serverQ[msg.guild.id];
  const stream = ytdl(thisServer.q[0], {quality: 'highestaudio', filter: ('audioonly')});
  console.log(stream);
  thisServer.dispatcher = connection.playStream(stream, {volume : 1, bitrate : 98000});
  thisServer.q.shift();
  console.log(thisServer.q);
  thisServer.dispatcher.on('end', () => {
    if (thisServer.q[0]) {
      playMusic(connection, msg);
    }
    else {
      runFlag = false;
      msg.channel.send('Done talking, Please!');
      msg.member.voiceChannel.leave();
    }
    });
}

musicBot.on('message', msg=> {
  if (msg.content.substr(0, 1) === prefix) {
    const guildId = msg.guild.id;
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
        if (!serverQ[guildId]) {
          serverQ[guildId] = {'q': []};
        }
        console.log('opps1');
        if (runFlag == true) {
          console.log('oops1.5');
          serverQ[guildId].q.push(cmd[1]);
          console.log(`${serverQ[guildId].q} has been pushed`);
          return;
        }
        var test = serverQ[guildId].q;
        console.log('oop2');
        if (test.length == 0) {
          console.log('oops2.5');
          console.log(`${test.length} length of serverQ`);
          msg.member.voiceChannel.join()
          .then(connection=> {
            msg.channel.send('Let\'s talk, Please!');
            serverQ[guildId].q.push(cmd[1]);
            playMusic(connection, msg);
          }).catch(console.err);
        }
        break;
      case 'clearQ':
        serverQ[guildId] = {q:[]};
        console.log(serverQ);
        break;
      case 'out':
        try {
          serverQ[guildId].dispatcher.end();
          for (var i = 0; i < thisServer.q.length - 1; i++) {
            thisServer.q.splice(i, 1);
          }
        }
        catch (err) {
          msg.reply('Can\'t stop what hasn\'t started, Please!');
          console.log(`User used !out without starting stream. It's ok!\n${err}`);
        }
        break;
      case 'join':
        msg.channel.send('Back online, Please!');
        msg.member.voiceChannel.join();
      }
    }
  },
);
