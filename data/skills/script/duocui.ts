import { SkillData } from "@/types/Skill";

const duocui: SkillData = {
  colddown: 10,
  id: "duocui",
  name: "夺萃",
  chooseTarget: true,
  actions: [
    (self, target) => {
      self.dealDamage(target, target.status.maxHP - 1, {
        triggerEvent: true
      });
    }
  ],
  onLearn: [
    self => {
      self.on('dealDamage', async data => {
        self.dealDamage(data.target, 5, {
          triggerEvent: false,
        });
      })
      self.on('takeDamage', async data => {
        self.increaseStatus('curHP', 0);
      })
    }
  ],
  onForget: [],
};

export default duocui;
