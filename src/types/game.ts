import { BattleData } from "./battle";
import { IEnemy } from "./enemy";
import { GameEvent, GameEventFork, Story } from "./game-event";
import { PriceList, TradeData } from "./Item";
import { IUnit } from "./Unit";

export type GameEnvironment = {
  player: IUnit;
  enemy: IEnemy;

  battle: BattleData;

  story: Story;
  event: GameEvent;
  fork: GameEventFork;

  state: GameState[];
  panels: GamePanelType[];

  trade: TradeData;
}

export type GameState = "EVENT" | "BATTLE" | "CHOOSE_STORY" | "TRADE";
export type GamePanelType = "EVENT" | "BATTLE" | "UNIT_STATUS" | "DEBUG" | "STORY_CHOOSE" | "TRADE";

export type EnvObjectGenerator<T> = (env: GameEnvironment) => T;