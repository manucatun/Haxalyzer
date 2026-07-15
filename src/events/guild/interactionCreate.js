const { asegurar } = require("../../structures/Funciones.js");
const serverSchema = require("../../models/server.js");

module.exports = async (client, interaction) => {
  if (!interaction.guild || !interaction.user || !interaction.channel) return;

  await asegurar(interaction.guild.id, interaction.user.id);
  const serverData = await serverSchema.findOne({
    guildID: interaction.guild.id,
  });

  const comando = client.slashCommands.get(interaction?.commandName);
  if (comando) {
    if (comando.ownerOnly) {
      const dueños = process.env.OWNER_ID.split(" ");
      if (!dueños.includes(interaction.user.id)) {
        return interaction.reply({
          content:
            this.languages[serverData.language].interactionCreate.ownerOnly,
          ephemeral: true,
        });
      }
    }
  }

  try {
    comando.execute(client, interaction, "/");
  } catch (e) {
    console.log(e);
    interaction.reply({
      content: this.languages[serverData.language].global.error,
      ephemeral: true,
    });
  }
};
