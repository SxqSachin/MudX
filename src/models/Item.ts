import { IItem, ItemData } from "../types/Item";
import { IUnit } from "../types/Unit";
import { deepClone, } from "../utils";
import { uuid } from "../utils/uuid";

export class Item implements IItem {
  private _itemData!: ItemData;

  constructor(data: ItemData) {
    const _data = deepClone(data);
    if (!_data.xid) {
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
}