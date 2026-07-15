const serverSchema = require("../../models/server.js");

module.exports = {
  asegurar,
};

async function asegurar(guildid, userid) {
  if (guildid) {
    try {
      let serverData = await serverSchema.findOne({ guildID: guildid });
      if (!serverData) {
        serverData = new serverSchema({ guildID: guildid });
        await serverData.save();

        console.log(
          `💾 Servidor ${guildid} asegurado en la base de datos`.purple.bold,
        );
      }
    } catch (e) {
      console.error(`🚨 Error al asegurar el servidor ${guildid}`.bgRed.bold);
      console.error(e);
    }
  }
}
