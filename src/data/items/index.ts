import scriptList from './script';
import jsonList from './json';
import { deepClone, toArray } from '../../utils';
import { Action } from '../../types/action';
import { Item } from '../../models/Item';
import { IItem, ItemData, ItemID } from '../../types/Item';
import { EMPTY_XID } from '../../types/Object';
import { UnitStatusType } from '../../types/Unit';

const ItemMap: Map<string, Item> = new Map();
const ItemDataMap: Map<string, ItemData> = new Map();

scriptList.forEach(scriptObj => {
  scriptObj.xid = EMPTY_XID;
  ItemDataMap.set(scriptObj.id, scriptObj);
  ItemMap.set(scriptObj.id, new Item(scriptObj));
});
jsonList.forEach(jsonObj => {
  const { id, name, durability, } = jsonObj;
  const itemData: ItemData = {
    id,
    xid: EMPTY_XID,
    name,
    durability,
    isEquipable: jsonObj.isEquipable ?? false,
    isConsumable: jsonObj.isConsumable,
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
    })(),
    isEquipped: false,
    onEquip: [],
    onUnequip: [],
  };

  if (itemData.isEquipable) {
    itemData.isEquipped = jsonObj.isEquipped ?? false;
    itemData.isConsumable = jsonObj.isConsumable ?? false;
    if (jsonObj.onEquip) {
      itemData.onEquip = jsonObj.onEquip.map(action => {
        return {
          effectTo: action.effectTo as UnitStatusType,
          target: action.target as 'self' | 'target',
          val: action.val,
        }
      })
    }
    if (jsonObj.onEquip) {
      itemData.onUnequip = jsonObj.onUnequip.map(action => {
        return {
          effectTo: action.effectTo as UnitStatusType,
          target: action.target as 'self' | 'target',
          val: action.val,
        }
      })
    }
  }

  ItemDataMap.set(jsonObj.id, itemData);
  ItemMap.set(jsonObj.id, new Item(itemData));
});

const DEFAULT_ITEM_DATA: ItemData = Object.freeze({
  id: '__DEFAULT__',
  name: '__DEFAULT__',
  actions: [],
  durability: -1,
  isConsumable: false,
  isEquipable: false,
  xid: EMPTY_XID,
});
const DEFAULT_ITEM: IItem = new Item(DEFAULT_ITEM_DATA);

const Items = {
  get: (itemID: ItemID): IItem => {
    return Items.create(itemID);
  },
  create: (itemID: ItemID): IItem => {
    const itemData = ItemDataMap.get(itemID);

    if (!itemData) {
      return DEFAULT_ITEM;
    }

    return new Item(deepClone(itemData));
  },
  getData: (itemID: ItemID): ItemData => {
    const itemData = ItemDataMap.get(itemID);

    if (!itemData) {
      return DEFAULT_ITEM_DATA;
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