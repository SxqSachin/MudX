import { Enemy } from "@/models/Enemy";
import { IEnemy } from "@/types/enemy";
import { GameEnvironment } from "@/types/game";
import { UnitData } from "@/types/Unit";
import { isEmpty } from "@/utils";
import { uuid } from "@/utils/uuid";
import { Skills } from "@data/skills";

const id = "修道者";
const generator = (env?: GameEnvironment) : IEnemy => {
  const unitData: UnitData = {
    name: id,
    id,
    xid: uuid(),
    level: 1,
    curHP: 100,
    curMP: 10,
    curSP: 10,
    maxHP: 100,
    maxMP: 10,
    maxSP: 10,
    phy: 10,
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    luck: 10,
    perception: 10,
    speed: 25,
    talent: 10,
    items: {},
    skills: {
      "气宗拳": Skills.get("气宗拳").data,
    },
    states: {},
    phyAtk: 0,
    phyDef: 0,
    powAtk: 0,
    powDef: 0,
    spoils: 'gold-icon',
  };
  const unit = new Enemy(unitData);

  unit.on('aiRoundStart', async function(data) {
    if (isEmpty(data.target.states["气宗拳"])) {
      for await (const iterator of data.source.castSkill("气宗拳", data.target)) {
      }
    } else {
      await data.source.attack(data.target);
    }

    return data;
  });

  return unit;
};

export default {
  id,
  generator: generator,
}
