const express = require("express");
const client = require("./utils/streamlabsOBSClient");
const app = express();
const tmi = require("tmi.js");

const port = process.env.PORT || 3000;

const twitchConfig = {
  channels: [process.env.TWITCH_CHANNEL],
};

const twitchClient = new tmi.client(twitchConfig);
twitchClient.on("connected", () => {
  console.log("Connected to Twitch chat");
});

twitchClient.connect();

twitchClient.on("message", async (channel, tags, message, self) => {
  if (message.toLocaleLowerCase() === "!feed") {
    await client.connect();
    client.increaseSourceScale("Pc", "Pet");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
