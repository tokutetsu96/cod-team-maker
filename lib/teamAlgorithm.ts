// lib/teamAlgorithm.ts
import { Player, Team } from "./types";

export const divideIntoTeams = (players: Player[]): [Team, Team] | null => {
  // 偶数チェック
  if (players.length % 2 !== 0) {
    return null;
  }

  // ARとSMGに分類
  const arPlayers = players.filter((p) => p.weaponType === "AR");
  const smgPlayers = players.filter((p) => p.weaponType === "SMG");

  // 武器種ごとにスキルレベルでソート（降順）
  arPlayers.sort((a, b) => b.skillLevel - a.skillLevel);
  smgPlayers.sort((a, b) => b.skillLevel - a.skillLevel);

  // 交互に振り分け（ジグザグ方式）
  const team1: Player[] = [];
  const team2: Player[] = [];

  // ARを振り分け
  arPlayers.forEach((player, index) => {
    if (index % 2 === 0) {
      team1.push(player);
    } else {
      team2.push(player);
    }
  });

  // SMGを振り分け
  smgPlayers.forEach((player, index) => {
    if (index % 2 === 0) {
      team1.push(player);
    } else {
      team2.push(player);
    }
  });

  // チーム情報を計算
  const calculateTeamStats = (teamPlayers: Player[]): Team => {
    return {
      players: teamPlayers,
      totalSkill: teamPlayers.reduce((sum, p) => sum + p.skillLevel, 0),
      arCount: teamPlayers.filter((p) => p.weaponType === "AR").length,
      smgCount: teamPlayers.filter((p) => p.weaponType === "SMG").length,
    };
  };

  return [calculateTeamStats(team1), calculateTeamStats(team2)];
};

// プレイヤーをチーム間で交換
export const swapPlayers = (
  team1: Team,
  team2: Team,
  player1Id: string,
  player2Id: string
): [Team, Team] => {
  const newTeam1Players = [...team1.players];
  const newTeam2Players = [...team2.players];

  const player1Index = newTeam1Players.findIndex((p) => p.id === player1Id);
  const player2Index = newTeam2Players.findIndex((p) => p.id === player2Id);

  if (player1Index !== -1 && player2Index !== -1) {
    // 交換
    const temp = newTeam1Players[player1Index];
    newTeam1Players[player1Index] = newTeam2Players[player2Index];
    newTeam2Players[player2Index] = temp;
  }

  // 再計算
  const calculateTeamStats = (teamPlayers: Player[]): Team => {
    return {
      players: teamPlayers,
      totalSkill: teamPlayers.reduce((sum, p) => sum + p.skillLevel, 0),
      arCount: teamPlayers.filter((p) => p.weaponType === "AR").length,
      smgCount: teamPlayers.filter((p) => p.weaponType === "SMG").length,
    };
  };

  return [
    calculateTeamStats(newTeam1Players),
    calculateTeamStats(newTeam2Players),
  ];
};
