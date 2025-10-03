"use client";

import { useState } from "react";
import { Player, WeaponType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface PlayerFormProps {
  onAdd: (player: Omit<Player, "id">) => void;
}

export default function PlayerForm({ onAdd }: PlayerFormProps) {
  const [name, setName] = useState("");
  const [weaponType, setWeaponType] = useState<WeaponType>("AR");
  const [skillLevel, setSkillLevel] = useState([5]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim() === "") {
      toast.error("プレイヤー名を入力してください");
      return;
    }

    setIsSubmitting(true);

    const newPlayer = {
      name: name.trim(),
      weaponType,
      skillLevel: skillLevel[0],
    };

    await onAdd(newPlayer);
    toast.success(`${name}を登録しました`);

    // フォームをリセット
    setName("");
    setWeaponType("AR");
    setSkillLevel([5]);
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>プレイヤー登録</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">プレイヤー名</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="名前を入力"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label>武器種</Label>
            <RadioGroup
              value={weaponType}
              onValueChange={(value) => setWeaponType(value as WeaponType)}
              disabled={isSubmitting}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="AR" id="ar" />
                <Label htmlFor="ar" className="cursor-pointer font-normal">
                  AR
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="SMG" id="smg" />
                <Label htmlFor="smg" className="cursor-pointer font-normal">
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
              disabled={isSubmitting}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>10</span>
            </div>
          </div>

          <Button
            variant={"outline"}
            type="submit"
            className="w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "登録中..." : "登録"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
