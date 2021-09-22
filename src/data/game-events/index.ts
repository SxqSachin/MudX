import scriptList from './script';
import { GameEvent, GameEventID } from '../../types/game-event';

const EventMap: Map<string, GameEvent> = new Map();

scriptList.forEach(scriptObj => {
  EventMap.set(scriptObj.id, scriptObj);
});

const DEFAULT_GAME_EVENT: GameEvent = {
  id: '__DEFAULT__',
  name: '__DEFAULT__',
  description: '',
  onEnter: [],
  onLeave: [],
  options: {
    id: '__DEFAULT__',
    name: '__DEFAULT_NAME__',
    next: () => DEFAULT_GAME_EVENT,
  }
};

const GameEvents = {
  get: (id: GameEventID): GameEvent => {
    return EventMap.get(id) ?? DEFAULT_GAME_EVENT;
  },
}

export {
  GameEvents
};