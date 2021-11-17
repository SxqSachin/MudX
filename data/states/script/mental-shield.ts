import { Message } from "@/core/message";
import { SkillData } from "@/types/Skill";
import { State } from "@/types/state";

const state: State = {
  id: "mental-shield",
  name: "金钟罩",
  stackable: false,
  remainTime: -1,
  actions: [
    async function*(self) {
      self.on('takeDamage', async data => {
        data.damage = 0;

        Message.push(`${self.name} 发动金钟罩，本次伤害归零。`);

        self.removeStateByID('mental-shield').next();

        return data;
      });
    }
  ],
};

export default state;
