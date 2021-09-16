import scriptSkillList from './script';
import jsonSkillList from './json';
import { Skill } from '../../models/Skill';
import { SkillData } from '../../types/Skill';
import { toArray } from '../../utils';
import { Action } from '../../types/action';

const SkillMap: Map<string, Skill> = new Map();

scriptSkillList.forEach(scriptSkill => {
  SkillMap.set(scriptSkill.id, new Skill(scriptSkill));
});
jsonSkillList.forEach(jsonSkill => {
  const skillData: SkillData = {
    id: jsonSkill.id,
    colddown: jsonSkill.colddown,
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
    })()
  };

  SkillMap.set(jsonSkill.id, new Skill(skillData));
});

export {
  SkillMap
};