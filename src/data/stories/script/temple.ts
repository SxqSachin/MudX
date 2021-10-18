import { GameEvents } from "../..";
import {
  GameEventNextType,
  Story,
  StoryEvent,
  StoryGenerator,
} from "../../../types/game-event";

const generator: StoryGenerator = {
  id: "temple",
  generator: (env) => {
    return {
      id: "temple",
      totalPage: 2,
      curPage: 1,
      title: "神庙",
      description: "",
      map: "TEMPLE",
      pages: [
        {
          page: 1,
          event: {
            id: "temple_1",
            name: "神庙入口",
            forks: {
              description: "你站在神庙的入口处",
              options: [
                {
                  name: "跪拜",
                  enemyID: "神庙守护者",
                  next: GameEventNextType.ENTER_BATTLE,
                },
                {
                  name: "离开",
                  next: GameEventNextType.GAME_EVENT_END,
                },
              ],
            },
          },
        },
        {
          page: 2,
          event: {
            id: "temple_2",
            name: "神庙中心",
            forks: {
              description: "你站在神庙的入口处",
              options: [
                {
                  name: "跪拜",
                  next: GameEventNextType.GAME_EVENT_END,
                },
                {
                  name: "离开",
                  next: GameEventNextType.GAME_EVENT_END,
                },
              ],
            },
          },
        },
      ],
    };
  },
};

export default generator;
