import { addPlayerHPOption, } from "../../models/game-event-option";
import { GameEvent, GameEventNextType } from "../../types/game-event";
import { uuid } from "../../utils/uuid";

export function createBattleEndEvent({ title, description, optionTitle}: { title: string, description: string, optionTitle: string }): GameEvent {
  return {
    id: uuid(),
    name: title,

    forks: {
      description: description,

      options: [
        {
          name: optionTitle,
          next: GameEventNextType.PUSH_STORY,
        },
      ],
    }
  }
}