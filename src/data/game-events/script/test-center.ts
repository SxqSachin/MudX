import { GameEvent } from "../../../types/game-event";
import { getRandomString } from "../../../utils/random";

const event: GameEvent = Object.freeze({
  id: "test-center",
  name: "调试中心",

  forks: {
    description: () => `这里是调试中心。(编号-${getRandomString()})}`,
    onEnter: [],
    onLeave: [],

    options: [
      {
        id: '1',
        name: "选项1",
        next: () => {
          return "test-center";
        },
      },
      {
        id: '2',
        name: "选项2",
        next: () => {
          return "test-center";
        },
      },
    ],
  },
});
export default event;