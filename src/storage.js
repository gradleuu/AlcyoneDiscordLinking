const store = new Map();

const hmList = [];

const adminList = [
  "1312733852963438653" /*Rattmann*/
];

const hordeMaster = [];
[];

const moderatorsList = [
  "1273204997013897279" /*KudzuBomb*/
];

export function isHM(userId) {
  return hmList.includes(userId);
}

export function isAdmin(userId) {
  return adminList.includes(userId);
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
