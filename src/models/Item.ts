import { IItem, ItemData } from "../types/Item";
import { ISkill, SkillData } from "../types/Skill";
import { IUnit } from "../types/Unit";
import { deepClone, toArray } from "../utils";

export class Item implements IItem {
  private _itemData!: ItemData;

  constructor(data: ItemData) {
    this._itemData = data;
  }

  get data() {
    return this._itemData;
  }

  onUse(target: IUnit): void {
    throw new Error("Method not implemented.");
  }
}