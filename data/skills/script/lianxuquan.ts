import { Message } from "@/core/message";
import { SkillData } from "@/types/Skill";
import { delay } from "@/utils";

const skill: SkillData = {
  colddown: 10,
  id: "lianxuquan",
  chooseTarget: true,
  name: "连续拳",
  actions: [
    async (self, target) => {
      const damage = self.phyAtk * 0.2;

      for (let i = 0; i < 10; i++) {
        await self.dealDamage(target, damage);
        Message.push(`${self.name} 发动技能“连续拳”，对${target.name}造成${damage}点伤害`);
        await delay(200);
      }
      // self.dealDamage(target, target.status.maxHP - 1, {
      //   triggerEvent: true
      // });
      // self.addStateByID('mental-shield');

      // console.log(self);

      return self;
    }
  ],
  onLearn: [],
  onForget: [],
};

export default skill;
