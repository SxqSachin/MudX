import { Publisher, Subscriber } from "../core/subscribe";
import { Items } from "../data";
import { Skills } from "../data/skills";
import { DataCallback, DataProcessCallback, VoidCallback } from "../types";
import { IItem, ItemData, ItemID } from "../types/Item";
import { XID } from "../types/Object";
import { ISkill, SkillID } from "../types/Skill";
import { DamageInfo, IUnit, UnitAttackedEventData, UnitAttackEventData, UnitDamageEventData, UnitData, UnitEventData, UnitEventListener, UnitEventType, UnitItemEventData, UnitSelf, UnitStatusType, } from "../types/Unit";
import { deepClone } from "../utils";
import { hasProperity } from "../utils/object";
import { uuid } from "../utils/uuid";
import { Item } from "./Item";
import { Skill } from "./Skill";

const DefaultDamageInfo: DamageInfo = {
  triggerEvent: true,
};

export class Unit implements IUnit {
  private unitEntity!: UnitData;
  private _items!:  { [id in ItemID]: Item[] };
  private _skills!:  { [id in SkillID]: Skill };

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

  attack(target: IUnit) {
    const damage = this.phyAtk;
    const targetDef = target.phyDef;

    const damageVal = damage - targetDef;

    this.fire('beforeAttack', { source: this, target, damage: damageVal });
    target.fire('beforeAttacked', { source: this, target, damage: damageVal });

    this.dealDamage(target, damageVal)

    this.fire('afterAttack', { source: this, target, damage: damageVal });
    target.fire('afterAttacked', { source: this, target, damage: damageVal });
  }

  dealDamage(target: IUnit, damage: number, info: DamageInfo = DefaultDamageInfo) {
    if (info?.triggerEvent) {
      damage = this.fire('dealDamage', { source: this, target, damage })?.damage ?? damage;
      damage = target.fire('takeDamage', { source: this, target, damage })?.damage ?? damage;
    }

    target.decreaseStatus('curHP', Math.max(damage, 0));
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
    this.fire('learnSkill', { skill: this.skills[id] })

    return this;
  }
  forgetSkill({ data: { id } }: ISkill) {
    delete this.unitEntity.skills[id];

    this.skills[id].onLearn(this);
    this.fire('forgetSkill', { skill: this.skills[id] })

    this._reinitSkills();

    return this;
  }
  castSkill(skillID: SkillID, target: IUnit) {
    if (!this.skills[skillID]) {
      return this;
    }

    this.skills[skillID].cast(this, target);
    this.fire('castSkill', { target, skill: this.skills[skillID] })
    target.fire('beSkillTarget', { source: this, skill: this.skills[skillID] })


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

    for (let i = 0; i < count; i++) {
      items[itemID].push(Items.getData(itemID) as ItemData);
    }
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

    for (let i = 0; i < count; i++) {
      items[itemID].pop();
    }
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
          }));

          return true;
        }
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
          }));

          return true;
        }
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

  on(event: UnitEventType, listener: DataProcessCallback<UnitEventData>): VoidCallback {
    return this._subscriber.subscribe(this._publisher, event, listener);
  }

  fire(event: UnitEventType, data: UnitEventData): UnitEventData {
    return this._publisher.publish(event, data);
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

  get phyAtk() {
    const { strength, phyAtk } = this.status;
    return strength + phyAtk;
  }
  get phyDef() {
    const { phy, phyDef } = this.status;
    return phy + phyDef;
  }
  get powAtk() {
    return this.unitEntity.powAtk;
  }
  get powDef() {
    return this.unitEntity.powDef;
  }
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