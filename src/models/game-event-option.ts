import { DataProcessCallback } from "../types";
import { GameEnvironment } from "../types/game";
import { UnitStatusType } from "../types/Unit";

export const addPlayerHPOption: (val: number) => DataProcessCallback<GameEnvironment> = val => increasePlayerStatusOption('curHP', val);
export const removePlayerHPOption: (val: number) => DataProcessCallback<GameEnvironment> = val => decreasePlayerStatusOption('curHP', val);

export const increasePlayerStatusOption: (status: UnitStatusType, val: number) => DataProcessCallback<GameEnvironment> = (status, val) => env => {
  env.player.increaseStatus(status, val);

  return env;
}
export const decreasePlayerStatusOption: (status: UnitStatusType, val: number) => DataProcessCallback<GameEnvironment> = (status, val) => env => {
  env.player.decreaseStatus(status, val);

  return env;
}