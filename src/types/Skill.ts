import { Action, SelfAction } from "./action";
import { XObject, XSerializable } from "./Object";
import { IUnit, SourceUnit, TargetUnit, } from "./Unit";

export type SkillID = string;
export type SkillData = {
  id: SkillID;
  name: string;

  colddown: number;

  actions: Action | Action[];
  onLearn: SelfAction | SelfAction[];
  onForget: SelfAction | SelfAction[];
};
export type SkillSerializeData = Omit<SkillData, 'actions'>;

export interface ISkill {
  data: Readonly<SkillData>;
  cast(source: SourceUnit, target: TargetUnit): void;

  onLearn(target: IUnit): void;
  onForget(target: IUnit): void;
}