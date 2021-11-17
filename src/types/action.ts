import { DataProcessCallback } from ".";
import { GameEnvironment } from "./game";
import { IItem } from "./Item";
import { ISkill } from "./Skill";
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

export type ItemAction = 'USE_ITEM' | 'EQUIP' | 'UNEQUIP';
export type SkillAction = 'CAST_SKILL' | 'LEARN_SKILL' | 'FORGET_SKILL';

export type PlayerAction = ItemAction | SkillAction;

export type PlayerActionData = {
  item: IItem;
  skill: ISkill;
}
export type PlayerActionCallback =
  ((action: 'CAST_SKILL', data: {skill: ISkill, item?: IItem}) => void) &
  ((action: 'USE_ITEM' | 'EQUIP' | 'UNEQUIP', data: {item: IItem, skill?: ISkill}) => void);