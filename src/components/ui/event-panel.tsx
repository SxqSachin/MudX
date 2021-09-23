import { useEffect, useState } from "react";
import { runExpr } from "../../core/expr";
import { DataCallback } from "../../types";
import { GameEvent, GameEventFork, GameEventOption } from "../../types/game-event";
import { isString, toArray } from "../../utils";

type GameEventPanelParam = {
  event: GameEvent,
  onChooseOption: DataCallback<GameEventOption>,
}
export function GameEventPanel({event, onChooseOption}: GameEventPanelParam) {
  const [fork, setFork] = useState({} as GameEventFork);
  const [desc, setDesc] = useState('');

  useEffect(() => {
    const gameEnvObject = {
    };

    toArray(event.forks).some(fork => {
      if (!fork.condition) {
        setFork(fork);
        setDesc(typeof fork.description === 'string' ? fork.description : fork.description());

        return true;
      } 

      if (!!runExpr(fork.condition, gameEnvObject)) {
        setFork(fork);
        setDesc(typeof fork.description === 'string' ? fork.description : fork.description());

        return true;
      }

      return false;
    });
  }, [event]);

  return (
    <div>
      <h2>{event.name}</h2>
      <hr className="my-4"/>
      <p>{desc}</p>
      <div className="flex flex-row w-full justify-around">
      {
        toArray(fork.options).map((option, index) => {
          return (
            <button className="border border-black rounded-md px-6 py-4" key={option.name + option.id + index} onClick={() => onChooseOption(option)}>{option.name}</button>
          )
        })
      }
      </div>
    </div>
  )
}