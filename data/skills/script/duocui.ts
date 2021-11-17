import { Message } from "@/core/message";
import { SkillData } from "@/types/Skill";

const duocui: SkillData = {
  colddown: 10,
  id: "duocui",
  name: "夺萃",
  chooseTarget: true,
  actions: [
    (self, target) => {
      self.dealDamage(target, 1, {
        triggerEvent: true
      });
    }
  ],
  onLearn: [
    self => {
      self.on('dealDamage', async data => {
        const extraDamage = self.status.strength;
        Message.push(`${self.name} 发动技能“夺萃”，造成1倍力量(${extraDamage})的额外伤害。`);
        self.dealDamage(data.target, extraDamage, {
          triggerEvent: false,
        });
      })
      self.on('takeDamage', async data => {
        Message.push(`${self.name} 发动技能“夺萃”，受到伤害时该伤害增加1点。`);
        // self.increaseStatus('curHP', 1);
        data.damage += 1;

        return data;
      })
    }
  ],
  onForget: [],
};

export default duocui;
