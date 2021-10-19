import { ItemData } from "@/types/Item";
import { EMPTY_XID } from "@/types/Object";
import { IUnit } from "@/types/Unit";

export const item: ItemData = {
  xid: EMPTY_XID,
  id: "base_amulet",
  name: "护身符",
  durability: 100,
  isEquipable: true,
  isEquipped: false,
  isConsumable: false,
  isUseable: false,
  actions: [
  ],
  onEquip: [
    {
      effectTo: 'luck',
      val: 2,
    },
  ],
  onUnequip: [
    {
      effectTo: 'luck',
      val: -2,
    },
  ],
};