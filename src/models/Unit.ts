import { ISkill } from "../types/Skill";
import { IUnit, UnitData, } from "../types/Unit";
import { deepClone } from "../utils";
import { hasProperity } from "../utils/object";
import { uuid } from "../utils/uuid";

export class Unit implements IUnit {
  private unitEntity!: UnitData;

  constructor(entity: UnitData) {
    this.init(entity);
  }

  init(data: UnitData) {
    data = deepClone(data);
    this.unitEntity = data;
  }

  getEntity() {
    return this.unitEntity;
  }

  castSpell(spell: ISkill) {
    return this;
  }

  serialize(): string {
    return JSON.stringify(this.unitEntity);
  }

  unserialize(raw: string) {
    const unitEntity = JSON.parse(raw);
    this.init(unitEntity);
  }

  get xid() {
    return this.unitEntity.xid;
  }

  get maxHP() { return this.unitEntity.maxHP; }
  get maxMP() { return this.unitEntity.maxMP; }
  get maxSP() { return this.unitEntity.maxSP; }
  get curHP() { return this.unitEntity.curHP; }
  get curMP() { return this.unitEntity.curMP; }
  get curSP() { return this.unitEntity.curSP; }

  set maxHP(val: number) { this.unitEntity.maxHP = val; }
  set maxMP(val: number) { this.unitEntity.maxMP = val; }
  set maxSP(val: number) { this.unitEntity.maxSP = val; }
  set curHP(val: number) { this.unitEntity.curHP = val; }
  set curMP(val: number) { this.unitEntity.curMP = val; }
  set curSP(val: number) { this.unitEntity.curSP = val; }

  get phy() { return this.unitEntity.phy; }
  get strength() { return this.unitEntity.strength; }
  get dexterity() { return this.unitEntity.dexterity; }
  get intelligence() { return this.unitEntity.intelligence; }
  get talent() { return this.unitEntity.talent; }
  get luck() { return this.unitEntity.luck; }
  get perception() { return this.unitEntity.perception; }
  get speed() { return this.unitEntity.speed; }

  set phy(val: number) { this.unitEntity.phy = val; }
  set strength(val: number) { this.unitEntity.strength = val; }
  set dexterity(val: number) { this.unitEntity.dexterity = val; }
  set intelligence(val: number) { this.unitEntity.intelligence = val; }
  set talent(val: number) { this.unitEntity.talent = val; }
  set luck(val: number) { this.unitEntity.luck = val; }
  set perception(val: number) { this.unitEntity.perception = val; }
  set speed(val: number) { this.unitEntity.speed = val; }

  get items() { return this.unitEntity.items; }
  get skills() { return this.unitEntity.skills; }
}