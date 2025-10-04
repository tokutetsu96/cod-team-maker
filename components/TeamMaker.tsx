"use client";

import { useState } from "react";
import { Player, Team } from "@/lib/types";
import { divideIntoTeams, swapPlayers } from "@/lib/teamAlgorithm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import TeamDisplay from "./TeamDisplay";

interface TeamMakerProps {
  selectedPlayers: Player[];
}

export default function TeamMaker({ selectedPlayers }: TeamMakerProps) {
  const [teams, setTeams] = useState<[Team, Team] | null>(null);
  const [selectedForSwap, setSelectedForSwap] = useState<{
    player: Player;
    teamIndex: 1 | 2;
  } | null>(null);

  const handleDivideTeams = () => {
    if (selectedPlayers.length === 0) {
      toast.error("プレイヤーを選択してください");
      return;
    }

    if (selectedPlayers.length % 2 !== 0) {
      toast.error("偶数人数を選択してください");
      return;
    }

    const result = divideIntoTeams(selectedPlayers);
    if (result) {
      setTeams(result);
      setSelectedForSwap(null);
      toast.success("チーム分けが完了しました");
    }
  };

  const handlePlayerClick = (player: Player, teamIndex: 1 | 2) => {
    if (!selectedForSwap) {
      // 最初のプレイヤーを選択
      setSelectedForSwap({ player, teamIndex });
    } else if (
      selectedForSwap.player.id === player.id &&
      selectedForSwap.teamIndex === teamIndex
    ) {
      // 同じプレイヤーをクリック -> 選択解除
      setSelectedForSwap(null);
    } else if (selectedForSwap.teamIndex === teamIndex) {
      // 同じチーム内のプレイヤーをクリック -> 選択変更
      setSelectedForSwap({ player, teamIndex });
    } else {
      // 異なるチームのプレイヤーをクリック -> 交換実行
      if (teams) {
        const [team1, team2] = teams;
        const newTeams = swapPlayers(
          team1,
          team2,
          selectedForSwap.teamIndex === 1
            ? selectedForSwap.player.id
            : player.id,
          selectedForSwap.teamIndex === 2
            ? selectedForSwap.player.id
            : player.id
        );
        setTeams(newTeams);
        setSelectedForSwap(null);
        toast.success(
          `${selectedForSwap.player.name} と ${player.name} を交換しました`
        );
      }
    }
  };

  const handleReset = () => {
    setTeams(null);
    setSelectedForSwap(null);
  };

  if (selectedPlayers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>チーム分け</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            プレイヤーを選択してください
          </p>
        </CardContent>
      </Card>
    );
  }

  // 選択中のプレイヤー表示（チーム分け前）
  if (!teams) {
    const arCount = selectedPlayers.filter((p) => p.weaponType === "AR").length;
    const smgCount = selectedPlayers.filter(
      (p) => p.weaponType === "SMG"
    ).length;
    const totalSkill = selectedPlayers.reduce(
      (sum, p) => sum + p.skillLevel,
      0
    );
    const isValid = selectedPlayers.length === 8; // 8人ピッタリのみ有効

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>選択中のプレイヤー</span>
              <div className="flex gap-2 text-sm font-normal">
                <Badge variant="outline">
                  AR: {arCount} / SMG: {smgCount}
                </Badge>
                <Badge>合計: {totalSkill}</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto mb-4">
              {selectedPlayers.map((player) => (
                <div
                  key={player.id}
                  className="p-3 rounded-lg border border-border"
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
              ))}
            </div>

            <div className="text-center mb-4">
              <p className="text-lg font-medium">
                {selectedPlayers.length}/8人選択中
              </p>
              {selectedPlayers.length !== 8 && (
                <p className="text-sm text-destructive mt-2">
                  ⚠️ 8人（4v4）を選択してください
                </p>
              )}
            </div>

            <Button
              onClick={handleDivideTeams}
              variant={"outline"}
              className="w-full cursor-pointer"
              size="lg"
              disabled={!isValid}
            >
              チーム分けを実行
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // チーム分け後の表示
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Button
              onClick={handleDivideTeams}
              className="flex-1 cursor-pointer"
              variant="outline"
            >
              やり直し
            </Button>
            <Button
              onClick={handleReset}
              className="flex-1 cursor-pointer"
              variant="secondary"
            >
              リセット
            </Button>
          </div>
          {selectedForSwap && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              {selectedForSwap.player.name} を選択中 -
              交換したいプレイヤーをクリック
            </p>
          )}
        </CardContent>
      </Card>

      <TeamDisplay
        team1={teams[0]}
        team2={teams[1]}
        onPlayerClick={handlePlayerClick}
        selectedPlayer={selectedForSwap}
      />
    </div>
  );
}
