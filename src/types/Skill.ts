import { Action } from "./action";
import { XObject, XSerializable } from "./Object";
import { SourceUnit, TargetUnit, } from "./Unit";

export type SkillID = string;
export type SkillData = {
  id: SkillID;

  colddown: number;

  actions: Action | Action[];
};
export type SkillSerializeData = Omit<SkillData, 'actions'>;

export interface ISkill {
  cast(source: SourceUnit, target: TargetUnit): void;
}