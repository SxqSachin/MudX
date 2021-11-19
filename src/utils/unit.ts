import { Message } from "@/core/message";
import { DamageInfo, DamageType, IUnit } from "@/types/Unit";

export const DefaultDamageInfo: DamageInfo = Object.freeze<DamageInfo>({
  damage: 0,
  damageType: DamageType.PURE,
  actionName: "",
  actionType: "ATTACK",
  damageDescription: "",

  noMessage: false,

  triggerDealDamageEvent: true,
  triggerTakeDamageEvent: true,
});

export const baseAttackDamageInfo: (damage: number) => DamageInfo = damage => {
  const res: DamageInfo = {
    damage,
    actionType: "ATTACK",
    actionName: "攻击",
    damageType: DamageType.PHYSICAL,
  }

  return res;
}

export const calcActualDamage: (target: IUnit, damageInfo: DamageInfo) => DamageInfo = (
  target,
  damageInfo
) => {
  let { damage, damageType } = damageInfo;

  let def: number = 0;

  switch (damageType) {
    case DamageType.MAGICAL:
      def = target.powDef;
      break;
    case DamageType.PHYSICAL:
      def = target.phyDef;
      break;
    case DamageType.PURE:
      def = 0;
      break;
  }

  let resDamage = Math.max(0, damage - def);

  damageInfo.damage = resDamage;
  // console.log(damage, def, resDamage);

  return damageInfo;
};

export const parseDamageInfoToString = (source: IUnit, target: IUnit, damageInfo: DamageInfo, actualDamage: number): string => {
  const sourceName = source.data.name;
  const targetName = target.data.name;

  let prefixStr = '';
  let damageActionStr = '';

  let { damageDescription, actionType, isDamageFromPassive } = damageInfo;

  if (actionType === 'ATTACK') {
    prefixStr = `${sourceName} 攻击了 ${targetName}，`;
    damageActionStr = damageDescription || `造成 ${actualDamage} 点伤害。`;
  } else if (actionType === 'CAST_SKILL') {
    prefixStr = `${sourceName} ${isDamageFromPassive ? '发动效果' : '使用了'} “${damageInfo.actionName}”，`;
    damageActionStr = damageDescription || `对 ${targetName} 造成 ${actualDamage} 点伤害。`;
  }

  return prefixStr + damageActionStr;
}

export const makeDamageChangeString = (from: number, to: number): string => {
  return `（${from} => ${to}）`;
}

export const sendDamageMsg = (source: IUnit, target: IUnit, damageInfo: DamageInfo, actualDamage: number) => {
  if (damageInfo.noMessage) {
    return;
  }
  Message.push(parseDamageInfoToString(source, target, damageInfo, actualDamage));
}
