import { IItem, ItemData, ItemID } from "./Item";
import { XObject, XSerializable } from "./Object";
import { ISkill, SkillData, SkillID } from "./Skill";

// IUnit只是Entity的壳子，用于对数据进行操作
export interface IUnit extends XObject, XSerializable, UnitData {
  getEntity(): UnitData;

  castSkill(skill: ISkill): void;

  useItem(item: IItem): void;

  attack(target: IUnit): void;
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

  skills: { [id in SkillID]: SkillData[] };
  items: { [id in ItemID]: ItemData[] };
}

export type SourceUnit = IUnit;
export type TargetUnit = IUnit;