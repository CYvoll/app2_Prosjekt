import { memoryStore } from "./memoryStore.mjs";

export function create(game) {
  memoryStore.games[game.id] = game;
  return game;
}

export function getById(id) {
  return memoryStore.games[id] || null;
}

export function getAll() {
  return Object.values(memoryStore.games);
}

export function getByUserId(userId) {
  return Object.values(memoryStore.games).filter((game) => game.userId === userId);
}

export function getStatsByUserId(userId) {
  const userGames = getByUserId(userId);

  const stats = {
    wins: 0,
    losses: 0,
    draws: 0,
    total: userGames.length
  };

  for (const game of userGames) {
    if (game.result === "win") stats.wins += 1;
    if (game.result === "loss") stats.losses += 1;
    if (game.result === "draw") stats.draws += 1;
  }

  return stats;
}