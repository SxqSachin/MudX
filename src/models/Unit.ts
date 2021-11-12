import { ElementType } from "react";
import { Message } from "../core/message";
import { Publisher, Subscriber } from "../core/subscribe";
import { Items } from "@data/items";
import { AsyncDataProcessCallback, DataProcessCallback, VoidCallback } from "../types";
import { IItem, ItemData, ItemID } from "../types/Item";
import { XID } from "../types/Object";
import { ISkill, SkillID } from "../types/Skill";
import { DamageInfo, IUnit, UnitAttackedEventData, UnitAttackEventData, UnitDamageEventData, UnitData, UnitEventData, UnitEventType, UnitItemEventData, UnitSelf, UnitSimpleEventData, UnitSkillEventData, UnitStatus, UnitStatusType, } from "../types/Unit";
import { deepClone } from "../utils";
import { uuid } from "../utils/uuid";
import { Item } from "./Item";
import { Skill } from "./Skill";
import { State, StateID } from "@/types/state";

const DefaultDamageInfo: DamageInfo = {
  triggerEvent: true,
};

export class Unit implements IUnit {
  private unitEntity!: UnitData;
  private _items!:  { [id in ItemID]: Item[] };
  private _skills!:  { [id in SkillID]: Skill };
  private _states!:  { [id in StateID]: State };

  private _publisher!: Publisher<UnitEventType, UnitEventData>;
  private _subscriber!: Subscriber<UnitEventType, UnitEventData>;

  constructor(entity: UnitData) {
    this.init(entity);
  }

  init(data: UnitData) {
    data = deepClone(data);
    this.unitEntity = data;

    this._publisher = new Publisher();
    this._subscriber = new Subscriber();

    this._reinitItems();
    this._reinitSkills();
  }

  async attack(target: IUnit) {
    const damage = this.phyAtk;
    const targetDef = target.phyDef;

    const damageVal = damage - targetDef;

    this.fire('beforeAttack', { source: this, target, damage: damageVal });
    target.fire('beforeAttacked', { source: this, target, damage: damageVal });

    const resDamage = await this.dealDamage(target, damageVal)
    Message.push(`${this.data.name} 攻击了 ${target.data.name}，造成 ${resDamage} 点伤害 `);

    this.fire('afterAttack', { source: this, target, damage: resDamage });
    target.fire('afterAttacked', { source: this, target, damage: resDamage });
  }

  async dealDamage(target: IUnit, damage: number, info: DamageInfo = DefaultDamageInfo) {
    if (info?.triggerEvent) {
      damage = (await this.fire('dealDamage', { source: this, target, damage }))?.damage ?? damage;
      damage = (await target.fire('takeDamage', { source: this, target, damage }))?.damage ?? damage;
    }

    target.decreaseStatus('curHP', Math.max(damage, 0));

    return damage;
  }

  learnSkill(skill: ISkill) {
    const skillData = skill.data;
    const { id } = skillData;

    if (!!this.unitEntity.skills[id]) {
      return this;;
    }

    this.unitEntity.skills[id] = skillData;

    this._reinitSkills();

    this.skills[id].onLearn(this);
    this.fire('learnSkill', { source: this, target: this, skill: this.skills[id] })

    return this;
  }
  forgetSkill({ data: { id } }: ISkill) {
    delete this.unitEntity.skills[id];

    this.skills[id].onLearn(this);
    this.fire('forgetSkill', { source: this, target: this, skill: this.skills[id] })

    this._reinitSkills();

    return this;
  }
  castSkill(skillID: SkillID, target: IUnit) {
    if (!this.skills[skillID]) {
      return this;
    }

    this.skills[skillID].cast(this, target);
    this.fire('castSkill', { source: this, target, skill: this.skills[skillID] })
    target.fire('beSkillTarget', { source: this, target, skill: this.skills[skillID] })


    return this;
  }

