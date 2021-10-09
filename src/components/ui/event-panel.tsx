import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { runExpr } from "../../core/expr";
import { GameEnvironmentAtom } from "../../store";
import { DataCallback } from "../../types";
import { GameEvent, GameEventFork, GameEventOption } from "../../types/game-event";
import { isEmpty, toArray } from "../../utils";

type GameEventPanelParam = {
  event: GameEvent,
  onChooseOption: DataCallback<GameEventOption>,
}
export function GameEventPanel({event, onChooseOption}: GameEventPanelParam) {
  const [, setGameEvent] = useState({} as GameEvent);
  const [fork, setFork] = useState({} as GameEventFork);
  const [desc, setDesc] = useState('');
  const [gameEnvironment, setGameEnvironment] = useRecoilState(GameEnvironmentAtom);

  const onEnterFork = (fork: GameEventFork) => {
    setFork(fork);
    setDesc(typeof fork.description === 'string' ? fork.description : fork.description());

    toArray(fork.onEnter).forEach(cb => {
      if (typeof cb === 'function') {
        cb(gameEnvironment);
      }
    });
  }

  const onLeaveFork = (fork: GameEventFork) => {
    toArray(fork.onLeave).forEach(cb => {
      if (typeof cb === 'function') {
        cb(gameEnvironment);
      }
    });
  }

  useEffect(() => {
    const gameEnvObject = {
    };

    if (!isEmpty(fork)) {
      onLeaveFork(fork);
    }

    let passedFork: GameEventFork = null as any;
    toArray(event.forks).some(fork => {
      if (!fork.condition) {
        passedFork = fork;
      } else if (!!runExpr(fork.condition, gameEnvObject)) {
        passedFork = fork;
      }

      return passedFork;
    });

    if (!isEmpty(passedFork)) {
      onEnterFork(passedFork);
    }

    setGameEvent(event);

    gameEnvironment.fork = passedFork;
    gameEnvironment.event = event;

    setGameEnvironment(gameEnvironment);
  }, [event]);

  const handleChooseOption = (option: GameEventOption) => {
    onChooseOption(option);
  }

  return (
    <div>
      <h2>{event.name}</h2>
      <hr className="my-4"/>
      <p>{desc}</p>
      <div className="flex flex-row w-full justify-around">
      {
        toArray(fork.options).map((option, index) => {
          return (
            <button className="border border-black rounded-md px-6 py-4" key={option.name + option.id + index} onClick={() => handleChooseOption(option)}>{option.name}</button>
          )
        })
      }
      </div>
    </div>
  )
}