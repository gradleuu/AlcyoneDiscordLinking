
const store = new Map();

const contributorList = [
  "1273204997013897279",
  "660917034766565377"
]

const developerList = [
  "1115633140204052582"
]

const socialFirstStaffList = [
  "1273204997013897279"
]

const moderatorsList = [
  "1273204997013897279"
]

export function isContributor(userId) { 
  return contributorList.includes(userId);
}

export function isDeveloper(userId) {
  return developerList.includes(userId);
}

export function isSfS(userId) {
  return socialFirstStaffList.includes(userId);
}

export function isModerator(userId) {
  return moderatorsList.includes(userId);
}

export async function storeDiscordTokens(userId, tokens) {
  await store.set(`discord-${userId}`, tokens);
}

export async function getDiscordTokens(userId) {
  return store.get(`discord-${userId}`);
}