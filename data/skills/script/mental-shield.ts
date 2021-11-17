import { SkillData } from "@/types/Skill";

const skill: SkillData = {
  colddown: 10,
  id: "mental-shield",
  chooseTarget: true,
  name: "金钟罩",
  actions: [
    async function*(self, target) {
      self.addStateByID('mental-shield');

      return self;
    }
  ],
  onLearn: [],
  onForget: [],
};

export default skill;
