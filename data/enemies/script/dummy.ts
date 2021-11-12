import { Enemy } from "@/models/Enemy";
import { IEnemy } from "@/types/enemy";
import { GameEnvironment } from "@/types/game";
import { UnitData } from "@/types/Unit";
import { uuid } from "@/utils/uuid";

const generator = (env?: GameEnvironment) : IEnemy => {
  const unitData: UnitData = {
    name: "木桩",
    id: "dummy",
    xid: uuid(),
    level: 1,
    curHP: 1000,
    curMP: 10,
    curSP: 10,
    maxHP: 1000,
    maxMP: 10,
    maxSP: 10,
    phy: 0,
    strength: 0,
    dexterity: 0,
    intelligence: 0,
    luck: 0,
    perception: 0,
    speed: 1110,
    talent: 0,
    items: {},
    skills: {},
    states: {},
    phyAtk: 6,
    phyDef: 0,
    powAtk: 0,
    powDef: 0,
  };
  const unit = new Enemy(unitData);

  unit.on('aiRoundStart', async data => {
    await data.source.attack(data.target);

    return data;
  });

  return unit;
};

export default {
  id: 'dummy',
  generator: generator,
}