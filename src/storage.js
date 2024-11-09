
const store = new Map();

const contributorList = [
  "1273204997013897279",
  "660917034766565377"
]

const developerList = [
  "1115633140204052582"
]

const apoovedList = [
  "1115633140204052582"
]

export function isContributor(userId) { 
  return contributorList.includes(userId);
}

export function isDeveloper(userId) {
  return developerList.includes(userId);
}

export function isApooved(userId) {
  return apoovedList.includes(userId);
}

export async function storeDiscordTokens(userId, tokens) {
  await store.set(`discord-${userId}`, tokens);
}

export async function getDiscordTokens(userId) {
  return store.get(`discord-${userId}`);
}