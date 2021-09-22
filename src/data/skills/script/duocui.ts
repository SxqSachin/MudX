import { SkillData } from "../../../types/Skill";

export const duocui: SkillData = {
  colddown: 10,
  id: "duocui",
  name: "夺萃",
  actions: [
    (self, target) => {
      self.dealDamage(target, target.status.maxHP - 1, {
        triggerEvent: true
      });
    }
  ],
  onLearn: [
    self => {
      self.on('dealDamage', data => {
        self.dealDamage(data.target, 5, {
          triggerEvent: false,
        });
      })
      self.on('takeDamage', data => {
        self.increaseStatus('curHP', 0);
      })
    }
  ],
  onForget: [],
};
