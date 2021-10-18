import { atom } from "recoil";
import { GameEnvironment, GamePanelType, GameState } from "../types/game";
import { GameEvent, GameEventFork, Story } from "../types/game-event";
import { Enemy, IUnit } from "../types/Unit";

export const GameEnvironmentAtom = atom<GameEnvironment>({
  key: "GAME_ENVIRONMENT_ATOM",
  default: {
    player: undefined as any as IUnit,
    enemy: undefined as any as Enemy,

    story: undefined as any as Story,
    event: undefined as any as GameEvent,
    fork: undefined as any as GameEventFork,

    panels: new Set() as any as Set<GamePanelType>,
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