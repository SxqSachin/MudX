export type BattleAction = "ATTACK" | "ENTER_BATTLE"
  | "PLAYER_ROUND_START" | "PLAYER_ROUND_END"
  | "ENEMY_ROUND_START" | "ENEMY_ROUND_END"
  | "ROUND_START" | "ROUND_END"
  ;

export type BattleData = {
  isInBattle: boolean;
  round: number;
}