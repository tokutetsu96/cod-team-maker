import { supabase } from "./supabase";
import { Player } from "./types";

export const supabaseStorage = {
  // プレイヤー全員を取得
  getPlayers: async (): Promise<Player[]> => {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching players:", error);
      return [];
    }

    // Supabaseのデータ形式をアプリの形式に変換
    return (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      weaponType: row.weapon_type as "AR" | "SMG",
      skillLevel: row.skill_level,
    }));
  },

  // プレイヤーを追加
  addPlayer: async (player: Omit<Player, "id">): Promise<Player | null> => {
    const { data, error } = await supabase
      .from("players")
      .insert([
        {
          name: player.name,
          weapon_type: player.weaponType,
          skill_level: player.skillLevel,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding player:", error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      weaponType: data.weapon_type,
      skillLevel: data.skill_level,
    };
  },

  // プレイヤーを更新
  updatePlayer: async (id: string, player: Player): Promise<boolean> => {
    const { error } = await supabase
      .from("players")
      .update({
        name: player.name,
        weapon_type: player.weaponType,
        skill_level: player.skillLevel,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating player:", error);
      return false;
    }

    return true;
  },

  // プレイヤーを削除
  deletePlayer: async (id: string): Promise<boolean> => {
    const { error } = await supabase.from("players").delete().eq("id", id);

    if (error) {
      console.error("Error deleting player:", error);
      return false;
    }

    return true;
  },
};
