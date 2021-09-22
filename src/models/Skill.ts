import { actionExecuter, executeSelfAction } from "../core/actionExecuter";
import { ISkill, SkillData } from "../types/Skill";
import { IUnit } from "../types/Unit";
import { deepClone, toArray } from "../utils";

export class Skill implements ISkill {
  private _skillData!: SkillData;

  constructor(data: SkillData) {
    this._skillData = deepClone(data);
  }

  cast(source: IUnit, target: IUnit): void {
    toArray(this.data.actions).forEach(action => actionExecuter(action, source, target));
  }

  onLearn(self: IUnit): void {
    toArray(this.data.onLearn).forEach(action => executeSelfAction(action, self));
  }
  onForget(self: IUnit): void {
    toArray(this.data.onForget).forEach(action => executeSelfAction(action, self));
  }

  get data() {
    return this._skillData;
  }
}