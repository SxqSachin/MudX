import { SelfAction } from "./action";
import { ConditionExpr } from "./condition";
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

  onEnter: SelfAction | SelfAction[];
  onLeave: SelfAction | SelfAction[];

  options: GameEventOption | GameEventOption[];
};

export type GameEventOptionID = string;
export type GameEventOption = {
  id: GameEventOptionID;

  name: string;

  note?: string;

  onChoose?: SelfAction | SelfAction[];

  next: GameEventID | ((player: IUnit) => GameEventID | GameEvent);
}