  addItem(item: IItem): UnitSelf {
    const itemData = item.data;
    const { id: itemID } = itemData;

    const items = this.unitEntity.items;
    if (!items[itemID]) {
      items[itemID] = [];
    }

    const isItemExist = Object.values(items).some(itemList => itemList.some(curItem => curItem.xid === item.data.xid));
    if (!isItemExist) {
      items[itemID].push(itemData);
      this._reinitItems();
    }

    return this;
  }
  removeItem(item: IItem): UnitSelf {
    const itemData = item.data;
    const { id: itemID } = itemData;
    const items = this.unitEntity.items;

    if (!items[itemID]) {
      items[itemID] = [];
    }

    if (!items[itemID].length) {
      return this;
    }
    items[itemID].pop();
    this._reinitItems();

    return this;
  }
  addItemByID(itemID: ItemID, count: number) {
    const items = this.unitEntity.items;

    if (!Items.has(itemID)) {
      return this;
    }

    if (!items[itemID]) {
      items[itemID] = [];
    }

    const newItem = [];
    for (let i = 0; i < count; i++) {
      newItem.push(Items.getData(itemID) as ItemData);
    }
    items[itemID].splice(0, 0, ...newItem)

    this._reinitItems();

    return this;
  }
  removeItemByID(itemID: ItemID, count: number) {
    const items = this.unitEntity.items;

    if (!Items.has(itemID)) {
      return this;
    }

    if (!items[itemID]?.length) {
      return this;
    }

    items[itemID].splice(0, count);
    this._reinitItems();

    return this;
  }
  useItem(item: Item) {
    this._reinitItems();

    return this;
  }

  equip(xid: XID) {
    Object.keys(this.unitEntity.items).some(itemID => {
      const itemDataList = this.unitEntity.items[itemID];
      return itemDataList.some((_, index) => {
        const itemData = this.unitEntity.items[itemID][index];
        if (itemData.xid === xid && itemData.isEquipable === true) {
          itemData.isEquipped = true;

          Object.values(this.items).some(itemList => itemList.some(curItem => {
            if (xid === curItem.data.xid) {
              curItem.onEquip(this);
              return true;
            }

            return false;
          }));

          return true;
        }

        return false;
      })
    });
    this._reinitItems();

    return this;
  }
  unequip(xid: XID) {
    Object.keys(this.unitEntity.items).some(itemID => {
      const itemDataList = this.unitEntity.items[itemID];
      return itemDataList.some((_, index) => {
        const itemData = this.unitEntity.items[itemID][index];
        if (itemData.xid === xid && itemData.isEquipable === true) {
          itemData.isEquipped = false;

          Object.values(this.items).some(itemList => itemList.some(curItem => {
            if (xid === curItem.data.xid) {
              curItem.onUnequip(this);
              return true;
            }

            return false;
          }));

          return true;
        }

        return false;
      })
    });
    this._reinitItems();

    return this;
  }

  equipItem(item: IItem) {
    return this.equip(item.data.xid);
  }
  unequipItem(item: IItem) {
    return this.unequip(item.data.xid);
  }

  get equipments() {
    return Object.values(this.items).flatMap(itemList => {
      return itemList.filter(item => item.data.isEquipable && item.data.isEquipped);
    })
  }

  increaseStatus(status: UnitStatusType, val: number): UnitSelf {
    return this.setStatus(status, this.unitEntity[status] + val);
  }
  decreaseStatus(status: UnitStatusType, val: number): UnitSelf {
    return this.setStatus(status, this.unitEntity[status] - val);
  }
  setStatus(status: UnitStatusType, val: number): UnitSelf {
    this.unitEntity[status] = val;

    return this;
  }

  on(event: 'beforeAttack' | 'afterAttack', listener: AsyncDataProcessCallback<UnitAttackEventData>): VoidCallback;
  on(event: 'beforeAttacked' | 'afterAttacked', listener: AsyncDataProcessCallback<UnitAttackedEventData>): VoidCallback;
  on(event: 'dealDamage' | 'takeDamage', listener: AsyncDataProcessCallback<UnitDamageEventData>): VoidCallback;
  on(event: 'addItem' | 'removeItem' | 'equipItem' | 'unequipItem', listener: AsyncDataProcessCallback<UnitItemEventData>): VoidCallback;
  on(event: 'learnSkill' | 'forgetSkill' | 'castSkill' | 'beSkillTarget', listener: AsyncDataProcessCallback<UnitSkillEventData>): VoidCallback;
  on(event: 'roundStart' | 'roundEnd' | 'aiRoundStart', listener: AsyncDataProcessCallback<UnitSimpleEventData>): VoidCallback;
  on(event: UnitEventType, listener: AsyncDataProcessCallback<UnitEventData>): VoidCallback {
    return this._subscriber.subscribe(this._publisher, event, listener);
  }

