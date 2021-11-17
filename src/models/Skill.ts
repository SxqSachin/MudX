import { VAG } from "@/types";
import { actionExecuter, executeSelfAction } from "../core/actionExecuter";
import { ISkill, SkillData } from "../types/Skill";
import { IUnit } from "../types/Unit";
import { agNoop, agNoopG, deepClone, runAsyncGenerate, toArray } from "../utils";

export class Skill implements ISkill {
  private _skillData!: SkillData;

  constructor(data: SkillData) {
    this._skillData = deepClone(data);
  }

  async *cast(source: IUnit, target: IUnit): VAG {
    const actionList = toArray(this.data.actions);

    for (const action of actionList) {
      yield* await actionExecuter(action, source, target)
    }
  }

  async *onLearn(self: IUnit): VAG {
    for (const action of toArray(this.data.onLearn)) {
      yield* await executeSelfAction(action, self);
    }
  }
  async *onForget(self: IUnit): VAG {

    for (const action of toArray(this.data.onForget)) {
      yield* await executeSelfAction(action, self);
    }
  }

  get data() {
    return this._skillData;
  }
}