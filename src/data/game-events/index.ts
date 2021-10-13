import scriptList from "./script";
import { GameEvent, GameEventID, Story, StoryEvent } from "../../types/game-event";
import { deepClone } from "../../utils";
import { storyEndEvent } from "../../models/event/story-end";

const EventMap: Map<string, GameEvent> = new Map();

scriptList.forEach((scriptObj) => {
  EventMap.set(scriptObj.id, Object.freeze(scriptObj));
});

const DEFAULT_GAME_EVENT: GameEvent = {
  id: "__DEFAULT__",
  name: "__DEFAULT__",
  forks: {
    description: "",
    onEnter: [],
    onLeave: [],
    options: {
      id: "__DEFAULT__",
      name: "__DEFAULT_NAME__",
      next: () => DEFAULT_GAME_EVENT,
    },
  },
};

const GameEvents = {
  get: (id: GameEventID): GameEvent => {
    return deepClone(EventMap.get(id) ?? DEFAULT_GAME_EVENT);
  },

  getRandom: (): GameEvent => {
    let keys = Array.from(EventMap.keys());
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    return deepClone(EventMap.get(randomKey) ?? DEFAULT_GAME_EVENT);
  },

  createStory: (title: string, description: string, length: number): Story => {
    return {
      totalPage: length,
      curPage: 1,
      title,
      description,
      pages: (() => {
        const res: StoryEvent[] = [];

        for (let i = 0; res.length < length; i++) {
          const event = GameEvents.getRandom();

          // if (res.findIndex(se => se.event.id === event.id) > 0) {
          //   i--;
          //   continue;
          // }

          if (event.ext?.test) {
            i--;
            continue;
          }

          res.push({
            page: i,
            event: event.id,
          })
        }

        return res;
      })(),
    }
  }
};

export { GameEvents };
