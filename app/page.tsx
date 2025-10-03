"use client";

import { useEffect, useState } from "react";
import { Player } from "@/lib/types";
import { storage } from "@/lib/storage";
import PlayerForm from "@/components/PlayerForm";
import PlayerList from "@/components/PlayerList";
import TeamMaker from "@/components/TeamMaker";

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

  // 初回ロード時にlocalStorageからデータを取得
  useEffect(() => {
    const loadedPlayers = storage.getPlayers();
    setPlayers(loadedPlayers);
  }, []);

  const handleAddPlayer = (player: Player) => {
    storage.addPlayer(player);
    setPlayers(storage.getPlayers());
  };

  const handleDeletePlayer = (playerId: string) => {
    storage.deletePlayer(playerId);
    setPlayers(storage.getPlayers());
    // 削除されたプレイヤーが選択されていた場合は選択を解除
    setSelectedPlayerIds((prev) => prev.filter((id) => id !== playerId));
  };

  const handleToggleSelect = (playerId: string) => {
    setSelectedPlayerIds((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId);
      } else {
        return [...prev, playerId];
      }
    });
  };

  const selectedPlayers = players.filter((p) =>
    selectedPlayerIds.includes(p.id)
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">
            COD チーム分けアプリ
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左カラム: プレイヤー登録フォーム */}
          <div className="lg:col-span-1">
            <PlayerForm onAdd={handleAddPlayer} />
          </div>

          {/* 中央カラム: プレイヤー一覧 */}
          <div className="lg:col-span-1">
            <PlayerList
              players={players}
              selectedPlayers={selectedPlayerIds}
              onToggleSelect={handleToggleSelect}
              onDelete={handleDeletePlayer}
            />
          </div>

          {/* 右カラム: チーム分け */}
          <div className="lg:col-span-1">
            <TeamMaker selectedPlayers={selectedPlayers} />
          </div>
        </div>
      </div>
    </div>
  );
}
