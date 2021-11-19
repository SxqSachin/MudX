import { SkillData } from "@/types/Skill";

const skill: SkillData = {
  colddown: 10,
  id: "mental-shield",
  chooseTarget: true,
  description: "抵挡下一次受到的伤害",
  name: "金钟罩",
  actions: [
    async function*(self, target) {
      target.addStateByID('mental-shield');

      return self;
    }
  ],
  onLearn: [],
  onForget: [],
};

export default skill;
