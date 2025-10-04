// lib/teamAlgorithm.ts
import { Player, Team } from "./types";

export const divideIntoTeams = (players: Player[]): [Team, Team] | null => {
  // 8人チェック
  if (players.length !== 8) {
    return null;
  }

  // スキルレベルでソート（降順 - 強い順）
  const sortedPlayers = [...players].sort(
    (a, b) => b.skillLevel - a.skillLevel
  );

  // ジグザグドラフト方式で振り分け
  // 1番目 -> Team1, 2番目 -> Team2, 3番目 -> Team2, 4番目 -> Team1, ...
  const team1: Player[] = [];
  const team2: Player[] = [];

  sortedPlayers.forEach((player, index) => {
    // ジグザグパターン: 0,3,4,7 -> Team1 / 1,2,5,6 -> Team2
    const round = Math.floor(index / 2);
    if (round % 2 === 0) {
      // 偶数ラウンド: 最初のプレイヤーがTeam1
      if (index % 2 === 0) {
        team1.push(player);
      } else {
        team2.push(player);
      }
    } else {
      // 奇数ラウンド: 最初のプレイヤーがTeam2
      if (index % 2 === 0) {
        team2.push(player);
      } else {
        team1.push(player);
      }
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
