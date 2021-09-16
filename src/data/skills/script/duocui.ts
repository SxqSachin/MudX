import { SkillData } from "../../../types/Skill";

export const duocui: SkillData = {
  colddown: 10,
  id: "duocui",
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
