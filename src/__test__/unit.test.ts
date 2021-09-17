import assert from "assert";
import { Items } from "../data";
import { Item } from "../models/Item";
import { Unit } from "../models/Unit";
import { IUnit, UnitData } from "../types/Unit";
import { uuid } from "../utils/uuid";

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
      items: {},
      skills: {},
      xid: uuid(),
    }

    const unit: IUnit = new Unit(unitData);
    const enemy: IUnit = new Unit(unitData);
    // const enemy = new Unit(unitData);

    console.log(unit);
    const sword = Items.get('sword');
    unit.addItem(sword);
    unit.equip(sword.data.xid);

    // const shield = Items.get('shield');
    // unit.addItem(shield);
    // unit.equip(shield.data.xid);

    // const shield2 = Items.get('shield');
    // unit.addItem(shield2);
    // unit.equip(shield.data.xid);

    // console.log(unit.equipments, unit.items);

    // unit.attack(enemy);

    console.log(unit);

    assert.equal(enemy.status.curHP, 10);
  });
});