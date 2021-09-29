import { atom } from "recoil";
import { GameEnvironment } from "../types/game";
import { GameEvent, GameEventFork } from "../types/game-event";
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

export const GameEnvironmentAtom = atom<GameEnvironment>({
  key: "GAME_ENVIRONMENT_ATOM",
  default: {
    player: undefined as any as IUnit,
    enemy: undefined as any as IUnit,
    event: undefined as any as GameEvent,
    fork: undefined as any as GameEventFork,
  },
  dangerouslyAllowMutability: true,
})