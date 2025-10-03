// lib/storage.ts
import { Player } from "./types";
const STORAGE_KEY = "cod_players";

export const storage = {
  // プレイヤー全員を取得
  getPlayers: (): Player[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // プレイヤーを保存
  savePlayers: (players: Player[]): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  },

  // プレイヤーを追加
  addPlayer: (player: Player): void => {
    const players = storage.getPlayers();
    players.push(player);
    storage.savePlayers(players);
  },

  // プレイヤーを更新
  updatePlayer: (id: string, updatedPlayer: Player): void => {
    const players = storage.getPlayers();
    const index = players.findIndex((p) => p.id === id);
    if (index !== -1) {
      players[index] = updatedPlayer;
      storage.savePlayers(players);
    }
  },

  // プレイヤーを削除
  deletePlayer: (id: string): void => {
    const players = storage.getPlayers();
    const filtered = players.filter((p) => p.id !== id);
    storage.savePlayers(filtered);
  },
};
