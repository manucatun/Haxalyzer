const {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType,
  SlashCommandBuilder,
  PresenceUpdateStatus,
  Collection,
} = require("discord.js");
const BotUtils = require("./Utils.js");

module.exports = class extends Client {
  constructor(
    options = {
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
      ],
      partials: [
        Partials.User,
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
        Partials.GuildMember,
      ],

      allowedMentions: {
        parse: ["users"],
        repliedUser: true,
      },
      presence: {
        activities: [
          {
            name: process.env.ACTIVITY,
            type: ActivityType[process.env.ACTIVITY_TYPE],
          },
        ],
        status: PresenceUpdateStatus.DoNotDisturb,
      },
    },
  ) {
    super(options);

    this.slashCommands = new Collection();
    this.slashArray = [];
    this.languages = {};

    this.utils = new BotUtils(this);

    this.start();
  }

  async start() {
    await this.loadEvents();
    await this.loadHandlers();
    await this.loadLanguages();
    await this.loadSlashCommands();

    this.login(process.env.TOKEN);
  }

  async loadEvents() {
    console.log("🔔 Cargando eventos...".yellow);
    this.removeAllListeners();

    const rutaArchivos = await this.utils.loadFiles("/src/events");
    if (rutaArchivos.length) {
      rutaArchivos.forEach((archivo) => {
        try {
          const evento = require(archivo);
          const nombreEvento = archivo
            .split("\\")
            .pop()
            .split("/")
            .pop()
            .split(".")[0];
          this.on(nombreEvento, evento.bind(null, this));
        } catch (e) {
          console.log(`🚨 Error al cargar el archivo (${archivo})`.bgRed);
          console.log(e);
        }
      });
    }

    console.log(`🔔 ${rutaArchivos.length} Eventos Cargados`.brightGreen.bold);
  }

  async loadHandlers() {
    console.log("📂 Cargando Handlers...".yellow);

    const rutaArchivos = await this.utils.loadFiles("/src/handlers");
    if (rutaArchivos.length) {
      rutaArchivos.forEach((archivo) => {
        try {
          require(archivo)(this);
        } catch (e) {
          console.log(`🚨 Error al cargar el archivo (${archivo})`.bgRed);
          console.log(e);
        }
      });
    }

    console.log(`📂 ${rutaArchivos.length} Handlers Cargados`.brightGreen.bold);
  }

  async loadLanguages() {
    console.log("🌐 Cargando idiomas...".yellow);

    const rutaArchivos = await this.utils.loadFiles("/src/lang");
    if (rutaArchivos.length) {
      rutaArchivos.forEach((archivo) => {
        try {
          const idioma = archivo.split("/").pop().split(".")[0];
          const traducciones = require(archivo);

          this.languages[idioma] = traducciones;

          console.log(`🌐 Idioma cargado: ${idioma}`.brightBlue);
        } catch (e) {
          console.log(`🚨 Error al cargar el archivo (${archivo})`.bgRed);
          console.log(e);
        }
      });
    }

    console.log(
      `🌐 ${Object.keys(this.languages).length} Idiomas Cargados`.brightGreen
        .bold,
    );
  }

  async loadSlashCommands() {
    console.log("📫 Cargando Slash Commands...".yellow);
    this.slashCommands.clear();
    this.slashArray = [];

    const rutaArchivos = await this.utils.loadFiles("/src/commands");
    if (rutaArchivos.length) {
      rutaArchivos.forEach((archivo) => {
        try {
          const comando = require(archivo);
          const nombreComando = archivo
            .split("\\")
            .pop()
            .split("/")
            .pop()
            .split(".")[0];

          comando.CMD.name = nombreComando;
          if (nombreComando) this.slashCommands.set(nombreComando, comando);
          this.slashArray.push(comando.CMD.toJSON());
        } catch (e) {
          console.log(`🚨 Error al cargar el archivo (${archivo})`.bgRed);
          console.log(e);
        }
      });
    }

    console.log(
      `📫 ${rutaArchivos.length} Slash Commands Cargados`.brightGreen.bold,
    );

    if (this?.application?.commands) {
      await this.application.commands.set(this.slashArray);
      console.log(
        `📫 ${this.slashArray.length} Slash Commands Registrados`.brightGreen
          .bold,
      );
    }
  }
};
