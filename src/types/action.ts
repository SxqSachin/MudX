import { DataProcessCallback, VAG } from ".";
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
} & ActionEffectData) | ((self: IUnit, target: IUnit) => VAG);

export type SelfAction = ActionEffectData | ((self: IUnit) => VAG);

export type GameAction = DataProcessCallback<GameEnvironment>;

export type ItemAction = 'USE_ITEM' | 'EQUIP' | 'UNEQUIP';
export type SkillAction = 'CAST_SKILL' | 'LEARN_SKILL' | 'FORGET_SKILL';
export type BattleEventAction = 'ATTACK';
export type PlayerAction = ItemAction | SkillAction | BattleEventAction;

export type PlayerActionData = {
  item?: IItem;
  skill?: ISkill;
  target?: IUnit[];
}

export type PlayerActionCallback = (action: PlayerAction, data: PlayerActionData) => void;
//   ((
//   action: "CAST_SKILL",
//   data: { skill: ISkill; item?: IItem; target: IUnit[] }
// ) => void) &
//   ((
//     action: "USE_ITEM" | "EQUIP" | "UNEQUIP",
//     data: { item: IItem; skill?: ISkill; target: IUnit[] }
//   ) => void);