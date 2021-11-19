import { Message } from "@/core/message";
import { GameEnvironment } from "@/types/game";
import { SkillData } from "@/types/Skill";
import { DamageType } from "@/types/Unit";
import { delay } from "@/utils";

const skill: SkillData = {
  colddown: 10,
  id: "气宗拳",
  chooseTarget: true,
  description: unit => {
    return `进行一次强力攻击，对目标造成0.6倍攻击力的真实伤害。\n两回合内，目标每次攻击时，自身都会受到3点伤害。`;
  },
  name: "气宗拳",
  actions: [
    async function*(self, target) {
      const damage = self.phyAtk * 0.6;

      await self.dealDamage(target, {
        damage,
        actionName: "气宗拳",
        damageType: DamageType.PURE,
        actionType: "CAST_SKILL",
      });

      target.addStateByID("气宗拳-debuff");

      //   yield await delay(100);
      // }

      return Promise.resolve();
    }
  ],
  onLearn: [],
  onForget: [],
};

export default skill;
