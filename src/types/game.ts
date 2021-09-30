import { GameEvent, GameEventFork } from "./game-event";
import { IUnit } from "./Unit";

export type GameEnvironment = {
  player: IUnit;
  enemy?: IUnit;
  event: GameEvent;
  fork: GameEventFork;

  state: GameState[];
  panels: GamePanelType[];
}

export type GameState = "EVENT" | "BATTLE";
export type GamePanelType = "EVENT" | "BATTLE" | "UNIT_STATUS" | "DEBUG";