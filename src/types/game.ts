import { GameEvent, GameEventFork } from "./game-event";
import { IUnit } from "./Unit";

export type GameEnvironment = {
  player: IUnit,
  enemy?: IUnit,
  event: GameEvent,
  fork: GameEventFork,
}