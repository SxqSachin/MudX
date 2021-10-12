import { addPlayerHPOption, removePlayerHPOption } from "../../../models/game-event-option";
import { GameEvent } from "../../../types/game-event";
import { getRandomString } from "../../../utils/random";

const event: GameEvent = Object.freeze({
  id: "test-center",
  name: "调试中心",

  ext: {
    test: true,
  },

  forks: {
    description: () => `这里是调试中心。(编号-${getRandomString()})`,

    options: [
      {
        id: '1',
        name: "选项1",
        onChoose: removePlayerHPOption(1),
        next: () => {
          return "test-center";
        },
      },
      {
        id: '2',
        name: "选项2",
        onChoose: addPlayerHPOption(1),
        next: () => {
          return "test-center";
        },
      },
    ],
  },
});

//   => (env) => {
//   env.player.increaseStatus('curHP', val);
// }

export default event;