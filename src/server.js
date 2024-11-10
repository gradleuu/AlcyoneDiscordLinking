import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import config from "./config.js";
import * as discord from "./discord.js";
import * as storage from "./storage.js";
import * as somnaStaff from "./somnaStaff.js";

const dbUri =
  "mongodb+srv://poster:J5r3xlMyJ5k36U9t@somnacreare.in65n.mongodb.net/?retryWrites=true&w=majority&appName=Somnacreare";

mongoose
  .connect(dbUri)
  .then((result) => console.log("Connected to Mongo"))
  .catch((err) => console.log(err));

/**
 * Main HTTP server used for the bot.
 */

const app = express();

app.use(cookieParser(config.COOKIE_SECRET));

/**
 * Just a happy little route to show our server is up.
 */
app.get("/", (req, res) => {
  res.send("👋");
});

/**
 * Route configured in the Discord developer console which facilitates the
 * connection between Discord and any additional services you may use.
 * To start the flow, generate the OAuth2 consent dialog url for Discord,
 * and redirect the user there.
 */
app.get("/linked-role", async (req, res) => {
  const { url, state } = discord.getOAuthUrl();

  // Store the signed state param in the user's cookies so we can verify
  // the value later. See:
  // https://discord.com/developers/docs/topics/oauth2#state-and-security
  res.cookie("clientState", state, { maxAge: 1000 * 60 * 5, signed: true });

  // Send the user to the Discord owned OAuth2 authorization endpoint
  res.redirect(url);
});

/**
 * Route configured in the Discord developer console, the redirect Url to which
 * the user is sent after approving the bot for their Discord account. This
 * completes a few steps:
 * 1. Uses the code to acquire Discord OAuth2 tokens
 * 2. Uses the Discord Access Token to fetch the user profile
 * 3. Stores the OAuth2 Discord Tokens in Redis / Firestore
 * 4. Lets the user know it's all good and to go back to Discord
 */
app.get("/discord-oauth-callback", async (req, res) => {
  try {
    // 1. Uses the code and state to acquire Discord OAuth2 tokens
    const code = req.query["code"];
    const discordState = req.query["state"];

    // make sure the state parameter exists
    const { clientState } = req.signedCookies;
    if (clientState !== discordState) {
      console.error("State verification failed.");
      return res.sendStatus(403);
    }

    const tokens = await discord.getOAuthTokens(code);

    // 2. Uses the Discord Access Token to fetch the user profile
    const meData = await discord.getUserData(tokens);
    const userId = meData.user.id;
    await storage.storeDiscordTokens(userId, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + tokens.expires_in * 1000,
    });

    const newStaff = new SomnaStaff({
      userId: userId,
      accessToken: tokens,
    });

    newStaff.save();
    console.log(tokens);
    console.log(userId);

    // 3. Update the users metadata, assuming future updates will be posted to the `/update-metadata` endpoint
    await updateMetadata(userId);

    res.send("You can go back to Discord now");
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

/**
 * Example route that would be invoked when an external data source changes.
 * This example calls a common `updateMetadata` method that pushes static
 * data to Discord.
 */
app.post("/update-metadata", async (req, res) => {
  try {
    const userId = req.body.userId;
    await updateMetadata(userId);

    res.sendStatus(204);
  } catch (e) {
    res.sendStatus(500);
  }
});

/**
 * Given a Discord UserId, push static make-believe data to the Discord
 * metadata endpoint.
 */
async function updateMetadata(userId) {
  // Fetch the Discord tokens from storage
  const tokens = await storage.getDiscordTokens(userId);

  let metadata = {};
  try {
    // Fetch or generate metadata
    metadata = {
      isdeveloper: storage.isDeveloper(userId),
      iscontributor: storage.isContributor(userId),
      ismod: storage.isModerator(userId),
      issfs: storage.isSfS(userId),
    };
  } catch (e) {
    e.message = `Error fetching external data: ${e.message}`;
    console.error(e);
  }

  await discord.pushMetadata(userId, tokens, metadata);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
