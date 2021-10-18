import { addPlayerHPOption, } from "../../models/game-event-option";
import { GameEvent, GameEventNextType } from "../../types/game-event";
import { ItemID } from "../../types/Item";
import { uuid } from "../../utils/uuid";

type BattleEndEventParam = { title?: string, description?: string, optionTitle?: string, spoils?: (() => ItemID | ItemID[]) | ItemID | ItemID[] };
export function battleEndEvent({ title, description, optionTitle, spoils }: BattleEndEventParam = {}): GameEvent {
  !title && (title = '战斗结束');
  !description && (description = '你战胜了对手');
  !optionTitle && (optionTitle = '继续');
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