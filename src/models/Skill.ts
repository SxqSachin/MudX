import { actionExecuter, executeSelfAction } from "../core/actionExecuter";
import { ISkill, SkillData } from "../types/Skill";
import { IUnit } from "../types/Unit";
import { agNoop, agNoopG, deepClone, iterateAsyncGenerator, runAsyncGenerate, toArray } from "../utils";

export class Skill implements ISkill {
  private _skillData!: SkillData;

  constructor(data: SkillData) {
    this._skillData = deepClone(data);
  }

  async *cast(source: IUnit, target: IUnit): AsyncGenerator {
    const actionList = toArray(this.data.actions);

    for (const action of actionList) {
      yield* await actionExecuter(action, source, target)
    }

    return;
  }

  onLearn(self: IUnit): Promise<void> {
    toArray(this.data.onLearn).forEach(action => executeSelfAction(action, self));

    return Promise.resolve();
  }
  onForget(self: IUnit): Promise<void> {
    toArray(this.data.onForget).forEach(action => executeSelfAction(action, self));

    return Promise.resolve();
  }

  get data() {
    return this._skillData;
  }
}