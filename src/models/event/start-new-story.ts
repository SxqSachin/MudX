import { GameEvent, GameEventNextType } from "@/types/game-event";

export function startNewStoryEvent(): GameEvent {
  return {
    id: GameEventNextType.START_NEW_STORY,
    name: "新的旅程",

    forks: {
      description: "你想去哪里探索?",

      options: [
        {
          name: "草原",
          next: GameEventNextType.START_NEW_STORY,
        },
      ],
    }
  }
}