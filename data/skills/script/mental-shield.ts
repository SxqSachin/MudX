import { SkillData } from "@/types/Skill";

const skill: SkillData = {
  colddown: 10,
  id: "mental-shield",
  name: "金钟罩",
  actions: [
    (self, target) => {
      // self.dealDamage(target, target.status.maxHP - 1, {
      //   triggerEvent: true
      // });
      self.addStateByID('mental-shield');

      console.log(self);

      return self;
    }
  ],
  onLearn: [],
  onForget: [],
};

export default skill;
