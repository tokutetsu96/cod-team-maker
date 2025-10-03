"use client";

import { useState, useEffect } from "react";
import { Player, WeaponType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface PlayerEditDialogProps {
  player: Player | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (player: Player) => void;
}

export default function PlayerEditDialog({
  player,
  open,
  onOpenChange,
  onSave,
}: PlayerEditDialogProps) {
  const [name, setName] = useState("");
  const [weaponType, setWeaponType] = useState<WeaponType>("AR");
  const [skillLevel, setSkillLevel] = useState([5]);

  // playerが変更されたら初期値をセット
  useEffect(() => {
    if (player) {
      setName(player.name);
      setWeaponType(player.weaponType);
      setSkillLevel([player.skillLevel]);
    }
  }, [player]);

  const handleSave = () => {
    if (name.trim() === "") {
      toast.error("プレイヤー名を入力してください");
      return;
    }

    if (!player) return;

    const updatedPlayer: Player = {
      ...player,
      name: name.trim(),
      weaponType,
      skillLevel: skillLevel[0],
    };

    onSave(updatedPlayer);
    toast.success(`${name}を更新しました`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>プレイヤー編集</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">プレイヤー名</Label>
            <Input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="名前を入力"
            />
          </div>

          <div className="space-y-2">
            <Label>武器種</Label>
            <RadioGroup
              value={weaponType}
              onValueChange={(value) => setWeaponType(value as WeaponType)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="AR" id="edit-ar" />
                <Label htmlFor="edit-ar" className="cursor-pointer font-normal">
                  AR
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="SMG" id="edit-smg" />
                <Label
                  htmlFor="edit-smg"
                  className="cursor-pointer font-normal"
                >
                  SMG
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>スキルレベル: {skillLevel[0]}</Label>
            <Slider
              value={skillLevel}
              onValueChange={setSkillLevel}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            キャンセル
          </Button>
          <Button
            variant="outline"
            onClick={handleSave}
            className="cursor-pointer"
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
