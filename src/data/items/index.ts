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
  const tItemData = jsonObj as any as ItemData;
  const { id, name, durability, } = tItemData;
  const itemData: ItemData = {
    id,
    xid: EMPTY_XID,
    name,
    durability,
    isEquipable: tItemData.isEquipable ?? false,
    isConsumable: tItemData.isConsumable,
    isUseable: tItemData.isUseable ?? false,
    actions: (() => {
      const actions = toArray(tItemData.actions);
      if (Array.isArray(tItemData.actions)) {
        var a = tItemData.actions[0];
      }

      return actions.map(action => {
        if (typeof action === 'function') {
          return action;
        }
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

  if (itemData.isEquipable && tItemData.isEquipable) {
    itemData.isEquipped = jsonObj.isEquipped ?? false;
    itemData.isConsumable = jsonObj.isConsumable ?? false;
    if (tItemData.onEquip) {
      itemData.onEquip = toArray(tItemData.onEquip).map(action => {
        if (typeof action === 'function') {
          return action;
        }
        return {
          effectTo: action.effectTo as UnitStatusType,
          val: action.val,
        }
      })
    }
    if (itemData.onEquip) {
      itemData.onUnequip = toArray(tItemData.onUnequip).map(action => {
        if (typeof action === 'function') {
          return action;
        }
        return {
          effectTo: action.effectTo as UnitStatusType,
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
  isUseable: false,
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
    const newItem = Items.create(itemID);

    return newItem.data;
  },
  has: (itemID: ItemID): boolean => {
    return ItemDataMap.has(itemID);
  }
}

export {
  Items
};