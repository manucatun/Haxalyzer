import { glob } from "glob";

module.exports = class BotUtils {
  constructor(client) {
    this.client = client;
  }

  async loadFiles(dirName) {
    const archivos = await glob(
      `${process.cwd().replace(/\\/g, "/")}/${dirName}/**/*.js`,
    );
    archivos.forEach(
      (archivo) => (archivo) => delete require.cache[require.resolve(archivo)],
    );
    return archivos;
  }
};
