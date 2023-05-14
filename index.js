const express = require("express");
const client = require("./utils/streamlabsOBSClient");
const app = express();
const port = process.env.PORT || 3000;

app.get("/feed-pet", async (req, res) => {
  await client.connect();
  client.increaseSourceScale("Pc", "Pet");
  res.send("Success");
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
