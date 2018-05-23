/*
 *   This file is part of discord-self-bot
 *   Copyright (C) 2017-2018 Favna
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, version 3 of the License
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const Discord = require('discord.js'),
  {Command} = require('discord.js-commando'),
  random = require('node-random'),
  {deleteCommandMessages, momentFormat} = require('../../util.js');

module.exports = class fightCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'fight',
      memberName: 'fight',
      group: 'games',
      aliases: ['combat'],
      description: 'Pit two things against each other in a fight to the death',
      format: 'FirstFighter, SecondFighter',
      examples: ['fight Favna Chuck Norris'],
      guildOnly: false,
      args: [
        {
          key: 'fighterOne',
          prompt: 'Who or what is the first fighter?',
          type: 'string'
        },
        {
          key: 'fighterTwo',
          prompt: 'What should fighter one be fighting?',
          type: 'string'
        }
      ]
    });
  }

  run (msg, args) {
    const fighterEmbed = new Discord.MessageEmbed();

    fighterEmbed
      .setColor(msg.member !== null ? msg.member.displayHexColor : '#FF0000')
      .setTitle('🥊 Fight Results 🥊')
      .setThumbnail('http://i.imgur.com/LxPAE2f.png');

    if (args.fighterOne.toLowerCase() === 'chuck norris' || args.fighterTwo.toLowerCase() === 'chuck norris') {
      if (args.fighterOne.toLowerCase() === 'favna' || args.fighterTwo.toLowerCase() === 'favna') {
        fighterEmbed
          .addField('All right, you asked for it...', '***The universe was destroyed due to this battle between two unstoppable forces. Good Job.***')
          .setImage('https://i.imgur.com/Witob4j.png');
      } else {
        fighterEmbed
          .addField('You fokn wot m8', '***Chuck Norris cannot be beaten***')
          .setImage('https://i.imgur.com/WCFyXRr.png');
      }

      deleteCommandMessages(msg, this.client);

      return msg.embed(fighterEmbed);
    }
    if (args.fighterOne.toLowerCase() === 'favna' || args.fighterTwo.toLowerCase() === 'favna') {
      fighterEmbed
        .addField('You got mega rekt', '***Favna always wins***')
        .setImage('https://i.imgur.com/XRsLP7Q.gif');

      deleteCommandMessages(msg, this.client);

      return msg.embed(fighterEmbed);
    }
    random.integers({number: 2}, (error, randoms) => {
      if (!error) {
        const fighterOneChance = parseInt(randoms[0], 10),
          fighterTwoChance = parseInt(randoms[1], 10),
          loser = Math.min(fighterOneChance, fighterTwoChance) === fighterOneChance ? args.fighterOne : args.fighterTwo,
          winner = Math.max(fighterOneChance, fighterTwoChance) === fighterOneChance ? args.fighterOne : args.fighterTwo;

        fighterEmbed
          .addField('🇼 Winner', `**${winner}**`, true)
          .addField('🇱 Loser', `**${loser}**`, true)
          .setFooter(`${winner} bodied ${loser} on ${momentFormat(new Date(), this.client)}`);

        deleteCommandMessages(msg, this.client);

        return msg.embed(fighterEmbed);
      }

      return msg.reply('⚠️ an error occurred pitting these combatants against each other 😦');
    });

    return null;
  }
};