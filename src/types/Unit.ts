import { Item } from "../models/Item";
import { Skill } from "../models/Skill";
import { IItem, ItemData, ItemID } from "./Item";
import { XObject, XSerializable } from "./Object";
import { ISkill, SkillData, SkillID } from "./Skill";

// IUnit只是Entity的壳子，用于对数据进行操作
export interface IUnit extends XObject, XSerializable {
  getEntity(): UnitData;

  attack(target: IUnit): void;

  learnSkill(skill: ISkill): void;
  forgetSkill(skill: ISkill): void;
  castSkill(skill: ISkill): void;

  removeItem(item: IItem, count: number): void;
  addItem(item: IItem, count: number): void;
  useItem(item: IItem): void;

  increaseStatus(statusKey: UnitStatusType, val: number): void;
  decreaseStatus(statusKey: UnitStatusType, val: number): void;
  setStatus(statusKey: UnitStatusType, val: number): void;

  items: Readonly<{ [id in ItemID]: IItem[] }>;
  skills: Readonly<{ [id in SkillID]: ISkill }>;
  status: Readonly<{ [status in UnitStatusType]: number }>;
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

  items: { [id in ItemID]: ItemData[] };
  skills: { [id in SkillID]: SkillData };
}
export type UnitStatusType = Exclude<keyof UnitData, 'items' | 'skills' | 'xid'>;

export type SourceUnit = IUnit;
export type TargetUnit = IUnit;