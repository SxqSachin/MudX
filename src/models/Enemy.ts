import { Unit } from "./Unit";
import { IEnemy } from "@/types/enemy";
import { UnitData } from "@/types/Unit";
import { GameEnvironment } from "@/types/game";

export class Enemy extends Unit implements IEnemy {
  constructor(data: UnitData) {
    super(data);
  }

  battleLogic(env: GameEnvironment) {

  };
}