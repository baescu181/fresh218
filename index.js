const Discord = require("discord.js");
const ytdl = require('ytdl-core');
const ms = require("ms");
const YouTube = require('simple-youtube-api');
const GOOGLE_API_KEY = "AIzaSyDUmo-BtB5oQr5Y3RSgYYBMj9rFKMr-W2s";
const prefix = "*";
const fs = require("fs");
const youtube = new YouTube(GOOGLE_API_KEY);
const queue = new Map();

const TOKEN = "NDU2MTQ0MzIzNDc4ODE0NzIw.DgGTvQ.RyLkAuWYmJwKi2HfiMeKoJRPx2g";
const PREFIX = "*";

function generateHex() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

var bot = new Discord.Client();
var servers = {};

bot.on("ready", function() {
    console.log("I'm on.");
bot.user.setGame('Fresh | *help')
bot.user.setStatus('dnd')

});

bot.on("message", async message => {
    if (message.author.bot) return undefined;
    if (!message.content.startsWith(prefix)) return undefined;

const args = message.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(message.guild.id);
let messageArray = message.content.split(" ");
let args2 = messageArray.slice(1);
var args3 = message.content.substring(prefix.length).split(" ");

    switch (args3[0].toLowerCase()) {
        case "avatar":
            const mentionuser = message.mentions.users.first()
            var embed = new Discord.RichEmbed()
            if (message.mentions.users.size === 0) {
            embed.setDescription(`[Link](${message.author.avatarURL})`)
            embed.setImage(message.author.displayAvatarURL)
            embed.setColor("ff0000")
            } else {
            embed.setDescription(`[Link](${mentionuser.avatarURL})`)
            embed.setImage(mentionuser.displayAvatarURL)
            embed.setColor("ff0000")
            }
            message.channel.send({embed: embed})
            break;
        case "invite":
            var embed = new Discord.RichEmbed()
                .setTitle("Link")
                .setDescription(`[Invite Link](${'https://discordapp.com/oauth2/authorize?client_id=456144323478814720&scope=bot&permissions=2146958591'})`)
                .setColor("ff0000")
            message.channel.send({embed: embed})
            break;
        case "say":
            let text = args.slice(1).join(" ");
            message.delete();
            message.channel.send(text);
            break;
        case "mute":
            if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Nu ai acces la acceasta comanda !");
    
            let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
            if(!toMute) return message.channel.send("Nu ai mentionat pe nimeni ! !");
            let role = message.guild.roles.find(r => r.name === "Mute");
            if(!role){
              try {
                role = await message.guild.createRole({
                  name: "Mute",
                  color:"#000000",
                  permissions:[]
                });
        
                message.guild.channels.forEach(async (channel, id) => {
                  await channel.overwritePermissions(role, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                  });
                });
              } catch (e) {
                console.log(e.stack)
              }
            }
        
            if(toMute.roles.has(role.id)) return message.channel.send('Acest user are deja mut !');
        
            await(toMute.addRole(role));
            message.channel.send("User-ul a primit mut cu succes !");
        
            return;
        case "warn":
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You can't access command !");

        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!rUser) return message.channel.send("User does not exist.");
        let rreason = args.join(" ").slice(22);
    
        let reportEmbed = new Discord.RichEmbed()
        .setDescription("Warn")
        .setColor("ff0000")
        .addField("User warned", `${rUser} with ID: ${rUser.id}`)
        .addField("Warned by", `${message.author} with ID: ${message.author.id}`)
        .addField("Channel", message.channel)
        .addField("Time", message.createdAt)
        .addField("Reason", rreason);
    
        let reportschannel = message.guild.channels.find(`name`, "logs");
        if(!reportschannel) return message.channel.send("There is no channel logs.");
    
    
        message.delete().catch(O_o=>{});
        reportschannel.send(reportEmbed);
    
            return;
    case "serverinfo":
            let sicon = message.guild.iconURL;
            let serverembed = new Discord.RichEmbed()
            .setDescription("Server Info")
            .setColor("ff0000")
            .setThumbnail(sicon)
            .addField("Name of Server", message.guild.name)
            .addField("Create by", message.guild.createdAt)
            .addField("You entered the date", message.member.joinedAt)
            .addField("Members", message.guild.memberCount);
        
            return message.channel.send(serverembed);
        case "help":
            var embed = new Discord.RichEmbed()
                .setTitle("Choose a section : ")
                .setDescription("")  
                .addField("*help.entertainment", "To see the entertainment related commands.")
                .addField("*help.music ", 'To see the music commands.')
                .addField("*help.moderate", "To see the moderation commands.")
                .addField("*invite", "For the invite link.") 
                .setColor(0xff0000)      
                .setThumbnail(message.author.avatarURL)                                          
            message.channel.sendEmbed(embed);
            break;
        case "help.music":
            var embed = new Discord.RichEmbed()
                .setTitle("Orders related to music: ")
                .setDescription("")
                .addField("*play ", 'To listen to music.')
                .addField("*skip", 'To skip to the song.')
                .addField("*stop", 'To stop the song.')
                .addField("*volume", 'To adjust music volume.')
                .addField("*now-playing", 'To see which song is playing.')
                .addField("*pause", 'To pause the music.')
                .addField("*resume", 'To resume music.')   
                .setColor(0xff0000)      
                .setThumbnail(message.author.avatarURL)                                          
            message.channel.sendEmbed(embed);
            break;
        case "help.entertainment":
            var embed = new Discord.RichEmbed()
                .setTitle("Orders related to entertainment: ")
                .setDescription("")
                .addField("*gay", "At work.")
                .addField("*say", "Repeat what you say.")
                .addField("*avatar", "To see an avatar on someone.")
                .addField("*serverinfo", "To see information about the server.")
                .setColor(0xff0000)      
                .setThumbnail(message.author.avatarURL)                                          
            message.channel.sendEmbed(embed);
            break;
        case "help.moderate":
            var embed = new Discord.RichEmbed()
                .setTitle("Orders related to moderate: ")
                .setDescription("")
                .addField("*mute", "To mute someone.")
                .addField("*warn", "To warn someone.")
                .setColor(0xff0000)     
                .setThumbnail(message.author.avatarURL)                                          
            message.channel.sendEmbed(embed);
            break;
        case "play":
                const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) {
                    var E31 = new Discord.RichEmbed()
                    .setColor(0xff0000)
                    .addField("Error", "You are not on a Voice Channel ")
                    .setTimestamp();
            return message.channel.send(E31);
};;
            if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
                    const playlist = await youtube.getPlaylist(url);
                    const videos = await playlist.getVideos();
                    for (const video of Object.values(videos)) {
                        const video2 = await youtube.getVideoByID(video.id);  
                        await handleVideo(video2, message, voiceChannel, true); 
                    }
                        var E31 = new Discord.RichEmbed()
                        .setColor(0xff0000)
                        .addField("✅ Playlist:", `**${playlist.title}** added to playlist`)
                        .setTimestamp();
                    return message.channel.send(E31);
                } else {
                    try {
                        var video = await youtube.getVideo(url);
                    } catch (error) {
                        try {
                            var videos = await youtube.searchVideos(searchString, 5);
                            let index = 0;
                            var E32 = new Discord.RichEmbed()
                        .setColor(0xff0000)
                        .addField("Top 5 videos found:", `${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Write the number of the video that you want to listen to in the chat. `)
                        .setTimestamp();
                            message.channel.send(E32);
                            try {
                                var response = await message.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
                                    maxMatches: 1,
                                    time: 30000,
                                    errors: ['time']
                                });
                            } catch (err) {
                                console.error(err);
                                var E33 = new Discord.RichEmbed()
                                .setColor(0xff0000)
                                .addField("Eroare", "Time has expired or you have not put a number")
                                .setTimestamp();
                                 return message.channel.send(E33);
                            }
                            const videoIndex = parseInt(response.first().content);
                            var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                        } catch (err) {
                            console.error(err);
                            var E34 = new Discord.RichEmbed()
                            .setColor(0xff0000)
                            .addField("Error", "Mention owener")
                            .setTimestamp();
                        return message.channel.send(E34);
                        }
                    }
                    return handleVideo(video, message, voiceChannel);
                }
                    break;
                case "skip" :
                const voiceChannel2 = message.member.voiceChannel;
            if (!voiceChannel2) {
                var E31 = new Discord.RichEmbed()
                .setColor(0xff0000)
                .addField("Eroare", "You are not on a Voice Channel ")
                .setTimestamp();
            return message.channel.send(E31);
            };
            if (!serverQueue) return message.channel.send('There is nothing playing that I could skip for you.')
                serverQueue.connection.dispatcher.end('Skip command has been used!')
                return undefined;
                    break;
                case "stop" :
                if (!message.member.voiceChannel) {
                    var E38 = new Discord.RichEmbed()
                    .setColor(0xff0000)
                    .addField("Eroare", "You are not on a Voice Channel ")
                    .setTimestamp();
                return message.channel.send(E38);
                }
                if (!serverQueue) {
                    var E40 = new Discord.RichEmbed()
                    .setColor(0xff0000)
                    .addField("Error", "Fresh isn't on a Voice Channel")
                    .setTimestamp();
                    return message.channel.send(E40);
                }
                    serverQueue.songs = [];
                var server = servers[message.guild.id];
                if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
                        var E39 = new Discord.RichEmbed()
                    .setColor(0xff0000)
                    .addField("Fresh has disconnected",":x:")
                    .setTimestamp();
                    message.channel.sendMessage(E39);       
                    break;
                case "volume" :
                if (!message.member.voiceChannel) {
                    var E41 = new Discord.RichEmbed()
                    .setColor(0xff0000)
                    .addField("Error", "You are not on a Voice Channel ")
                    .setTimestamp();
                return message.channel.send(E41);
                }
                if (!serverQueue) {
                    var E42 = new Discord.RichEmbed()
                    .setColor(0xff0000)
                    .addField("Error", "Fresh isn't on te Voice Channel")
                    .setTimestamp();
                    return message.channel.send(E42);
                }
                if (!args[1]) {
                    var E40 = new Discord.RichEmbed()
                    .setColor(0xff0000)
                    .addField("Volume:", `The current volume is **${serverQueue.volume}**`)
                    .setTimestamp();
                    return message.channel.send(E40);
                }
                serverQueue.volume = args[1];
                serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
                {
                    var E40 = new Discord.RichEmbed()
                    .setColor(0xff0000)
                    .addField("Volume:", `Volume was set to **${args[1]}**`)
                    .setTimestamp();
                    return message.channel.send(E40);
                }
                    break;
                case "now-playing" :
                if (!serverQueue) {
                    var E44 = new Discord.RichEmbed()
                    .setColor(0xff0000)
                    .addField("Error", "The playlist is empty")
                    .setTimestamp();
                    return message.channel.send(E44);
                }
                    var E45 = new Discord.RichEmbed()
                    .setColor(0xff0000)
                    .addField("Now playing:", `**${serverQueue.songs[0].title}**`);
                    return message.channel.send(E45);
                    break;
                case "playlist" :
                if (!serverQueue) {
                    var E43 = new Discord.RichEmbed()
                    .setColor(0xff0000)
                    .addField("Error", "The playlist is empty")
                    .setTimestamp();
                    return message.channel.send(E43);
                }
                var E45 = new Discord.RichEmbed()
                    .setColor(0xff0000)
                    .addField("**Playlist:**", `${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
                    
        **Now playing:** ${serverQueue.songs[0].title}
                            `);
                    return message.channel.send(E45);
                    break;
                case "pause" :
                if (serverQueue && serverQueue.playing) {
                    serverQueue.playing = false;
                    serverQueue.connection.dispatcher.pause();
                        var E47 = new Discord.RichEmbed()
                        .setColor(0xff0000)
                        .addField("Pause", ` ${serverQueue.songs[0].title} was put on the pause`)
                        .setTimestamp();
                        return message.channel.send(E47);
                }
                    var E46 = new Discord.RichEmbed()
                    .setColor(0xff0000)
                    .addField("Error", "Fresh isn't on a Voice Channel")
                    .setTimestamp();
                    return message.channel.send(E46);
                    break;
                case "resume" :
                if (serverQueue && !serverQueue.playing) {
                    serverQueue.playing = true;
                    serverQueue.connection.dispatcher.resume();
                    var E48 = new Discord.RichEmbed()
                        .setColor(0xff0000)
                        .addField("Resume", `The video continues ${serverQueue.songs[0].title}`)
                        .setTimestamp();
                        return message.channel.send(E48);
                }
                var E51 = new Discord.RichEmbed()
                    .setColor(0xff0000)
                    .addField("Eroare", "Fresh isn't on a Voice Channel")
                    .setTimestamp();
                    return message.channel.send(E51);
                    break;
                default:
                var T = new Discord.RichEmbed()
                .setColor(0xff0000)
                .addField("Invalid command",'Try *help')
                message.channel.sendMessage(T); 
            }
        });
        async function handleVideo(video, msg, voiceChannel, playlist = false) {
            const serverQueue = queue.get(msg.guild.id);
            console.log(video);
            const song = {
                id: video.id,
                title: Discord.escapeMarkdown(video.title),
                url: `https://www.youtube.com/watch?v=${video.id}`
            };
            if (!serverQueue) {
                const queueConstruct = {
                    textChannel: msg.channel,
                    voiceChannel: voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 5,
                    playing: true
                };
                queue.set(msg.guild.id, queueConstruct);
        
                queueConstruct.songs.push(song);
        
                try {
                    var connection = await voiceChannel.join();
                    queueConstruct.connection = connection;
                    play(msg.guild, queueConstruct.songs[0]);
                } catch (error) {
                    console.error(`I could not join the voice channel: ${error}`);
                    queue.delete(msg.guild.id);
                    return msg.channel.send(`I could not join the voice channel: ${error}`);
                }
            } else {
                serverQueue.songs.push(song);
                console.log(serverQueue.songs);
                if (playlist) return undefined;
                else  {
                var E35 = new Discord.RichEmbed()
                .setColor(0xff0000)
                .addField(":white_check_mark: Playlist:", `**${song.title}** a fost adougata in playlist`)
                .setTimestamp();
                 return msg.channel.send(E35)
                }
            }
            return undefined;
        }
        
        function play(guild, song , message , channel) {
            const serverQueue = queue.get(guild.id);
        
            if (!song) {
                serverQueue.voiceChannel.leave();
                queue.delete(guild.id);
                return;
            }
            console.log(serverQueue.songs);
        
            const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
                .on('end', reason => {
                    if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
                    else console.log(reason);
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0]);
                })
                .on('error', error => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            
                var E50 = new Discord.RichEmbed()
                .setColor(0xff0000)
                .addField("Now Playing", `**${song.title}** `)
                .setTimestamp();
                serverQueue.textChannel.send(E50) 
};

bot.login('NDU2MTQ0MzIzNDc4ODE0NzIw.DgGTvQ.RyLkAuWYmJwKi2HfiMeKoJRPx2g');