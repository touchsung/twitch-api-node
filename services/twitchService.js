const axios = require("axios");
const dotenv = require("dotenv").config();

export async function getAccessToken() {
  try {
    const response = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      null,
      {
        params: {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: "client_credentials",
        },
      }
    );

    const { access_token } = response.data;
    return access_token;
  } catch (error) {
    console.error("Error retrieving access token:", error.response.data);
    throw error;
  }
}

export async function getBroadcasterId(username, clientId) {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get("https://api.twitch.tv/helix/users", {
      headers: {
        "Client-Id": clientId,
        Authorization: "Bearer " + accessToken,
      },
      params: {
        login: username,
      },
    });

    const { data } = response.data;
    if (data.length > 0) {
      const broadcasterId = data[0].id;
      return broadcasterId;
    } else {
      throw new Error("Broadcaster ID not found");
    }
  } catch (error) {
    console.error(
      "Error retrieving broadcaster ID:",
      error.response?.data || error.message
    );
    throw error;
  }
}
