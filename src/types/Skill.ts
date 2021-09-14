import { Action } from "./action";
import { XObject, XSerializable } from "./Object";
import { SourceUnit, TargetUnit, } from "./Unit";

export type SkillID = string;
export type SkillData = XSerializable & {
  id: SkillID;

  colddown: number;
};

export type SkillRunTimeData = {
  id: SkillID;

  actions: Action | Action[];
}

export interface ISkill extends XObject {
  cast(source: SourceUnit, target: TargetUnit): TargetUnit;
}