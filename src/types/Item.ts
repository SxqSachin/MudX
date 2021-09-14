import { Action } from "./action";
import { XSerializable } from "./Object";

export type ItemID = string;
export type ItemData = XSerializable & {
  id: ItemID;

  durability: number;
}

export type ItemRunTimeData = {
  id: ItemData;

  actions: Action | Action[];
}

export interface IItem {

}