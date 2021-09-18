import { DataCallback, VoidCallback } from ".";
import { Item } from "../models/Item";
import { Skill } from "../models/Skill";
import { IItem, ItemData, ItemID } from "./Item";
import { XID, XObject, XSerializable } from "./Object";
import { ISkill, SkillData, SkillID } from "./Skill";

export type UnitEventType =
  'beforeAttack' | 'doAttack' | 'afterAttack' |
'beforeAttacked' | 'beAttacked' | 'afterAttacked';


export type UnitEventData = {
}
export type UnitAttackEventData = UnitEventData & {
  target: IUnit;
}
export type UnitAttackedEventData = UnitEventData & {
  source: IUnit;
}

export type UnitFireEventFunc =
  ((event: UnitEventType, data: UnitEventData) => void) |
  ((event: 'beforeAttack' | 'doAttack' | 'afterAttack', data: UnitAttackEventData) => void) |
  ((event: 'beforeAttacked' | 'beAttacked' | 'afterAttacked', data: UnitAttackedEventData) => void);

type _UnitEventListener<E, T> = (event: E, listener: DataCallback<T>) => VoidCallback;
export type UnitEventListener =
  _UnitEventListener<UnitEventType, UnitEventData> |
  _UnitEventListener<'beforeAttack' | 'doAttack' | 'afterAttack', UnitAttackEventData> |
  _UnitEventListener<'beforeAttacked' | 'beAttacked' | 'afterAttacked', UnitAttackedEventData>;

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

// IUnit只是Entity的壳子，用于对数据进行操作
export interface IUnit extends XObject, XSerializable, UnitEvent {
  attack(target: IUnit): void;

  dealDamage(target: IUnit, damage: number): void;

  learnSkill(skill: ISkill): void;
  forgetSkill(skill: ISkill): void;
  castSkill(skill: ISkill): void;

  addItemByID(itemID: ItemID, count: number): void;
  removeItemByID(itemID: ItemID, count: number): void;
  removeItem(item: IItem): void;
  addItem(item: IItem): void;
  useItem(item: IItem): void;

  equip(xid: XID): void;
  unequip(xid: XID): void;

  increaseStatus(statusKey: UnitStatusType, val: number): void;
  decreaseStatus(statusKey: UnitStatusType, val: number): void;
  setStatus(statusKey: UnitStatusType, val: number): void;

  items: Readonly<{ [id in ItemID]: IItem[] }>;
  skills: Readonly<{ [id in SkillID]: ISkill }>;
  status: Readonly<{ [status in UnitStatusType]: number }>;
  equipments: Readonly<IItem[]>;

  phyAtk: number;
  phyDef: number;
  powAtk: number;
  powDef: number;
}

export type UnitData = XSerializable & {
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
}
export type UnitStatusType = Exclude<keyof UnitData, 'items' | 'skills' | 'xid'>;

export type SourceUnit = IUnit;
export type TargetUnit = IUnit;