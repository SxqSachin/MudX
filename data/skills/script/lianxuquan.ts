import { Message } from "@/core/message";
import { GameEnvironment } from "@/types/game";
import { SkillData } from "@/types/Skill";
import { delay } from "@/utils";

const skill: SkillData = {
  colddown: 10,
  id: "lianxuquan",
  chooseTarget: true,
  description: unit => {
    return `快速攻击 10 次，每次攻击造成0.2倍攻击(${unit.phyAtk*0.2})的伤害。`;
  },
  name: "连续拳",
  actions: [
    async function*(self, target) {
      const damage = self.phyAtk * 0.2;

      for (let i = 0; i < 10; i++) {
        await self.dealDamage(target, damage);

        Message.push(`${self.name} 发动技能“连续拳”，对${target.name}造成${damage}点伤害`);

        yield await delay(200);
      }

      return Promise.resolve();
    }
  ],
  onLearn: [],
  onForget: [],
};

export default skill;
