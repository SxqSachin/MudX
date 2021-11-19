import { AsyncDataProcessCallback, DataCallback, DataProcessCallback, VAG, VoidCallback } from ".";
import { Item } from "../models/Item";
import { Skill } from "../models/Skill";
import { BattleAction } from "./action";
import { GameEnvironment } from "./game";
import { IItem, ItemData, ItemID } from "./Item";
import { XID, XObject, XSerializable } from "./Object";
import { ISkill, SkillData, SkillID } from "./Skill";
import { State, StateData, StateID } from "./state";

export type UnitEventType =
  'beforeAttack' | 'afterAttack' |
  'beforeAttacked' | 'afterAttacked' |
  'dealDamage' | 'takeDamage' |
  'addItem' | 'removeItem' |
  'equipItem' | 'unequipItem' |
  'learnSkill' | 'forgetSkill' |
  'castSkill' | 'beSkillTarget' |
  'roundStart' | 'roundEnd' | 'aiRoundStart'
  ;
;


export type UnitEventData = {
  target: IUnit;
  source: IUnit;
  damage: number;

  item: IItem;
  skill: ISkill;
}
export type UnitAttackEventData = Omit<UnitEventData, 'item' | 'skill'>;
export type UnitAttackedEventData = Omit<UnitEventData, 'item' | 'skill'>;
export type UnitDamageEventData = Omit<UnitEventData, 'item' | 'skill'>;

export type UnitItemEventData = Pick<UnitEventData, 'item'>;
export type UnitSkillEventData = Pick<UnitEventData, 'source' | 'target' | 'skill'>;
export type UnitSimpleEventData = Pick<UnitEventData, 'source' | 'target'>;

type _T1<T, T2> = (event: T, data: T2) => Promise<T2>;
export type UnitFireEventFunc =
  _T1<'beforeAttack' | 'afterAttack', UnitAttackEventData> &
  _T1<'beforeAttacked' | 'afterAttacked', UnitAttackedEventData> &
  _T1<'dealDamage' | 'takeDamage', UnitDamageEventData> &
  _T1<'addItem' | 'removeItem' | 'equipItem' | 'unequipItem', UnitItemEventData> &
  _T1<'learnSkill' | 'forgetSkill' | 'castSkill' | 'beSkillTarget', UnitSkillEventData> &
  _T1<'roundStart' | 'roundEnd' | 'aiRoundStart', UnitSimpleEventData>
  ;
  // (event: UnitEventType, data: UnitEventData) => void |
  // ((event: 'beforeAttack' | 'doAttack' | 'afterAttack', data: UnitAttackEventData) => void) |
  // ((event: 'beforeAttacked' | 'beAttacked' | 'afterAttacked', data: UnitAttackedEventData) => void);

type _T2<T, T2> = (event: T, listener: AsyncDataProcessCallback<T2>) => VoidCallback;
export type UnitEventListener =
  _T2<'beforeAttack' | 'afterAttack', UnitAttackEventData> &
  _T2<'beforeAttacked' | 'afterAttacked', UnitAttackedEventData> &
  _T2<'dealDamage' | 'takeDamage', UnitDamageEventData> &
  _T2<'addItem' | 'removeItem' | 'equipItem' | 'unequipItem', UnitItemEventData> &
  _T2<'learnSkill' | 'forgetSkill' | 'castSkill' | 'beSkillTarget', UnitSkillEventData> &
  _T2<'roundStart' | 'roundEnd' | 'aiRoundStart', UnitSimpleEventData>
  ;
  // ((event: 'beforeAttack' | 'doAttack' | 'afterAttack', listener: DataCallback<UnitAttackEventData>) => VoidCallback) |
  // ((event: 'beforeAttacked' | 'beAttacked' | 'afterAttacked', listener: DataCallback<UnitAttackedEventData>) => VoidCallback);

export interface UnitEvent {
  /**
   * 为该单位监听某事件
   * @param event 事件类型
   * @param data 事件数据
   *
   * @returns 解绑方法
   */
  on: UnitEventListener;

