const tmi = require("tmi.js");

const twitchConfig = {
  channels: [process.env.TWITCH_CHANNEL],
};

const twitchClient = new tmi.client(twitchConfig);
twitchClient.on("connected", () => {
  console.log("Connected to Twitch chat");
});

module.exports = twitchClient;
