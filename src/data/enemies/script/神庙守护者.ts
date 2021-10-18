import { Unit } from "../../../models/Unit";
import { Enemy, UnitData } from "../../../types/Unit";
import { uuid } from "../../../utils/uuid";

const generator = (): Enemy => {
  const unitData: UnitData = {
    name: "神庙守护者",
    id: "神庙守护者",
    xid: uuid(),
    level: 1,
    curHP: 10,
    curMP: 10,
    curSP: 10,
    maxHP: 10,
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
    skills: {},
    phyAtk: 0,
    phyDef: 0,
    powAtk: 0,
    powDef: 0,
    spoils: 'gold-icon',
  };
  return new Unit(unitData);
};

export default {
  id: '神庙守护者',
  generator: generator,
}
