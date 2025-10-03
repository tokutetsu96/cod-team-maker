"use client";

import { Team, Player } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const renderTeam = (team: Team, teamIndex: 1 | 2, teamName: string) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{teamName}</span>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {renderTeam(team1, 1, "Team 1")}
      {renderTeam(team2, 2, "Team 2")}
    </div>
  );
}
