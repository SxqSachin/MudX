import { simpleTextEvent } from "../../../models/event/simple-event";
import { GameEvent, GameEventNextType } from "../../../types/game-event";
import { getRandomString } from "../../../utils/random";

const _e2: GameEvent = {
  id: "许愿井_2",
  name: "许愿井",

  forks: {
    description: "你向其中投入了一个金币，许下了一个愿望。",
    options: [
      {
        name: "心诚则灵",
        next: GameEventNextType.GAME_EVENT_END,
      },
    ],
  },
}

const e: GameEvent = {
  id: "许愿井",
  name: "许愿井",

  forks: {
    description: "你面前有一口许愿井。",
    options: [
      {
        name: "许愿（1金币）",
        condition: env => {
          return !!env.player.items['gold-icon']?.length;
        },
        next: env => _e2,
      },
      {
        name: "无视",
        next: env => simpleTextEvent("许愿井", "你无视了这口许愿井。", "继续探索"),
      },
    ],
  },
};

const event = Object.freeze(e);
export { event };