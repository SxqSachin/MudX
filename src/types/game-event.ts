import { GameAction, SelfAction } from "./action";
import { ConditionExpr } from "./condition";
import { GameEnvironment } from "./game";
import { IUnit } from "./Unit";

export type GameEventID = string;
export type GameEvent = {
  id: GameEventID;

  name: string;

  forks: GameEventFork | GameEventFork[];
}

export type GameEventFork = {
  condition?: ConditionExpr;
  description: string | (() => string);

  onEnter?: GameAction | GameAction[];
  onLeave?: GameAction | GameAction[];

  options: GameEventOption | GameEventOption[];
};

export type GameEventOptionID = string;
export type GameEventOption = {
  id: GameEventOptionID;

  name: string;

  note?: string;

  onChoose?: GameAction | GameAction[];

  next: GameEventID | ((environment: GameEnvironment) => GameEventID | GameEvent);
}