import { GameAction } from "../../types/action";
import { GameEvent, GameEventNextType } from "../../types/game-event";

export function simpleTextEvent(title: string, description: string, optionTitle: string): GameEvent {
  return {
    id: `__SIMPLE_TEXT_EVENT_${title}`,
    name: title,

    forks: {
      description,

      options: [
        {
          name: optionTitle,
          next: GameEventNextType.GAME_EVENT_END,
        },
      ],
    }
  }
}

export function simpleOnEnterEvent({ title, description, optionTitle, onEnter }: { title: string, description: string, optionTitle: string, onEnter?: GameAction | GameAction[]}): GameEvent {
  return {
    id: `__SIMPLE_EVENT_${title}`,
    name: title,

    forks: {
      description,
      onEnter,

      options: [
        {
          name: optionTitle,
          next: GameEventNextType.GAME_EVENT_END,
        },
      ],
    }
  }
}