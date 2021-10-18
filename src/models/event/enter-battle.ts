import { GameEvent, GameEventNextType } from "../../types/game-event";

export function enterBattleEvent(enemyID: string): GameEvent {
  return {
    id: GameEventNextType.ENTER_BATTLE,
    name: "进入战斗",

    forks: {
      description: "刚才的事件告一段落，接下来你想去哪儿？",

      options: [
        {
          name: "进入战斗",
          next: GameEventNextType.ENTER_BATTLE,
          enemyID,
        },
      ],
    }
  }

}