import scriptList from './script';
import jsonList from './json';
import { deepClone, toArray } from '../../utils';
import { Action } from '../../types/action';
import { Item } from '../../models/Item';
import { ItemData, ItemID } from '../../types/Item';

const ItemMap: Map<string, Item> = new Map();
const ItemDataMap: Map<string, ItemData> = new Map();

scriptList.forEach(scriptObj => {
  delete scriptObj.xid;
  ItemDataMap.set(scriptObj.id, scriptObj);
  ItemMap.set(scriptObj.id, new Item(scriptObj));
});
jsonList.forEach(jsonObj => {
  const { id, name, durability } = jsonObj;
  const itemData: ItemData = {
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

  ItemDataMap.set(jsonObj.id, itemData);
  ItemMap.set(jsonObj.id, new Item(itemData));
});

const Items = {
  get: (itemID: ItemID): Item | null => {
    const itemData = ItemDataMap.get(itemID);

    if (!itemData) {
      return null;
    }

    return new Item(itemData);
  },
  getData: (itemID: ItemID): ItemData | null => {
    const itemData = ItemDataMap.get(itemID);

    if (!itemData) {
      return null;
    }

    return deepClone(itemData);
  },
  has: (itemID: ItemID): boolean => {
    return ItemDataMap.has(itemID);
  }
}

export {
  Items
};