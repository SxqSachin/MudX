import { GameEvents } from "../data";
import { endEvent } from "../models/event/event-end";
import { storyEndEvent } from "../models/event/story-end";
import { GameEnvironment } from "../types/game";
import { GameEvent, GameEventNextType, GameEventOption, Story } from "../types/game-event";

function getStoryNextEvent(story: Story): GameEvent {
  let { curPage } = story;

  return story.pages[curPage + 1].event;
}

export const doPushStory = (gameEnvironment: GameEnvironment) => {
  let { curPage } = gameEnvironment.story;

  curPage += 1;
  gameEnvironment.story.curPage = curPage;
  gameEnvironment.event = gameEnvironment.story.pages[curPage].event;

  return gameEnvironment;
};
const doEndEvent = (gameEnvironment: GameEnvironment) => {
  gameEnvironment.event = endEvent();

  return gameEnvironment;
};

export function isOptionWillPushStory(option: GameEventOption, gameEnvironment: GameEnvironment): boolean {
  if (typeof option.next === "string") {
    switch (option.next) {
      case GameEventNextType.PUSH_STORY:
        return true;
      default:
        break;
    }
  } else {
    const res = option.next(gameEnvironment);

    if (typeof res === "string") {
      switch (res) {
        case GameEventNextType.PUSH_STORY:
          return true;
        default:
          break;
      }
    }
  }

  return false;
}

export function calcOptionNextEvent(option: GameEventOption, gameEnvironment: GameEnvironment): GameEvent {
  let nextEvent: GameEvent;
  if (typeof option.next === "string") {
    switch (option.next) {
      case GameEventNextType.PUSH_STORY:
        nextEvent = getStoryNextEvent(gameEnvironment.story)
        break;
      case GameEventNextType.GAME_EVENT_END:
        nextEvent = endEvent();
        break;
      case GameEventNextType.START_NEW_STORY:
        nextEvent = storyEndEvent();
        break;
      default:
        nextEvent = GameEvents.get(option.next);
        break;
    }
  } else {
    const res = option.next(gameEnvironment);

    if (typeof res === "string") {
      switch (res) {
        case GameEventNextType.PUSH_STORY:
          nextEvent = getStoryNextEvent(gameEnvironment.story);
          break;
        case GameEventNextType.GAME_EVENT_END:
          nextEvent = endEvent();
          break;
        case GameEventNextType.START_NEW_STORY:
          nextEvent = storyEndEvent();
          break;
        default:
          nextEvent = GameEvents.get(res);
          break;
      }
    } else {
      nextEvent = res;
    }
  }

  return nextEvent;
}
