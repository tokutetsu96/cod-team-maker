"use client";

import { useEffect, useState } from "react";
import { Player } from "@/lib/types";
import { supabaseStorage } from "@/lib/supabaseStorage";
import PlayerForm from "@/components/PlayerForm";
import PlayerList from "@/components/PlayerList";
import TeamMaker from "@/components/TeamMaker";
import { toast } from "sonner";

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 初回ロード時にSupabaseからデータを取得
  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    setIsLoading(true);
    const loadedPlayers = await supabaseStorage.getPlayers();
    setPlayers(loadedPlayers);
    setIsLoading(false);
  };

  const handleAddPlayer = async (playerData: Omit<Player, "id">) => {
    const newPlayer = await supabaseStorage.addPlayer(playerData);
    if (newPlayer) {
      setPlayers((prev) => [...prev, newPlayer]);
    } else {
      toast.error("プレイヤーの登録に失敗しました");
    }
  };

  const handleUpdatePlayer = async (player: Player) => {
    const success = await supabaseStorage.updatePlayer(player.id, player);
    if (success) {
      setPlayers((prev) => prev.map((p) => (p.id === player.id ? player : p)));
    } else {
      toast.error("プレイヤーの更新に失敗しました");
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
    const success = await supabaseStorage.deletePlayer(playerId);
    if (success) {
      setPlayers((prev) => prev.filter((p) => p.id !== playerId));
      setSelectedPlayerIds((prev) => prev.filter((id) => id !== playerId));
    } else {
      toast.error("プレイヤーの削除に失敗しました");
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">
            COD チーム分けアプリ
          </h1>
          <p className="text-center text-muted-foreground">
            プレイヤーを登録してバランスの取れたチームを作成
          </p>
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
              onUpdate={handleUpdatePlayer}
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
