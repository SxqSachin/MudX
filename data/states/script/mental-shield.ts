import { Message } from "@/core/message";
import { SkillData } from "@/types/Skill";
import { State } from "@/types/state";
import { makeDamageChangeString } from "@/utils/unit";

const state: State = {
  id: "mental-shield",
  name: "金钟罩",
  stackable: false,
  remainTime: -1,
  actions: [
    async function*(self) {
      const unbind = self.on('takeDamage', async data => {
        Message.push(`${self.name} 发动金钟罩，本次伤害归零。${makeDamageChangeString(data.damage, 0)}`);

        data.damage = 0;
        self.removeStateByID('mental-shield');

        unbind();

        return data;
      });
    }
  ],
};

export default state;
