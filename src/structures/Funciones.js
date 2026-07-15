const serverSchema = require("../../models/server.js");

module.exports = {
  asegurar,
  translate,
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

async function translate(
  client,
  guildid,
  key,
  variables = {},
  defaultLang = "en-US",
) {
  const serverData = await serverSchema.findOne({ guildID: guildid });
  const idioma = serverData?.language || defaultLang;

  const traducciones = client.languages[idioma];
  const traduccionesDefault = client.languages[defaultLang];

  const keyParts = key.split(".");
  let mensaje = traducciones;

  for (const part of keyParts) {
    if (mensaje && mensaje[part]) {
      mensaje = mensaje[part];
    } else {
      console.log(
        `🚨 Clave de traducción no encontrada: ${key} en el idioma ${idioma}`
          .bgRed.bold,
      );
      mensaje = traduccionesDefault;
      for (const defaultPart of keyParts) {
        if (mensaje && mensaje[defaultPart]) {
          mensaje = mensaje[defaultPart];
        } else {
          mensaje = `> <:translate:1526798476023697418> An error occurred during the translation of the message. Please contact the bot developer to fix this issue.`;
          console.log(
            `🚨 Clave de traducción no encontrada: ${key} en el idioma por defecto ${defaultLang}`
              .bgRed.bold,
          );
        }
      }
      break;
    }
  }

  if (typeof mensaje === "string" && Object.keys(variables).length > 0) {
    for (const [key, value] of Object.entries(variables)) {
      mensaje = mensaje.replace(new RegExp(`{${key}}`, "g"), value);
    }
  }

  return mensaje;
}
