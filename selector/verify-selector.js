const {
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js')
const jwt = require('jsonwebtoken')
const randomWords = require('random-words')
const BipMessages = require('../db/bip-messages')
const { UserAddresses } = require('../db/user-addresses')
const { checkInscriptionsAndBrc20s } = require('../utils/verify-ins-brc20')
const infoEmbed = require('../embed/info-embed')
const errorEmbed = require('../embed/error-embed')

const { VERIFY_SELECTOR, MANUAL_VERIFICATION, ADD_NEW_WALLET_ADDRESS } = require('../button/verify')

const MODAL_ID = 'verifyNFTModal'
const SIGNATURE_ID = 'signatureInput'
const ADDRESS = 'addressInput'

const generateAccessToken = (userId) => {
  return jwt.sign(userId, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRE_IN })
}

const getMessage = async (interaction) => {
  let message = ''

  if (process.env.BIP_MESSAGE) message = process.env.BIP_MESSAGE
  else {
    message = 'munch-' + randomWords({ exactly: 3, join: '-' })
  }

  const bipMessage = await BipMessages.findOne({
    where: {
      channelId: interaction.channelId,
      userId: interaction.user.id,
    },
  })

  if (bipMessage) {
    await BipMessages.update(
      {
        message,
      },
      {
        where: {
          channelId: interaction.channelId,
          userId: interaction.user.id,
        },
      }
    )
  } else {
    await BipMessages.create({
      channelId: interaction.channelId,
      userId: interaction.user.id,
      message,
    })
  }

  return message
}

module.exports = {
  data: VERIFY_SELECTOR,
  async execute(interaction) {
    try {
      const selected = interaction.values[0]
      const message = await getMessage(interaction)

      if (selected === MANUAL_VERIFICATION) {
        const modal = new ModalBuilder().setCustomId(MODAL_ID).setTitle('Verify Your Ownership')

        const addressInput = new TextInputBuilder()
          .setCustomId(ADDRESS)
          .setLabel('Wallet Address')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(70)

        const signatureInput = new TextInputBuilder()
          .setCustomId(SIGNATURE_ID)
          .setLabel('BIP-322 Signature')
          .setStyle(TextInputStyle.Short)
          .setMaxLength(120)

        const bipMessageInput = new TextInputBuilder()
          .setCustomId('bipMessage')
          .setLabel('BIP-322 Message')
          .setStyle(TextInputStyle.Short)
          .setValue(message)
          .setRequired(false)

        const addressActionRow = new ActionRowBuilder().addComponents(addressInput)
        const signatureActionRow = new ActionRowBuilder().addComponents(signatureInput)
        const bipMessageActionRow = new ActionRowBuilder().addComponents(bipMessageInput)

        modal.addComponents(addressActionRow, signatureActionRow, bipMessageActionRow)

        await interaction.showModal(modal)
      } else if (selected === ADD_NEW_WALLET_ADDRESS) {
        const generatedToken = generateAccessToken({ userId: interaction.user.id, channelId: interaction.channelId })
        const embed = infoEmbed('Wallet Link', 'Use your web wallet to easily verify an address.')

        const connectBtn = new ButtonBuilder()
          .setLabel("Let's Go")
          .setStyle(ButtonStyle.Link)
          .setURL(`${process.env.VERIFICATION_URL}?auth=${generatedToken}&message=${encodeURIComponent(message)}`)
        const connectActionRow = new ActionRowBuilder().addComponents(connectBtn)

        return interaction.update({ embeds: [embed], components: [connectActionRow], ephemeral: true })
      } else {
        await interaction.deferReply({
          ephemeral: true,
        })

        const userAddress = await UserAddresses.findOne({
          where: {
            id: parseInt(selected),
          },
        })

        checkInscriptionsAndBrc20s(interaction, userAddress)
      }
    } catch (error) {
      const embed = errorEmbed(error)
      return interaction.update({ embeds: [embed], components: [], ephemeral: true })
    }
  },
  MODAL_ID,
  SIGNATURE_ID,
  ADDRESS,
}
