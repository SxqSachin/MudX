import { SelfAction } from "./action";
import { IUnit } from "./Unit";

export type GameEventID = string;
export type GameEvent = {
  id: GameEventID;

  name: string;

  description: string;

  onEnter: SelfAction | SelfAction[];
  onLeave: SelfAction | SelfAction[];

  next: GameEventID | ((player: IUnit) => GameEventID | GameEvent);
}