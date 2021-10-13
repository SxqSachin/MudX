import { GameEvent, GameEventNextType } from "../../types/game-event";

export function storyEndEvent(): GameEvent {
  return {
    id: GameEventNextType.STORY_END,
    name: "故事结束",

    forks: {
      description: "你结束了一段非比寻常的路途。",

      options: [
        {
          name: "开始新的旅程",
          next: GameEventNextType.START_NEW_STORY,
        },
      ],
    }
  }

}