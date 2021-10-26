import { Enemy } from "@/models/Enemy";
import { Unit } from "@/models/Unit";
import { BattleData } from "@/types/battle";
import { IEnemy } from "@/types/enemy";
import { atom } from "recoil";
import { GameEnvironment, GamePanelType, GameState } from "../types/game";
import { GameEvent, GameEventFork, Story } from "../types/game-event";
import { IUnit } from "../types/Unit";

export const GameEnvironmentAtom = atom<GameEnvironment>({
  key: "GAME_ENVIRONMENT_ATOM",
  default: {
    player: Unit.create('') as any as IUnit,
    enemy: Enemy.create('') as any as IEnemy,

    story: {} as any as Story,
    event: {} as any as GameEvent,
    fork: {} as any as GameEventFork,

    panels: new Set() as any as Set<GamePanelType>,
    battle: {} as any as BattleData,
    state: ["EVENT"],
  },
  dangerouslyAllowMutability: true,
});

export const GameStateAtom = atom<GameState[]>({
  key: "GAME_STATE_ATOM",
  default: [],
})
export const GamePanelsAtom = atom<GamePanelType[]>({
  key: "GAME_PANELS_ATOM",
  default: [],
})