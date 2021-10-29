import { Action, SelfAction } from "./action";
import { XSerializable } from "./Object";
import { IUnit } from "./Unit";

export type ItemID = string;
export type ItemData = XSerializable & ({
  id: ItemID;
  name: string;

  durability: number;

  isEquipable: false;

  isUseable: boolean;
  isConsumable: boolean;

  actions: Action | Action[];
} | {
  id: ItemID;
  name: string;

  durability: number;

  isEquipable: true;
  isEquipped: boolean;

  isUseable: boolean;
  isConsumable: boolean;

  actions: Action | Action[];

  onEquip: SelfAction | SelfAction[];
  onUnequip: SelfAction | SelfAction[];
})

export type ItemSerializeData = Omit<ItemData, 'actions'>;

export interface IItem {
  data: Readonly<ItemData>;

  onUse(target: IUnit): void;

  onEquip(self: IUnit): void;
  onUnequip(self: IUnit): void;
}

export type PriceList = { [itemID in ItemID]: ItemPrice };
export type ItemPrice = {
  enterPrice: {
    subject: ItemID;
    amount: number;
  },
  salePrice: {
    subject: ItemID;
    amount: number;
  },
}
export type TradeData = {
  shopkeeper: IUnit;
  priceList: PriceList;
}