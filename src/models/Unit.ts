import { Items } from "../data";
import { IItem, ItemData, ItemID } from "../types/Item";
import { ISkill, SkillID } from "../types/Skill";
import { IUnit, UnitData, UnitStatusType, } from "../types/Unit";
import { deepClone } from "../utils";
import { hasProperity } from "../utils/object";
import { uuid } from "../utils/uuid";
import { Item } from "./Item";
import { Skill } from "./Skill";

export class Unit implements IUnit {
  private unitEntity!: UnitData;
  private _items!:  { [id in ItemID]: Item[] };
  private _skills!:  { [id in SkillID]: Skill };

  constructor(entity: UnitData) {
    this.init(entity);
  }

  init(data: UnitData) {
    data = deepClone(data);
    this.unitEntity = data;

    this._reinitItems();
    this._reinitSkills();
  }

  getEntity() {
    return this.unitEntity;
  }

  attack(target: IUnit) {
    target.decreaseStatus('curHP', this.phyAtk);
  }

  learnSkill(skill: ISkill) {
    const skillData = skill.data;
    const { id } = skillData;
    this.unitEntity.skills[id] = skillData;
    this._reinitSkills();
  }
  forgetSkill(skill: ISkill) {
    delete this.unitEntity.skills[skill.data.id];
    this._reinitSkills();
  }
  castSkill(skill: ISkill) {
    return this;
  }

  addItem(item: IItem): void {
    const itemData = item.data;
    const { id: itemID } = itemData;

    const items = this.unitEntity.items;
    if (!items[itemID]) {
      items[itemID] = [];
    }

    items[itemID].push(itemData);
    this._reinitItems();
  }
  removeItem(item: IItem): void {
    const itemData = item.data;
    const { id: itemID } = itemData;
    const items = this.unitEntity.items;

    if (!items[itemID]) {
      items[itemID] = [];
    }

    if (!items[itemID].length) {
      return;
    }
    items[itemID].pop();
    this._reinitItems();
  }
  addItemByID(itemID: ItemID, count: number) {
    const items = this.unitEntity.items;

    if (!Items.has(itemID)) {
      return;
    }

    if (!items[itemID]) {
      items[itemID] = [];
    }

    for (let i = 0; i < count; i++) {
      items[itemID].push(Items.getData(itemID) as ItemData);
    }
    this._reinitItems();
  }
  removeItemByID(itemID: ItemID, count: number) {
    const items = this.unitEntity.items;

    if (!Items.has(itemID)) {
      return;
    }

    if (!items[itemID]?.length) {
      return;
    }

    for (let i = 0; i < count; i++) {
      items[itemID].pop();
    }
    this._reinitItems();
  }
  useItem(item: Item) {
  }

  increaseStatus(status: UnitStatusType, val: number): void {
    this.setStatus(status, this.unitEntity[status] + val);
  }
  decreaseStatus(status: UnitStatusType, val: number): void {
    this.setStatus(status, this.unitEntity[status] - val);
  }
  setStatus(status: UnitStatusType, val: number): void {
    this.unitEntity[status] = val;
  }

  private _reinitItems() {
    this._items = {};
    Object.keys(this.unitEntity.items).forEach((itemID: ItemID) => {
      this._items[itemID] = [];
      this.unitEntity.items[itemID].forEach(itemData => {
        this._items[itemID].push(new Item(itemData));
      });
    });
  }
  private _reinitSkills() {
    this._skills = {};
    Object.keys(this.unitEntity.skills).forEach((skillID: SkillID) => {
      const skillData = this.unitEntity.skills[skillID];
      this._skills[skillID] = new Skill(skillData);
    });
  }

  get xid() { return this.unitEntity.xid; }
  get status() { return this.unitEntity; }
  get items() { return this._items; }
  get skills() { return this._skills; }

  get phyAtk() { return 3; }
  get phyDef() { return 0; }
  get powAtk() { return 0; }
  get powDef() { return 0; }
}
//  get maxHP() { return this.unitEntity.maxHP; }
//  get maxMP() { return this.unitEntity.maxMP; }
//  get maxSP() { return this.unitEntity.maxSP; }
//  get curHP() { return this.unitEntity.curHP; }
//  get curMP() { return this.unitEntity.curMP; }
//  get curSP() { return this.unitEntity.curSP; }

//  set maxHP(val: number) { this.unitEntity.maxHP = val; }
//  set maxMP(val: number) { this.unitEntity.maxMP = val; }
//  set maxSP(val: number) { this.unitEntity.maxSP = val; }
//  set curHP(val: number) { this.unitEntity.curHP = val; }
//  set curMP(val: number) { this.unitEntity.curMP = val; }
//  set curSP(val: number) { this.unitEntity.curSP = val; }

//  get phy() { return this.unitEntity.phy; }
//  get strength() { return this.unitEntity.strength; }
//  get dexterity() { return this.unitEntity.dexterity; }
//  get intelligence() { return this.unitEntity.intelligence; }
//  get talent() { return this.unitEntity.talent; }
//  get luck() { return this.unitEntity.luck; }
//  get perception() { return this.unitEntity.perception; }
//  get speed() { return this.unitEntity.speed; }

//  set phy(val: number) { this.unitEntity.phy = val; }
//  set strength(val: number) { this.unitEntity.strength = val; }
//  set dexterity(val: number) { this.unitEntity.dexterity = val; }
//  set intelligence(val: number) { this.unitEntity.intelligence = val; }
//  set talent(val: number) { this.unitEntity.talent = val; }
//  set luck(val: number) { this.unitEntity.luck = val; }
//  set perception(val: number) { this.unitEntity.perception = val; }
//  set speed(val: number) { this.unitEntity.speed = val; }