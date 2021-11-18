import { VAG } from ".";
import { Action, SelfAction } from "./action";
import { GameEnvironment } from "./game";
import { XObject, XSerializable } from "./Object";
import { IUnit, SourceUnit, TargetUnit, } from "./Unit";

export type SkillID = string;
export type SkillData = {
  id: SkillID;

  name: string;
  description: string | ((unit: IUnit, env: GameEnvironment) => string);

  colddown: number;
  chooseTarget: boolean;

  actions: Action | Action[];
  onLearn: SelfAction | SelfAction[];
  onForget: SelfAction | SelfAction[];
};
export type SkillSerializeData = Omit<SkillData, 'actions' | 'onLearn' | 'onForget'>;

export interface ISkill {
  data: Readonly<SkillData>;
  cast(source: SourceUnit, target: TargetUnit): VAG;

  onLearn(target: IUnit): VAG;
  onForget(target: IUnit): VAG;
}