"use client";

import { useState } from "react";
import { Player } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import PlayerEditDialog from "./PlayerEditDialog";

interface PlayerListProps {
  players: Player[];
  selectedPlayers: string[];
  onToggleSelect: (playerId: string) => void;
  onDelete: (playerId: string) => void;
  onUpdate: (player: Player) => void;
}

export default function PlayerList({
  players,
  selectedPlayers,
  onToggleSelect,
  onDelete,
  onUpdate,
}: PlayerListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // 検索フィルタリング
  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (player: Player) => {
    toast.promise(Promise.resolve(onDelete(player.id)), {
      loading: "削除中...",
      success: `${player.name}を削除しました`,
      error: "削除に失敗しました",
    });
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setIsEditDialogOpen(true);
  };

  if (players.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>登録プレイヤー</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            まだプレイヤーが登録されていません
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            登録プレイヤー ({players.length}人)
            {selectedPlayers.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                / {selectedPlayers.length}人選択中
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* 検索バー */}
          <div className="mb-4">
            <Input
              type="text"
              placeholder="プレイヤー名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <p className="text-sm text-muted-foreground mt-2">
                {filteredPlayers.length}件見つかりました
              </p>
            )}
          </div>

          {/* プレイヤーリスト */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredPlayers.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                該当するプレイヤーが見つかりません
              </p>
            ) : (
              filteredPlayers.map((player) => {
                const isSelected = selectedPlayers.includes(player.id);
                return (
                  <div
                    key={player.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? "bg-primary/10 border-primary"
                        : "bg-card border-border hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(player.id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{player.name}</span>
                          <Badge
                            variant={
                              player.weaponType === "AR"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {player.weaponType}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          スキル: {player.skillLevel}/10
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(player)}
                        className="cursor-pointer"
                      >
                        編集
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(player)}
                        className="cursor-pointer"
                      >
                        削除
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <PlayerEditDialog
        player={editingPlayer}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={onUpdate}
      />
    </>
  );
}
