import { ItemData } from "../../../types/Item";
import { EMPTY_XID } from "../../../types/Object";
import { IUnit } from "../../../types/Unit";

export const shield: ItemData = {
  xid: EMPTY_XID,
  id: "shield",
  name: "小圆盾",
  durability: 100,
  isEquipable: true,
  isEquipped: false,
  isConsumable: false,
  actions: [
  ],
  onEquip: [
    {
      effectTo: 'phyDef',
      val: 2,
    },
    (self: IUnit) => {
      self.on('takeDamage', data => {
        // if (Dice.d6 > 3) {
        //   // const damage = data.damage;
        //   // console.log('damaged', damage);
        //   // self.increaseStatus('curHP', 1);
        // }

        if (data.damage) {
          data.damage -= 1;
        }

        return data;
      });
    }
  ],
  onUnequip: [
    {
      effectTo: 'phyDef',
      val: -2,
    },
  ],
};
