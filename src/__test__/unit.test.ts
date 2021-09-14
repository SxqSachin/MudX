import assert from "assert";
import { Unit } from "../models/Unit";
import { UnitData, UnitEntity } from "../types/Unit";

describe('Unit Test', () => {
  it('Create', () => {
    const unitData: UnitData = {
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
      speed: 10,
      talent: 10,
    }

    const unit = new Unit(unitData);
    const enemy = new Unit(unitData);

    console.log(unit);

    assert.equal(unit.getEntity().curHP, 10);
  });
});