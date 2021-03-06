import { ElementType } from "react";
import { Message } from "../core/message";
import { Publisher, Subscriber } from "../core/subscribe";
import { Items } from "@data/items";
import { AsyncDataProcessCallback, DataProcessCallback, VAG, VoidCallback } from "../types";
import { IItem, ItemData, ItemID } from "../types/Item";
import { XID } from "../types/Object";
import { ISkill, SkillID } from "../types/Skill";
import { DamageInfo, DamageType, IUnit, UnitAttackedEventData, UnitAttackEventData, UnitDamageEventData, UnitData, UnitEventData, UnitEventType, UnitItemEventData, UnitSelf, UnitSimpleEventData, UnitSkillEventData, UnitStatus, UnitStatusType, } from "../types/Unit";
import { deepClone, toArray } from "../utils";
import { uuid } from "../utils/uuid";
import { Item } from "./Item";
import { Skill } from "./Skill";
import { State, StateData, StateID } from "@/types/state";
import { States } from "@data/states";
import { actionExecuter, executeSelfAction } from "@/core/actionExecuter";
import { baseAttackDamageInfo, calcActualDamage, DefaultDamageInfo, sendDamageMsg } from "@/utils/unit";

export class Unit implements IUnit {
  private unitEntity!: UnitData;
  private _items!: { [id in ItemID]: Item[] };
  private _skills!: { [id in SkillID]: Skill };
  private _states!: { [id in StateID]: State[] };

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
    this._reinitState();
  }

  async attack(target: IUnit) {
    Message.push(`${this.data.name} 准备对 ${target.data.name} 发起攻击 `);

    let damageInfo = baseAttackDamageInfo(this.phyAtk);
    let damageVal = damageInfo.damage;

    let eventResult = await this.fire("beforeAttack", { source: this, target, damage: damageVal });
    damageVal = eventResult.damage ?? damageVal;
    eventResult = await target.fire("beforeAttacked", { source: this, target, damage: damageVal });
    damageVal = eventResult.damage ?? damageVal;

    damageVal = await this.dealDamage(target, damageInfo);

    await this.fire("afterAttack", { source: this, target, damage: damageVal });
    await target.fire("afterAttacked", { source: this, target, damage: damageVal });
  }

  async dealDamage(
    target: IUnit,
    info: DamageInfo = {} as DamageInfo,
  ) {
    info = { ...DefaultDamageInfo, ...info, };

    info = calcActualDamage(target, info)

    let damage = info.damage;

    if (info?.triggerDealDamageEvent) {
      const eventResult = await this.fire("dealDamage", { source: this, target, damage });
      damage = eventResult.damage ?? damage;
    }
    if (info?.triggerTakeDamageEvent) {
      const eventResult = await target.fire("takeDamage", { source: this, target, damage });
      damage = eventResult.damage ?? damage;
    }

    sendDamageMsg(this, target, info, damage);

    target.decreaseStatus("curHP", Math.max(damage, 0));

    return damage;
  }

  async *learnSkill(skill: ISkill) {
    const skillData = skill.data;
    const { id } = skillData;

    if (!!this.unitEntity.skills[id]) {
      return;
    }

    this.unitEntity.skills[id] = skillData;

    this._reinitSkills();

    Message.push(`${this.data.name} 习得技能 “${skill.data.name}” `);
    for await (const result of this.skills[id].onLearn(this)) {
      yield;
    }

    this.fire("learnSkill", {
      source: this,
      target: this,
      skill: this.skills[id],
    });
  }
  async *forgetSkill(skill: ISkill) {
    const {
      data: { id },
    } = skill;
    delete this.unitEntity.skills[id];

    Message.push(`${this.data.name} 遗忘了技能 “${skill.data.name}” `);

    for await (const result of this.skills[id].onForget(this)) {
      yield;
    }
    this.fire("forgetSkill", {
      source: this,
      target: this,
      skill: this.skills[id],
    });

    this._reinitSkills();
  }
  async *castSkill(skillID: SkillID, target: IUnit) {
    if (!this.skills[skillID]) {
      return;
    }

    Message.push(
      `${this.data.name} 释放技能 “${this.skills[skillID].data.name}” `
    );

    const generator = await this.skills[skillID].cast(this, target);
    for await (const result of generator) {
      yield;
    }

    await this.fire("castSkill", {
      source: this,
      target,
      skill: this.skills[skillID],
    });
    await target.fire("beSkillTarget", {
      source: this,
      target,
      skill: this.skills[skillID],
    });
  }

  // addItem与addItemByID是两种状态，不能合并，id一定是新物品;item可能是新物品也可能是旧物品
  addItem(item: IItem): UnitSelf {
    const itemData = item.data;
    const { id: itemID } = itemData;

    const items = this.unitEntity.items;
    if (!items[itemID]) {
      items[itemID] = [];
    }

    const isItemExist = Object.values(items).some((itemList) =>
      itemList.some((curItem) => curItem.xid === item.data.xid)
    );
    if (!isItemExist) {
      items[itemID].push(itemData);
      this._reinitItems();
    }

    Message.push(`${this.data.name} 获得物品 “${item.data.name}” `);

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

    Message.push(`${this.data.name} 失去物品 “${item.data.name}” `);

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
    items[itemID].splice(0, 0, ...newItem);

    this._reinitItems();

    Message.push(
      `${this.data.name} 获得物品 “${Items.getData(itemID).name}”*${count} `
    );

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

    Message.push(
      `${this.data.name} 失去物品 “${Items.getData(itemID).name}”*${count} `
    );

    return this;
  }
  useItem(item: Item) {
    this._reinitItems();

    return this;
  }

  equip(xid: XID) {
    Object.keys(this.unitEntity.items).some((itemID) => {
      const itemDataList = this.unitEntity.items[itemID];
      return itemDataList.some((_, index) => {
        const itemData = this.unitEntity.items[itemID][index];
        if (itemData.xid === xid && itemData.isEquipable === true) {
          itemData.isEquipped = true;

          Object.values(this.items).some((itemList) =>
            itemList.some((curItem) => {
              if (xid === curItem.data.xid) {
                Message.push(
                  `${this.data.name} 装备了 “${curItem.data.name}” `
                );
                curItem.onEquip(this);
                return true;
              }

              return false;
            })
          );

          return true;
        }

        return false;
      });
    });
    this._reinitItems();

    return this;
  }
  unequip(xid: XID) {
    Object.keys(this.unitEntity.items).some((itemID) => {
      const itemDataList = this.unitEntity.items[itemID];
      return itemDataList.some((_, index) => {
        const itemData = this.unitEntity.items[itemID][index];
        if (itemData.xid === xid && itemData.isEquipable === true) {
          itemData.isEquipped = false;

          Object.values(this.items).some((itemList) =>
            itemList.some((curItem) => {
              if (xid === curItem.data.xid) {
                Message.push(
                  `${this.data.name} 卸下了 “${curItem.data.name}” `
                );
                curItem.onUnequip(this);
                return true;
              }

              return false;
            })
          );

          return true;
        }

        return false;
      });
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
    return Object.values(this.items).flatMap((itemList) => {
      return itemList.filter(
        (item) => item.data.isEquipable && item.data.isEquipped
      );
    });
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

  async *createAddStateAction(state: State): VAG {
    if (!this.unitEntity.states[state.id]) {
      this.unitEntity.states[state.id] = [];
    }

    if (this.unitEntity.states[state.id].length && !state.stackable) {
      return;
    }

    if (!state) {
      return;
    }

    const stateData: StateData = {
      xid: uuid(),
      id: state.id,
      remainTime: state.remainTime,
    };
    this.unitEntity.states[state.id].push(stateData);

    this._reinitState();

    Message.push(`${this.data.name} 获得状态 “${state.name}” `);
    for await (const action of toArray(state.actions)) {
      yield* await actionExecuter(action, this, this);
    }
  }
  async *createRemoveStateAction(state: State) {
    if (!this.unitEntity.states[state.id].length) {
      return this;
    }

    this.unitEntity.states[state.id].pop();
    this._reinitState();

    Message.push(`${this.data.name} 失去状态“${state.name}” `);
  }
  async *createAddStateByIDAction(stateID: StateID) {
    yield* await this.createAddStateAction(States.get(stateID));
  }
  async *createRemoveStateByIDAction(stateID: StateID) {
    yield* await this.createRemoveStateAction(States.get(stateID));
  }

  async addState(state: State) { for await (const iterator of this.createAddStateAction(state)) { } }
  async addStateByID(stateID: StateID) { for await (const iterator of this.createAddStateByIDAction(stateID)) { } }
  async removeState(state: State) { for await (const iterator of this.createRemoveStateAction(state)) { } }
  async removeStateByID(stateID: StateID) { for await (const iterator of this.createRemoveStateByIDAction(stateID)) { } }

  on(
    event: "beforeAttack" | "afterAttack",
    listener: AsyncDataProcessCallback<UnitAttackEventData>
  ): VoidCallback;
  on(
    event: "beforeAttacked" | "afterAttacked",
    listener: AsyncDataProcessCallback<UnitAttackedEventData>
  ): VoidCallback;
  on(
    event: "dealDamage" | "takeDamage",
    listener: AsyncDataProcessCallback<UnitDamageEventData>
  ): VoidCallback;
  on(
    event: "addItem" | "removeItem" | "equipItem" | "unequipItem",
    listener: AsyncDataProcessCallback<UnitItemEventData>
  ): VoidCallback;
  on(
    event: "learnSkill" | "forgetSkill" | "castSkill" | "beSkillTarget",
    listener: AsyncDataProcessCallback<UnitSkillEventData>
  ): VoidCallback;
  on(
    event: "roundStart" | "roundEnd" | "aiRoundStart",
    listener: AsyncDataProcessCallback<UnitSimpleEventData>
  ): VoidCallback;
  on(
    event: UnitEventType,
    listener: AsyncDataProcessCallback<UnitEventData>
  ): VoidCallback {
    return this._subscriber.subscribe(this._publisher, event, listener);
  }

  async fire(
    event: "beforeAttack" | "afterAttack",
    data: UnitAttackEventData
  ): Promise<UnitAttackEventData>;
  async fire(
    event: "beforeAttacked" | "afterAttacked",
    data: UnitAttackedEventData
  ): Promise<UnitAttackedEventData>;
  async fire(
    event: "dealDamage" | "takeDamage",
    data: UnitDamageEventData
  ): Promise<UnitAttackedEventData>;
  async fire(
    event: "addItem" | "removeItem" | "equipItem" | "unequipItem",
    data: UnitItemEventData
  ): Promise<UnitItemEventData>;
  async fire(
    event: "learnSkill" | "forgetSkill" | "castSkill" | "beSkillTarget",
    data: UnitSkillEventData
  ): Promise<UnitSkillEventData>;
  async fire(
    event: "roundStart" | "roundEnd" | "aiRoundStart",
    data: UnitSimpleEventData
  ): Promise<UnitSimpleEventData>;
  async fire(
    event: UnitEventType,
    data: UnitEventData
  ): Promise<UnitEventData> {
    return await this._publisher.publish(event, data);
  }

  private _reinitItems() {
    console.time("_reinitItems: " + this.name);
    this._items = {};
    Object.keys(this.unitEntity.items).forEach((itemID: ItemID) => {
      this._items[itemID] = [];
      this.unitEntity.items[itemID].forEach((itemData) => {
        this._items[itemID].push(new Item(itemData));
      });
    });
    console.timeEnd("_reinitItems: " + this.name);
  }
  private _reinitSkills() {
    this._skills = {};
    Object.keys(this.unitEntity.skills).forEach((skillID: SkillID) => {
      const skillData = this.unitEntity.skills[skillID];
      this._skills[skillID] = new Skill(skillData);
    });
  }
  private _reinitState() {
    this._states = {};
    if (!this.unitEntity.skills) {
      this.unitEntity.skills = {};
    }
    Object.keys(this.unitEntity.states).forEach((id: StateID) => {
      this._states[id] = [];
      this.unitEntity.states[id].forEach((data) => {
        this._states[id].push(States.get(data.id));
      });
    });
  }

  get xid() {
    return this.unitEntity.xid;
  }
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
  get data() {
    return this.unitEntity;
  }
  get items() {
    return this._items;
  }
  get skills() {
    return this._skills;
  }
  get states() {
    return this._states;
  }

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
    };

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
    };
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