export type BattleParse = "ENTER_BATTLE" | "LEAVE_BATTLE"
  | "PLAYER_ROUND_START" | "PLAYER_ROUND_END"
  | "ENEMY_ROUND_START" | "ENEMY_ROUND_END"
  | "ROUND_START" | "ROUND_END"
  // | "ATTACK" | "CAST_SKILL"
  ;

export type BattleData = {
  isInBattle: boolean;
  round: number;
  curRoundOwner: 'PLAYER' | 'ENEMY' | 'NONE';
  playerCanDoAction: boolean;
}