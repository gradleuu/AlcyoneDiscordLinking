const store = new Map();

const opList = [];

const developerList = ["1312733852963438653" /*Rattmann*/];

const hordeMaster = [];

const moderatorsList = [
  "1273204997013897279" /*KudzuBomb*/,
  "1312733852963438653" /*Rattmann*/,
  "660917034766565377" /*JetRace*/,
];

export function isHM(userId) {
  return opList.includes(userId);
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
