import { DataProcessCallback } from ".";
import { GameEnvironment } from "./game";
import { IUnit, UnitData, UnitStatusType } from "./Unit";

type ActionEffectData = {
  effectTo: UnitStatusType,
  val: number;
} | {
  effectTo: 'item';
  itemID: string;
  val: number;
} | {
  effectTo: 'skill';
  skillID: string;
  val: number;
}

export type Action = ({
  target: 'target' | 'self';
} & ActionEffectData) | ((self: IUnit, target: IUnit) => void);

export type SelfAction = ActionEffectData | ((self: IUnit) => void);

export type GameAction = DataProcessCallback<GameEnvironment>;

export type ItemAction = 'USE' | 'EQUIP' | 'UNEQUIP';