import scriptList from './script';
import jsonList from './json';
import { toArray } from '../../utils';
import { Action } from '../../types/action';
import { Item } from '../../models/Item';
import { ItemData } from '../../types/Item';

const ItemMap: Map<string, Item> = new Map();

scriptList.forEach(scriptObj => {
  ItemMap.set(scriptObj.id, new Item(scriptObj));
});
jsonList.forEach(jsonObj => {
  const { id, name, durability } = jsonObj;
  const skillData: ItemData = {
    id,
    name,
    durability,
    actions: (() => {
      const actions = toArray(jsonObj.actions);

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

  ItemMap.set(jsonObj.id, new Item(skillData));
});

export {
  ItemMap
};