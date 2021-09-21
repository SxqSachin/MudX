import { ItemData } from "../../../types/Item";
import { EMPTY_XID } from "../../../types/Object";
import { SkillData } from "../../../types/Skill";
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
      const unregister = self.on('takeDamage', data => {
        const damage = data.damage;
        console.log('damaged', damage);

        self.increaseStatus('curHP', damage);
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
