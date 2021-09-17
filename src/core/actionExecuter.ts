import { useEffect } from "react";
import { Items, SkillMap } from "../data";
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
      '+': actionTarget.addItemByID,
      '-': actionTarget.removeItemByID,
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
      unitEffectActionMap.item[effectValDirection](action.itemID, action.val);
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
