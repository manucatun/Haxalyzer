const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
  guildID: {
    type: String,
    default: "",
    required: true,
    unique: true,
    index: true,
  },
  lang: {
    type: String,
    default: "en-US",
    enum: ["en-US", "es-ES", "pt-BR"],
  },
  premium: {
    type: String,
    default: "",
  },
});

const model = new mongoose.model("ServerData", serverSchema);
module.exports = model;
