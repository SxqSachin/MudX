import { executeSelfAction } from "../core/actionExecuter";
import { IItem, ItemData } from "../types/Item";
import { isEmptyXID } from "../types/Object";
import { IUnit } from "../types/Unit";
import { deepClone, toArray, } from "../utils";
import { uuid } from "../utils/uuid";

export class Item implements IItem {
  private _itemData!: ItemData;

  constructor(data: ItemData) {
    const _data = deepClone(data);
    if (!_data.xid || isEmptyXID(_data.xid)) {
      _data.xid = uuid();
    }
    this._itemData = _data;
  }

  get data() {
    return this._itemData;
  }

  onUse(target: IUnit): void {
    throw new Error("Method not implemented.");
  }

  onEquip(self: IUnit): void {
    if (this.data.isEquipable) {
      toArray(this.data.onEquip).forEach(action => executeSelfAction(action, self));
    }
  }
  onUnequip(self: IUnit): void {
    if (this.data.isEquipable) {
      toArray(this.data.onUnequip).forEach(action => executeSelfAction(action, self));
    }
  }
}