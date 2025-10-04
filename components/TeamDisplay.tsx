/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Team, Player } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TeamDisplayProps {
  team1: Team;
  team2: Team;
  onPlayerClick?: (player: Player, teamIndex: 1 | 2) => void;
  selectedPlayer?: { player: Player; teamIndex: 1 | 2 } | null;
}

export default function TeamDisplay({
  team1,
  team2,
  onPlayerClick,
  selectedPlayer,
}: TeamDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // チーム結果をテキスト形式で生成
    const team1Text = team1.players
      .map((p) => `${p.name}(${p.weaponType})`)
      .join("/");
    const team2Text = team2.players
      .map((p) => `${p.name}(${p.weaponType})`)
      .join("/");

    const text = `チーム1: ${team1Text}\nチーム2: ${team2Text}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("クリップボードにコピーしました");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("コピーに失敗しました");
    }
  };

  const renderTeam = (team: Team, teamIndex: 1 | 2, teamName: string) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center justify-between gap-2">
            <span className="truncate">{teamName}</span>
            <div className="flex gap-2 text-sm font-normal">
              <Badge variant="outline">
                AR: {team.arCount} / SMG: {team.smgCount}
              </Badge>
              <Badge>合計: {team.totalSkill}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {team.players.map((player) => {
              const isSelected =
                selectedPlayer?.player.id === player.id &&
                selectedPlayer?.teamIndex === teamIndex;

              return (
                <div
                  key={player.id}
                  onClick={() => onPlayerClick?.(player, teamIndex)}
                  className={`p-3 rounded-lg border transition-colors ${
                    onPlayerClick ? "cursor-pointer hover:bg-accent" : ""
                  } ${
                    isSelected
                      ? "bg-primary/10 border-primary ring-2 ring-primary"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{player.name}</span>
                      <Badge
                        variant={
                          player.weaponType === "AR" ? "default" : "secondary"
                        }
                      >
                        {player.weaponType}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Lv.{player.skillLevel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* コピーボタン */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="w-full cursor-pointer"
            disabled={copied}
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                コピーしました
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                チーム結果をコピー
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* チーム表示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderTeam(team1, 1, "チーム1")}
        {renderTeam(team2, 2, "チーム2")}
      </div>
    </div>
  );
}
