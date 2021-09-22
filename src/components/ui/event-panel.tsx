import { GameEvent } from "../../types/game-event";
import { toArray } from "../../utils";

type GameEventPanelParam = {
  event: GameEvent,
}
export function GameEventPanel({event}: GameEventPanelParam) {
  return (
    <div>
      <h2>{event.name}</h2>
      <hr className="my-4"/>
      <p>{event.description}</p>
      <div className="flex flex-col">
      {
        toArray(event.options).map(option => {
          return (
            <button>{option.name}</button>
          )
        })
      }
      </div>
    </div>
  )
}