import scriptSkillList from './script';
import { Skill } from '@/models/Skill';
import { ISkill, SkillData, SkillID } from '@/types/Skill';
import { deepClone, toArray } from '@/utils';
import { Action, SelfAction } from '@/types/action';
import { State, StateID } from '@/types/state';

const map: Map<string, State> = new Map();

scriptSkillList.forEach(data => {
  map.set(data.id, data);
});

const States = {
  get: (id: StateID): State => {
    return deepClone(map.get(id) as any as State);
  },
}

export {
  States
};