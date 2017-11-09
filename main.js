const Discord = require('discord.js');
const getter = require('booru-fetcher')
var fs = require("fs");
const client = new Discord.Client();

var commands = require("./maya.json");
//var util = require('../akirabot/utilities.js');

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    var param = message.content.split(" ");
    switch(param[0]){
        case "+reactadd":
            var url = param[1];
            param.shift();
            param.shift();
            var name = param.join(" ").toLowerCase();

            if(commands[name] != undefined){
                commands[name].content.push(url);
                //util.save(commands,"maya");
                message.reply("Command udpated");
            }else{
                var content = [url];

                commands[name] = {
                    "content": content,
                };

                //util.save(commands,"maya");
                message.reply("Command added");
            }
            break;

        case "+reactremove":
            param.shift();
            var name = param.join(" ").toLowerCase();
            if(commands[name] != undefined){
                delete commands[name];
                message.reply("reaction removed");
            }else{
                message.reply("The reaction you are trying to remove doesnt exist");
            }
            break;

        case "+senpai":
            message.delete();
            if(message.member.roles.find("name","Senpai") != null){
                if(message.member.roles.find("name","Emperor") == null){
                    message.member.addRole(message.guild.roles.find("name","Emperor"));
                }else{
                    message.member.removeRole(message.guild.roles.find("name","Emperor"));
                }
            }else{
                message.author.send("What do you need help with? (Please reply with only one message)").then(advise => {
                    var collector = advise.channel.createMessageCollector(m => m==m,{max:1});
                    collector.on('collect', m2 => {
                        advise.delete();
                        m2.delete();
                        m2.channel.send("Your request has been sent, please wait patiently");
                        message.guild.members.get("194614248511504385").send("Request from " + message.author.username + "```" + m2.content + "```");
                    });
                });
            }
            break;

        case "+marry":
            if(message.mentions.users.has(client.user)){
                var collector = message.channel.createMessageCollector(m => m.embeds.length>0,{max:1});
                collector.on('collect', m => {
                    if(message.author.id == "305010021954093057"){
                        m.channel.send("Yes");
                        m.channel.send("I'll gladly marry you, Kirei")
                    }else{
                        m.channel.send("No");
                        m.channel.send("Only Kirei can have my hand");
                    }
                });
            }
            break;

        default:
            if(message.mentions.users.has(client.user)){
                switch(param[1]){
                    case "send":
                        var search = param[2];
                        param.splice(0,3);
                        var reason = param.join(" ");
                        var mprime;

                        message.delete();
                       message.channel.send("Working on it...").then(m=>mprime=m);
                       getter.getRandom(search, (url)=>{
                           if(url !=null){
                                var author;
                                if(message.member.nickname == null){
                                    author = message.author.username;
                                }else{
                                    author = message.member.nickname;
                                }


                                const embed = {
                                  "color": 8176039,
                                  "image": {
                                    "url": url
                                  },
                                  "author": {
                                    "name": author,
                                    "icon_url": message.author.displayAvatarURL()
                                  }
                                };
                                mprime.edit(reason, { embed });
                           }else{
                               mprime.edit("Sorry, couldnt find anything :c");
                           }
                        });
                        break;
                };
            }else{
                Object.keys(commands).forEach(function(key){
                    if(message.content.toLowerCase().includes(key)){
                        var command = commands[key]

                        message.channel.send(new Discord.Attachment(command.content[0]));
                        if(command.content.length>1){
                            var first = command.content[0];
                            for(var i=1;i<command.content.length;i++){
                                command.content[i-1] = command.content[i];
                            };
                            command.content[command.content.length - 1] = first;
                            commands[key] = command;
                            util.save(commands,"maya");
                        }
                    }
                })
            }

            break;
    }
});

client.login(process.env.token);
