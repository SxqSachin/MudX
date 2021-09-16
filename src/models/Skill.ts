import { ISkill, SkillData } from "../types/Skill";
import { IUnit } from "../types/Unit";

export class Skill implements ISkill {
  private skillData!: SkillData;

  constructor(data: SkillData) {
    this.skillData = data;
  }

  cast(source: IUnit, target: IUnit): void {
  }
}