import { GameEvent } from "../../../types/game-event";
import { getRandomString } from "../../../utils/random";

const event: GameEvent = Object.freeze({
  id: "test-center",
  name: "调试中心",

  forks: {
    description: () => `这里是调试中心。(编号-${getRandomString()})`,

    options: [
      {
        id: '1',
        name: "选项1",
        onChoose: env => {
          console.log('before choose', env.player.status.curHP);
          if (env.player) {
            env.player.dealDamage(env.player, 1);
          }
          console.log('after choose', env.player.status.curHP);

          return env;
        },
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