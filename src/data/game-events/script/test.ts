import { GameEvent } from "../../../types/game-event";

export const testGameEvent: GameEvent = {
  id: 'test-game-event',
  name: '测试事件',
  description: '这是一个测试事件',
  onEnter: [],
  onLeave: [],

  next: () => {
    return testGameEvent;
  },
}