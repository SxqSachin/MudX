import { GameEvent, GameEventNextType } from "@/types/game-event";

export function leaveShopEvent(): GameEvent {
  return {
    id: GameEventNextType.EXIT_TRADE,
    name: "离开商店",

    forks: {
      description: "你离开了商店。",

      options: [
        {
          name: "继续探索",
          next: GameEventNextType.PUSH_STORY,
        },
      ],
    }
  }

}