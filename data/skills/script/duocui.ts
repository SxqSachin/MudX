import { Message } from "@/core/message";
import { SkillData } from "@/types/Skill";
import { DamageType } from "@/types/Unit";
import { delay, waitActionMessageDelay } from "@/utils";
import { makeDamageChangeString } from "@/utils/unit";

const duocui: SkillData = {
  colddown: 10,
  id: "duocui",
  name: "夺萃",
  chooseTarget: true,
  description: "攻击目标，并使目标损失生命值。",
  actions: [
    async function*(self, target) {
      self.dealDamage(target, { damage: 1 });
    }
  ],
  onLearn: [
    async function*(self) {
      self.on('dealDamage', async data => {
        const extraDamage = self.status.strength;
        data.damage += extraDamage;

        Message.push(`${self.name} 发动技能“夺萃”，造成1倍力量(${extraDamage})的额外伤害。${makeDamageChangeString(data.damage, data.damage + extraDamage)}`);

        await waitActionMessageDelay();

        return data;
      })
      self.on('takeDamage', async data => {
        Message.push(`${self.name} 发动技能“夺萃”，受到伤害时该伤害增加1点。${makeDamageChangeString(data.damage, data.damage + 1)}`);

        data.damage += 1;

        await waitActionMessageDelay();

        return data;
      })
    }
  ],
  onForget: [],
};

export default duocui;
