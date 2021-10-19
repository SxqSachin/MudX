import { GameEvents } from "@data";
import { endEvent } from "../models/event/event-end";
import { storyEndEvent } from "../models/event/story-end";
import { GameEnvironment } from "../types/game";
import { GameEvent, GameEventNextType, GameEventOption, Story } from "../types/game-event";

export function getOptionNextType(option: GameEventOption, gameEnvironment: GameEnvironment): string {
  if (typeof option.next === "string") {
    return option.next;
  } else {
    const res = option.next(gameEnvironment);

    if (typeof res === "string") {
      return res;
    }

    return res.id;
  }
}

export function isOptionWillEndStory(option: GameEventOption, gameEnvironment: GameEnvironment): boolean {
  const nextType = getOptionNextType(option, gameEnvironment);
  if (nextType === GameEventNextType.STORY_END) {
    return true;
  }

  if (nextType === GameEventNextType.PUSH_STORY && gameEnvironment.story.curPage >= gameEnvironment.story.totalPage) {
    return true;
  }

  return false;
}

export function isOptionWillPushStory(option: GameEventOption, gameEnvironment: GameEnvironment): boolean {
  return getOptionNextType(option, gameEnvironment) === GameEventNextType.PUSH_STORY;
}

export function calcOptionNextEvent(option: GameEventOption, gameEnvironment: GameEnvironment): GameEvent {
  let nextEvent: GameEvent;
  if (typeof option.next === "string") {
    nextEvent = GameEvents.get(option.next);
  } else {
    const res = option.next(gameEnvironment);

    if (typeof res === "string") {
      nextEvent = GameEvents.get(res);
    } else {
      nextEvent = res;
    }
  }

  return nextEvent;
}
