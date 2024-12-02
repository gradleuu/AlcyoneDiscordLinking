const store = new Map();

const contributorList = ["399612326250020896"/*Mirani*/, "533371227369373727"/*Ricoshet*/];

const developerList = ["1312733852963438653"/*Visual*/, "536564380436004864"/*QWU*/];

const moderatorsList = ["1273204997013897279"/*KudzuBomb*/, "660917034766565377"/*JetRace*/];

export function isContributor(userId) {
  return contributorList.includes(userId);
}

export function isDeveloper(userId) {
  return developerList.includes(userId);
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
