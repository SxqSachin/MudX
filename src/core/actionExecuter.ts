import { agNoop, } from "@/utils";
import { Skills } from "@data";
import { Action, SelfAction } from "../types/action";
import { IUnit } from "../types/Unit";

export async function actionExecuter(
  action: Action,
  self: IUnit,
  target: IUnit
): Promise<AsyncGenerator> {
  let actionTarget;

  if (typeof action === 'function') {
    return action(self, target);
  }

  switch (action.target) {
    case "self":
      actionTarget = self;
      break;
    case "target":
      actionTarget = target;
      break;
  }

  if (!actionTarget) {
    return agNoop;
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
      const skill = Skills.get(action.skillID);
      if (!skill) {
        break;
      }
      unitEffectActionMap.skill[effectValDirection](skill);
      break;
    default:
      unitEffectActionMap.status[effectValDirection](action.effectTo, action.val);
      break;
  }

  return agNoop;
}


export async function executeSelfAction(action: SelfAction, self: IUnit): Promise<AsyncGenerator> {
  if (typeof action === 'function') {
    return await action(self);
  }

  let actionTarget = self;

  if (!actionTarget) {
    return agNoop;
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
  let effectValDirection: '+' | '-' = action.val > 0 ? '+' : '-';

  switch(action.effectTo) {
    case 'item':
      unitEffectActionMap.item[effectValDirection](action.itemID, action.val);
      break;
    case 'skill':
      const skill = Skills.get(action.skillID);
      if (!skill) {
        break;
      }
      unitEffectActionMap.skill[effectValDirection](skill);
      break;
    default:
      effectValDirection = '+';
      unitEffectActionMap.status[effectValDirection].call(actionTarget, action.effectTo, action.val);
      break;
  }

  return agNoop;
}