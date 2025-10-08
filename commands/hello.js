import { MessageFlags, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Say hi to the bot!"),


  async execute(data) {
    const interaction = data.interaction;
     await interaction.reply(`👋 Halo <@${interaction.user.id}>`);
     await interaction.reply(`testing <@${interaction.user.id}>`);
  },
};