  async fire(event: 'beforeAttack' | 'afterAttack', data: UnitAttackEventData): Promise<UnitAttackEventData>;
  async fire(event: 'beforeAttacked' | 'afterAttacked', data: UnitAttackedEventData): Promise<UnitAttackedEventData>;
  async fire(event: 'dealDamage' | 'takeDamage', data: UnitDamageEventData): Promise<UnitAttackedEventData>;
  async fire(event: 'addItem' | 'removeItem' | 'equipItem' | 'unequipItem', data: UnitItemEventData): Promise<UnitItemEventData>;
  async fire(event: 'learnSkill' | 'forgetSkill' | 'castSkill' | 'beSkillTarget', data: UnitSkillEventData): Promise<UnitSkillEventData>;
  async fire(event: 'roundStart' | 'roundEnd' | 'aiRoundStart', data: UnitSimpleEventData): Promise<UnitSimpleEventData>;
  async fire(event: UnitEventType, data: UnitEventData): Promise<UnitEventData> {
    return await this._publisher.publish(event, data);
  }

  private _reinitItems() {
    console.time('_reinitItems: ' + this.name);
    this._items = {};
    Object.keys(this.unitEntity.items).forEach((itemID: ItemID) => {
      this._items[itemID] = [];
      this.unitEntity.items[itemID].forEach(itemData => {
        this._items[itemID].push(new Item(itemData));
      });
    });
    console.timeEnd('_reinitItems: ' + this.name);
  }
  private _reinitSkills() {
    this._skills = {};
    Object.keys(this.unitEntity.skills).forEach((skillID: SkillID) => {
      const skillData = this.unitEntity.skills[skillID];
      this._skills[skillID] = new Skill(skillData);
    });
  }

  get xid() { return this.unitEntity.xid; }
  get status(): UnitStatus {
    const data: Partial<UnitData> = { ...this.unitEntity };
    delete data.xid;
    delete data.items;
    delete data.skills;
    delete data.name;
    delete data.states;
    delete data.id;

    const status = data as UnitStatus;

    return status;
  }
  get data() { return this.unitEntity; }
  get items() { return this._items; }
  get skills() { return this._skills; }
  get states() { return this._states; }

  get phyAtk() {
    const { strength, phyAtk } = this.status;
    return strength + phyAtk;
  }
  get phyDef() {
    const { phy, phyDef } = this.status;
    return phy * 0.5 + phyDef;
  }
  get powAtk() {
    return this.unitEntity.powAtk;
  }
  get powDef() {
    return this.unitEntity.powDef;
  }
  get speed() {
    return this.status.speed + this.status.dexterity * 0.2;
  }

  get name() {
    return this.unitEntity.name;
  }

  serialize(): string {
    return JSON.stringify(this.unitEntity);
  }

  public static create(name: string): IUnit {
    const unitData: UnitData = {
      id: uuid(),
      name,
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
      speed: 10,
      talent: 10,
      items: {},
      skills: {},
      states: {},
      phyAtk: 0,
      phyDef: 0,
      powAtk: 0,
      powDef: 0,
      xid: uuid(),
    }

    return new Unit(unitData);
  }

  public static emptyStatus(): { [key in UnitStatusType]: number } {
    return {
      level: 1,
      curHP: 0,
      curMP: 0,
      curSP: 0,
      maxHP: 0,
      maxMP: 0,
      maxSP: 0,
      phy: 0,
      strength: 0,
      dexterity: 0,
      intelligence: 0,
      luck: 0,
      perception: 0,
      speed: 0,
      talent: 0,
      phyAtk: 0,
      phyDef: 0,
      powAtk: 0,
      powDef: 0,
    }
  }
}
export function createUnit(name: string): IUnit {
  const unitData: UnitData = {
    id: uuid(),
    name,
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
    speed: 10,
    talent: 10,
    items: {},
    skills: {},
    states: {},
    phyAtk: 0,
    phyDef: 0,
    powAtk: 0,
    powDef: 0,
    xid: uuid(),
  }

  return new Unit(unitData);
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