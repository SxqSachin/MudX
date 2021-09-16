import { ItemData } from "../../../types/Item";
import { SkillData } from "../../../types/Skill";

export const shield: ItemData = {
  id: "shield",
  name: "小圆盾",
  durability: 100,
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
};
