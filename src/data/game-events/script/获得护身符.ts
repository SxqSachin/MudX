import { GameEvent, GameEventNextType } from "../../../types/game-event";
import { Dice, getRandomString } from "../../../utils/random";

const e: GameEvent = {
  id: "__game-event-1",
  name: "获得物品",

  forks: [
    {
      description: "你得到了一个金币",
      condition: env => Dice.d6 > 3,
      onEnter: (gameEnv) => {
        gameEnv.player.addItemByID("gold-icon", 1);

        return gameEnv;
      },
      options: [
        {
          name: "好的",
          next: GameEventNextType.GAME_EVENT_END,
        },
      ],
    },
    {
      description: "你得到了一个护身符",
      onEnter: (gameEnv) => {
        gameEnv.player.addItemByID("base_amulet", 1);

        return gameEnv;
      },
      options: [
        {
          name: "好的",
          next: GameEventNextType.GAME_EVENT_END,
        },
      ],
    },
  ],
};

const event = Object.freeze(e);
export { event };
