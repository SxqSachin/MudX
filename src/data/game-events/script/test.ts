import { GameEvent } from "../../../types/game-event";
import { getRandomString } from "../../../utils/random";

export const testGameEvent: GameEvent = Object.freeze({
  id: "test-game-event",
  name: "测试事件",

  forks: {
    description: () => "这是一个测试事件" + getRandomString(),
    onEnter: [],
    onLeave: [],

    options: [
      {
        id: "okk",
        name: "okk",
        next: () => {
          return "test-game-event";
        },
      },
      {
        id: "okk2",
        name: "okk2",
        next: () => {
          return "test-game-event";
        },
      },
    ],
  },
});
