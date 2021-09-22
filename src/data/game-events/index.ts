import scriptList from "./script";
import { GameEvent, GameEventID } from "../../types/game-event";
import { deepClone } from "../../utils";

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
};

export { GameEvents };
