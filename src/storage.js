
const store = new Map();

const contributorList = [
  "1273204997013897279"
]

const developerList = [
  "1115633140204052582"
]

export function getContributorList() {
  return contributorList;
}

export function getDeveloperList() {
  return contributorList;
}

export async function storeDiscordTokens(userId, tokens) {
  await store.set(`discord-${userId}`, tokens);
}

export async function getDiscordTokens(userId) {
  return store.get(`discord-${userId}`);
}