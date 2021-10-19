import { GameEnvironment } from "./game";
import { IUnit, UnitData } from "./Unit";

export interface IEnemy extends IUnit {
  battleLogic: (env: GameEnvironment) => void;
}