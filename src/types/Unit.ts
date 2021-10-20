import { AsyncDataProcessCallback, DataCallback, DataProcessCallback, VoidCallback } from ".";
import { Item } from "../models/Item";
import { Skill } from "../models/Skill";
import { GameEnvironment } from "./game";
import { IItem, ItemData, ItemID } from "./Item";
import { XID, XObject, XSerializable } from "./Object";
import { ISkill, SkillData, SkillID } from "./Skill";

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

type _T1<T, T2> = (event: T, data: T2) => Promise<T2 | null>;
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

export type DamageInfo = {
  triggerEvent: boolean;
}

// IUnit只是Entity的壳子，用于对数据进行操作
export type UnitSelf = IUnit;
export interface IUnit extends XObject, XSerializable, UnitEvent {
  attack(target: IUnit): void;

  dealDamage(target: IUnit, damage: number, info?: DamageInfo): void;

  learnSkill(skill: ISkill): UnitSelf;
  forgetSkill(skill: ISkill): UnitSelf;
  castSkill(skillID: SkillID, target: IUnit): UnitSelf;

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

  items: Readonly<{ [id in ItemID]: IItem[] }>;
  skills: Readonly<{ [id in SkillID]: ISkill }>;
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

  spoils?: ((env: GameEnvironment) => ItemID | ItemID[]) | ItemID | ItemID[];
}
export type UnitStatusType = Exclude<keyof UnitData, 'items' | 'skills' | 'xid' | 'name' | 'spoils' | 'id'>;
export type UnitStatus = { [status in UnitStatusType]: number };

export type SourceUnit = IUnit;
export type TargetUnit = IUnit;
