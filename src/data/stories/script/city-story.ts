import { GameEvents } from "../..";
import { StoryEvent, StoryGenerator } from "../../../types/game-event";

const generator: StoryGenerator = {
  id: "city-story",
  generator: (env) => {
    return {
      id: "city-story",
      totalPage: 10,
      curPage: 1,
      title: "城市",
      description: "在城市中漫步",
      map: "CITY",
      pages: (() => {
        const res: StoryEvent[] = [];

        for (let i = 0; res.length < 10; i++) {
          const event = GameEvents.getRandom();

          if (event.ext?.test) {
            i--;
            continue;
          }

          res.push({
            page: i,
            event: event.id,
          });
        }

        return res;
      })(),
    };
  },
};

export default generator;
