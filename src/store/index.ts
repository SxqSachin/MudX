import { atom } from "recoil";
import { IUnit } from "../types/Unit";

export const PlayerCharacterAtom = atom({
  key: "PLAYER_CHARACTER_ATOM",
  default: null as any as IUnit,
  dangerouslyAllowMutability: true,
});

export const EnemyCharacterAtom = atom({
  key: "ENEMY_CHARACTER_ATOM",
  default: null as any as IUnit,
  dangerouslyAllowMutability: true,
});