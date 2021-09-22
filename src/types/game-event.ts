import { SelfAction } from "./action";
import { IUnit } from "./Unit";

export type GameEventID = string;
export type GameEvent = {
  id: GameEventID;

  name: string;

  description: string;

  onEnter: SelfAction | SelfAction[];
  onLeave: SelfAction | SelfAction[];

  options: GameEventOption | GameEventOption[];
}

export type GameEventOptionID = string;
export type GameEventOption = {
  id: GameEventOptionID;

  name: string;

  note?: string;

  next: GameEventID | ((player: IUnit) => GameEventID | GameEvent);
}