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
  get: (id: GameEventID | GameEvent): GameEvent => {
    if (typeof id === 'string') {
      return deepClone(EventMap.get(id) ?? DEFAULT_GAME_EVENT);
    }

    return id;
  },

  getRandom: (): GameEvent => {
    let keys = Array.from(EventMap.keys());
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    return deepClone(EventMap.get(randomKey) ?? DEFAULT_GAME_EVENT);
  },


};

export { GameEvents };