  /**
   * 主动触发该单位的事件
   * @param event
   */
  fire: UnitFireEventFunc;
}

export enum DamageType {
  PHYSICAL = 'physical',
  MAGICAL = 'magical',
  PURE = 'pure',
}

// actionType = ATTACK -> A 攻击了 B，造成了 {damage} 点伤害。
// actionType = CAST_SKILL -> A 使用了 “{actionName}”，对 B 造成 {damage} 点伤害。
// actionType = CAST_SKILL -> A 使用了 “{actionName}”，{damageDescription}。
// actionType = CAST_SKILL && isDamageFromPassive = true -> A 发动技能 “{actionName}”，对 B 造成 {damage} 点伤害。
export type DamageInfo = {
  damage: number; // 预期伤害

  isDamageFromPassive?: boolean; // 是否是被动行为造成的伤害，比如触发了技能的被动效果
  actionType?: BattleAction; // 战斗行为
  actionName?: string; // 导致伤害的行为
  damageType?: DamageType; // 伤害类型

  damageDescription?: string; // 自定义伤害行为描述

  triggerDealDamageEvent?: boolean; // 是否触发dealDamage事件
  triggerTakeDamageEvent?: boolean; // 是否触发takeDamage事件
}

// IUnit只是Entity的壳子，用于对数据进行操作
export type UnitSelf = IUnit;
export interface IUnit extends XObject, XSerializable, UnitEvent {
  attack(target: IUnit): Promise<void>;

  dealDamage(target: IUnit, info?: DamageInfo): Promise<number>;

  learnSkill(skill: ISkill): VAG;
  forgetSkill(skill: ISkill): VAG;
  castSkill(skillID: SkillID, target: IUnit): VAG;

  addItemByID(itemID: ItemID, count: number): UnitSelf;
  removeItemByID(itemID: ItemID, count: number): UnitSelf;
  removeItem(item: IItem): UnitSelf;
  addItem(item: IItem): UnitSelf;
  useItem(item: IItem): UnitSelf;

  equip(xid: XID): UnitSelf;
  unequip(xid: XID): UnitSelf;

  equipItem(Item: IItem): UnitSelf;
  unequipItem(Item: IItem): UnitSelf;

  increaseStatus(statusKey: UnitStatusType, val: number): UnitSelf;
  decreaseStatus(statusKey: UnitStatusType, val: number): UnitSelf;
  setStatus(statusKey: UnitStatusType, val: number): UnitSelf;

  addState(state: State): VAG;
  removeState(state: State): VAG;
  addStateByID(id: StateID): VAG;
  removeStateByID(id: StateID): VAG;

  items: Readonly<{ [id in ItemID]: IItem[] }>;
  skills: Readonly<{ [id in SkillID]: ISkill }>;
  states: Readonly<{ [id in StateID]: State[] }>;
  status: Readonly<UnitStatus>;
  data: Readonly<UnitData>;
  equipments: Readonly<IItem[]>;

  phyAtk: number;
  phyDef: number;
  powAtk: number;
  powDef: number;
  speed: number;

  name: string;
}

export type UnitData = XSerializable & {
  id: string;
  level: number;

  name: string;

  maxHP: number;
  maxMP: number;
  maxSP: number;
  curHP: number;
  curMP: number;
  curSP: number;

  phy: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  talent: number;
  luck: number;
  perception: number;
  speed: number;

  phyAtk: number;
  phyDef: number;
  powAtk: number;
  powDef: number;

  items: { [id in ItemID]: ItemData[] };
  skills: { [id in SkillID]: SkillData };
  states: { [id in StateID]: StateData[] };

  spoils?: ((env: GameEnvironment) => ItemID | ItemID[]) | ItemID | ItemID[];
}
export type UnitStatusType = Exclude<keyof UnitData, 'items' | 'skills' | 'states' | 'xid' | 'name' | 'spoils' | 'id'>;
export type UnitStatus = { [status in UnitStatusType]: number };

export type SourceUnit = IUnit;
export type TargetUnit = IUnit;
