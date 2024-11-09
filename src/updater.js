import * as server from "./server.js";

const tokens = storage.getDiscordTokens(userId);

let server.metadata = {};
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
