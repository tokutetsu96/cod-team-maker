// lib/types.ts
export type WeaponType = "AR" | "SMG";

export interface Player {
  id: string;
  name: string;
  weaponType: WeaponType;
  skillLevel: number; // 1-10
}

export interface Team {
  players: Player[];
  totalSkill: number;
  arCount: number;
  smgCount: number;
}
