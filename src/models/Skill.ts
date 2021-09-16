import { ISkill, SkillData } from "../types/Skill";
import { IUnit } from "../types/Unit";
import { toArray } from "../utils";

export class Skill implements ISkill {
  private _skillData!: SkillData;

  constructor(data: SkillData) {
    this._skillData = data;
  }

  cast(source: IUnit, target: IUnit): void {
    const action = toArray(this._skillData.actions);

    action.forEach(action => {
      let actionTarget;
    });
  }

  get data() {
    return this._skillData;
  }
}