import { ItemData } from "../../../types/Item";
import { EMPTY_XID } from "../../../types/Object";
import { SkillData } from "../../../types/Skill";

export const shield: ItemData = {
  xid: EMPTY_XID,
  id: "shield",
  name: "小圆盾",
  durability: 100,
  isEquipable: true,
  isEquipped: false,
  isConsumable: false,
  actions: [
    {
      target: "target",
      effectTo: "curHP",
      val: -10,
    },
    {
      target: "self",
      effectTo: "curHP",
      val: 10,
    },
  ],
  onEquip: [],
  onUnequip: [],
};