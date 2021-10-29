import { GameEvents } from "@data";
import { GameMap, GameMapType, Story as StoryType, StoryEvent } from "../types/game-event";
import { uuid } from "./uuid";

export const StoryUtils = {
  createStory: ({ title, description, map, pageNum }: { title: string, description: string, pageNum: number, map?: GameMap }): StoryType => {
    if (!map) {
      map = GameMapType.ANY
    }
    return {
      id: uuid(),
      totalPage: pageNum,
      curPage: 1,
      title,
      description,
      map,
      pages: (() => {
        const res: StoryEvent[] = [];

        for (let i = 0; res.length < pageNum; i++) {
          const event = GameEvents.getRandom();

          // if (res.findIndex(se => se.event.id === event.id) > 0) {
          //   i--;
          //   continue;
          // }
          if (event.ext?.test) {
            i--;
            continue;
          }

          res.push({
            page: i,
            event: event.id,
          })
        }

        return res;
      })(),
    }
  }

};