const express = require("express");
const client = require("./utils/streamlabsOBSClient");
const twitchClient = require("./utils/connectTwitch");
const app = express();
const port = process.env.PORT || 3000;

const main = async () => {
  twitchClient.connect();

  setInterval(async () => {
    await client.connect();
    client.walkSourcePosition("Pc", "Pet");
  }, 500);

  twitchClient.on("message", async (channel, tags, message, self) => {
    if (message.toLocaleLowerCase().trim() === "!feed") {
      client.increaseSourceScale("Pc", "Pet");
    }
  });

  app.get("/health", (req, res) => {
    res.send("Status OK");
  });
};

main();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
