import { Message } from "@/core/message";
import { GameEnvironment } from "@/types/game";
import { SkillData } from "@/types/Skill";
import { DamageType } from "@/types/Unit";
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
        await self.dealDamage(target, {
          damage,
          actionName: "连续拳",
          damageType: DamageType.PHYSICAL,
          actionType: "CAST_SKILL",
        });

        yield await delay(100);
      }

      return Promise.resolve();
    }
  ],
  onLearn: [],
  onForget: [],
};

export default skill;
