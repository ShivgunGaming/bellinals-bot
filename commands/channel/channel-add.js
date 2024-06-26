const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js')
const errorEmbed = require('../../embed/error-embed')
const successEmbed = require('../../embed/success-embed')
const infoEmbed = require('../../embed/info-embed')
const warningEmbed = require('../../embed/warning-embed')
const ManageChannels = require('../../db/manage-channels')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channel-add')
    .setDescription('Add the verify bot to this channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    try {
      const channel = interaction.channel
      const botMember = interaction.channel.guild.members.cache.get(interaction.client.user.id)
      const hasPermissions = botMember
        .permissionsIn(channel)
        .has([
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ManageRoles,
          PermissionFlagsBits.UseApplicationCommands,
        ])
      if (hasPermissions === false) {
        const warning = warningEmbed(
          'Missing Permissions',
          "The bot doesn't have the relevant permissions to respond, if this is a private channel you must specifically add the bot's role to the channel."
        )
        return interaction.reply({
          embeds: [warning],
          ephemeral: true,
        })
      }

      await ManageChannels.create({
        channelId: interaction.channelId,
      })

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('verifyNFT').setLabel('Verify').setStyle(ButtonStyle.Primary)
      )

      const info = infoEmbed(
        'Verify your ownership',
        'Use a BIP-322 signature to prove that you own an inscription to receive a special holder role.'
      )

      await interaction.channel.send({
        message: '',
        components: [row],
        embeds: [info],
      })

      const embed = successEmbed('Add verify bot', 'Successfully added the bot to this channel.')

      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      })
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        const embed = warningEmbed('Add verify bot', 'The bot is already in the channel.')
        return interaction.reply({ embeds: [embed], ephemeral: true })
      }

      const embed = errorEmbed(error)
      return interaction.reply({ embeds: [embed], ephemeral: true })
    }
  },
}
