import { GameEvent, GameEventFork, Story } from "./game-event";
import { IUnit } from "./Unit";

export type GameEnvironment = {
  player: IUnit;
  enemy?: IUnit;

  story: Story;
  event: GameEvent;
  fork: GameEventFork;

  state: GameState[];
  panels: Set<GamePanelType>;
}

export type GameState = "EVENT" | "BATTLE";
export type GamePanelType = "EVENT" | "BATTLE" | "UNIT_STATUS" | "DEBUG";