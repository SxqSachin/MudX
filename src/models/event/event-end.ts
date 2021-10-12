import { GameEvent, GameEventNextType } from "../../types/game-event";

export function endEvent(): GameEvent {
  return {
    id: "__EVENT_END",
    name: "事件结束",

    forks: {
      description: "刚才的事件告一段落，接下来你想去哪儿？",

      options: [
        {
          name: "继续探索",
          next: GameEventNextType.PUSH_STORY,
        },
      ],
    }
  }

}