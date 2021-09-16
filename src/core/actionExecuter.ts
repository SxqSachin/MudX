import { useEffect } from "react";
import { ItemMap, SkillMap } from "../data";
import { Skill } from "../models/Skill";
import { Unit } from "../models/Unit";
import { Action } from "../types/action";
import { IUnit } from "../types/Unit";

export function actionExecuter(
  action: Action,
  self: IUnit,
  target: IUnit
): void {
  let actionTarget;

  switch (action.target) {
    case "self":
      actionTarget = self;
      break;
    case "target":
      actionTarget = target;
      break;
  }

  if (!actionTarget) {
    return;
  }

  const unitEffectActionMap = {
    'item': {
      '+': actionTarget.addItem,
      '-': actionTarget.addItem,
    },
    'skill': {
      '+': actionTarget.learnSkill,
      '-': actionTarget.forgetSkill,
    },
    'status': {
      '+': actionTarget.increaseStatus,
      '-': actionTarget.decreaseStatus,
    }
  }
  const effectValDirection = action.val > 0 ? '+' : '-';

  switch(action.effectTo) {
    case 'item':
      const item = ItemMap.get(action.itemID);
      if (!item) {
        break;
      }
      unitEffectActionMap.item[effectValDirection](item, action.val);
      break;
    case 'skill':
      const skill = SkillMap.get(action.skillID);
      if (!skill) {
        break;
      }
      unitEffectActionMap.skill[effectValDirection](skill);
      break;
    default:
      unitEffectActionMap.status[effectValDirection](action.effectTo, action.val);
      break;
  }
}
