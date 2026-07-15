const mongoose = require("mongoose");
const {
  WebhookClient,
  EmbedBuilder,
  version: djsversion,
} = require("discord.js");
const webhook = new WebhookClient({ url: process.env.WEBHOOK });

/* Conexión a la base de datos */
module.exports = async (client) => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log(`🌐 Conectado a la base de datos`.brightBlue.bold);
    })
    .catch((e) => {
      console.log(`🚨 Error al conectar a la base de datos`.bgRed.bold);
      console.log(e);
    });

  console.log(`🌐 Conectando a la base de datos...`.yellow);
  /* Conexión a la base de datos */

  if (client?.application?.commands) {
    client.application.commands.set(client.slashArray);
    console.log(
      `📫 ${client.slashArray.length} Slash Commands Registrados`.brightGreen
        .bold,
    );
  }

  webhook.send({
    embeds: [
      new EmbedBuilder()
        .setAuthor({
          name: `${client.user.username} iniciado correctamente`,
          iconURL: client.user.avatarURL({ extension: "png", size: 1024 }),
        })
        .setDescription(
          `
                > **Inicio del Bot:** <t:${Math.round(Date.now() / 1000)}>
                > **Tiempo de Actividad:** <t:${Math.round(
                  Date.now() / 1000,
                )}:R>
                > **Estado de Actividad:** ${
                  process.env.ACTIVITY_TYPE
                } ${process.env.ACTIVITY}
                > **Versión de Discord.JS:** v${djsversion}
                > **Versión de Node.JS:** ${process.version}
                `,
        )
        .addFields({
          name: `Slash Commands`,
          value: `\`\`\`yml\n${client.slashCommands.size} cargados\`\`\``,
          inline: true,
        })
        .setTimestamp(),
    ],
  });
};
