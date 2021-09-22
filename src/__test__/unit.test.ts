import assert from "assert";
import { XStorage } from "../core/storage";
import { Items } from "../data";
import { Skills } from "../data/skills";
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
      phyAtk: 0,
      phyDef: 0,
      powAtk: 0,
      powDef: 0,
      xid: uuid(),
    }

    const unit: IUnit = new Unit(unitData);
    const enemy: IUnit = new Unit(unitData);
    // const enemy = new Unit(unitData);

    const sword = Items.get('sword');
    unit.addItem(sword).equipItem(sword);

    const sword2 = Items.get('sword');
    unit.addItem(sword2).equipItem(sword2);

    const shield = Items.get('shield');
    enemy.addItem(shield).equipItem(shield);

    // unit.learnSkill(Skills.get('duocui'));
    // enemy.learnSkill(Skills.get('duocui'));

    console.log(XStorage.getItem('unit'));
    XStorage.setItem('unit', unit.serialize())
    console.log(XStorage.getItem('unit'));


    unit.attack(enemy);

    assert.equal(enemy.status.curHP, 7);
  });
});