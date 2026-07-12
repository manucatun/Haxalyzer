import {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType,
  SlashCommandBuilder,
  PresenceUpdateStatus,
  Collection,
} from "discord.js";
import BotUtils from "./Utils.js";

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
        status: "online",
      },
    },
  ) {
    super(options);
  }
};
