import scriptList from './script';
import { deepClone, toArray } from '../../utils';
import { ItemData, ItemID } from '../../types/Item';
import { EMPTY_XID } from '../../types/Object';
import { GameEvent, GameEventID } from '../../types/game-event';

const EventMap: Map<string, GameEvent> = new Map();

scriptList.forEach(scriptObj => {
  EventMap.set(scriptObj.id, scriptObj);
});

const DEFAULT_GAME_EVENT: GameEvent = {
  id: '__DEFAULT__',
  name: '__DEFAULT__',
  description: '',
  next: () => DEFAULT_GAME_EVENT,
  onEnter: [],
  onLeave: [],
};

const GameEvents = {
  get: (id: GameEventID): GameEvent => {
    return EventMap.get(id) ?? DEFAULT_GAME_EVENT;
  },
}

export {
  GameEvents
};