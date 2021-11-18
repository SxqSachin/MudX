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
} & ActionEffectData) | ((self: IUnit, target: IUnit, ext?: any) => VAG);

export type SelfAction = ActionEffectData | ((self: IUnit) => VAG);

export type GameAction = DataProcessCallback<GameEnvironment>;

export type ItemAction = 'USE_ITEM' | 'EQUIP' | 'UNEQUIP';
export type SkillAction = 'CAST_SKILL' | 'LEARN_SKILL' | 'FORGET_SKILL';
export type BattleAction = 'ATTACK' | 'CAST_SKILL';
export type PlayerAction = ItemAction | SkillAction | BattleAction;

export type PlayerActionData = {
  item?: IItem;
  skill?: ISkill;
  target?: IUnit[];
}

// export type PlayerItemActionCallback = (action: ItemAction, data: Required<Omit<PlayerActionData, "skill">>) => void;
// export type PlayerSkillActionCallback = (action: SkillAction, data: Required<Omit<PlayerActionData, "item">>) => void;
// export type PlayerBattleActionCallback = (action: BattleAction, data: Required<Omit<PlayerActionData, "item">>) => void;
export type PlayerActionCallback =
  // & PlayerItemActionCallback
  // & PlayerSkillActionCallback
  // & PlayerBattleActionCallback &
  ((action: PlayerAction, data: PlayerActionData) => void);

const a:  PlayerActionCallback = (action, data) => { };
a('USE_ITEM', {
  item: {} as IItem,
  target: [],
})
const b: PlayerActionCallback = (action, data) => {
  a(action, <PlayerActionData>data);
}