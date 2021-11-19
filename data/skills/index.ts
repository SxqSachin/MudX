import scriptSkillList from './script';
import jsonSkillList from './json';
import { Skill } from '@/models/Skill';
import { ISkill, SkillData, SkillID } from '@/types/Skill';
import { deepClone, toArray } from '@/utils';
import { Action, SelfAction } from '@/types/action';

const SkillMap: Map<string, Skill> = new Map();

scriptSkillList.forEach(scriptSkill => {
  SkillMap.set(scriptSkill.id, new Skill(scriptSkill));
});
jsonSkillList.forEach(jsonSkill => {
  const { id, name, colddown } = jsonSkill;
  const skillData: SkillData = {
    id,
    name,
    colddown,
    chooseTarget: false,
    description: '',
    actions: (() => {
      const actions = toArray(jsonSkill.actions);

      return actions.map(action => {
        const actionObj: Action = {
          effectTo: action.effectTo as any,
          target: action.target as any,
          val: action.val,
        }

        return actionObj;
      })
    })(),
    onLearn: (() => {
      // @ts-ignore
      return toArray(jsonSkill.onLearn).map(action => {
        const actionObj: SelfAction = {
          effectTo: action.effectTo as any,
          val: action.val,
        }

        return actionObj;
      })
    })(),
    onForget: (() => {
      // @ts-ignore
      return toArray(jsonSkill.onForget).map(action => {
        const actionObj: SelfAction = {
          effectTo: action.effectTo as any,
          val: action.val,
        }

        return actionObj;
      })
    })(),
  };

  SkillMap.set(jsonSkill.id, new Skill(skillData));
});

const Skills = {
  get: (skillID: SkillID): ISkill => {
    return new Skill(SkillMap.get(skillID)?.data!);
  },
}

export {
  Skills
};