import { Items } from "@data";
import { addPlayerHPOption, } from "@/models/game-event-option";
import { GameEnvironment } from "@/types/game";
import { GameEvent, GameEventNextType } from "@/types/game-event";
import { IItem, ItemID } from "@/types/Item";
import { IEnemy } from "@/types/enemy";
import { toArray } from "@/utils";
import { uuid } from "@/utils/uuid";

type BattleEndEventParam = { title?: string, description?: string, optionTitle?: string, enemy?: IEnemy };
export function battleEndEvent({ title, description, optionTitle, enemy}: BattleEndEventParam = {}, env: GameEnvironment): GameEvent {
  !title && (title = '战斗结束');
  !description && (description = '你战胜了对手');
  !optionTitle && (optionTitle = '继续');

  let spoils: IItem[] = [];
  if (enemy?.data.spoils !== undefined) {
    toArray(enemy?.data.spoils).forEach(spoil => {
      if (typeof spoil === 'string') {
        spoils.push(Items.get(spoil));
      } else if (typeof spoil === 'function') {
        const items = toArray(spoil(env)).map(id => Items.get(id));
        spoils.push(...items);
      }
    });
  }

  return {
    id: uuid(),
    name: title,

    forks: {
      description,

      onEnter: env => {
        spoils.forEach(spoil => {
          env.player.addItem(spoil);
        })

        return env;
      },

      options: [
        {
          name: optionTitle,
          next: GameEventNextType.PUSH_STORY,
        },
      ],
    }
  }
}