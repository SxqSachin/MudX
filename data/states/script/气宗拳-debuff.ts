import { Message } from "@/core/message";
import { SkillData } from "@/types/Skill";
import { State } from "@/types/state";
import { DamageType } from "@/types/Unit";
import { makeDamageChangeString } from "@/utils/unit";

const state: State = {
  id: "气宗拳-debuff",
  name: "内力紊乱",
  description: "被气宗拳所伤，内力紊乱，进行攻击时自身会受到3点反噬伤害。",
  stackable: false,
  remainTime: 2,
  actions: [
    async function*(self) {
      console.log(self);
      self.on('beforeAttack', async data => {
        Message.push(`${self.name} 内力紊乱，受到3点伤害。`);

        await self.dealDamage(self, {
          damage: 3,
          damageType: DamageType.PURE,
          actionName: "内力紊乱",
          actionType: "CAST_SKILL",
          isDamageFromPassive: true,
          // noMessage: true,
        })
      });
    }
  ],
};

export default state;
