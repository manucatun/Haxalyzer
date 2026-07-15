const serverData = require("../../models/server.js");

module.exports = {
  asegurar,
};

async function asegurar(guildid, userid) {
  if (guildid) {
    try {
      let server = await serverData.findOne({ guildID: guildid });
      if (!server) {
        server = new serverData({ guildID: guildid });
        await server.save();

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
