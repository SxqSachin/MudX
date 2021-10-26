import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { runExpr } from "../../core/expr";
import { GameEnvironmentAtom } from "../../store";
import { DataCallback } from "@/types";
import { GameEvent, GameEventFork, GameEventOption } from "@/types/game-event";
import { isEmpty, toArray } from "@/utils";
import { getRandomString } from "@/utils/random";

type GameEventPanelParam = {
  event: GameEvent,
  onChooseOption: DataCallback<GameEventOption>,
}
export function GameEventPanel({event, onChooseOption}: GameEventPanelParam) {
  const [, setGameEvent] = useState({} as GameEvent);
  const [fork, setFork] = useState({} as GameEventFork);
  const [desc, setDesc] = useState('');
  const [gameEnvironment, setGameEnvironment] = useRecoilState(GameEnvironmentAtom);

  // todo onEnter要触发刷新

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
    if (!isEmpty(fork)) {
      onLeaveFork(fork);
    }

    let passedFork: GameEventFork = null as any;
    toArray(event.forks).some(fork => {
      switch (typeof fork.condition) {
        case 'undefined':
          passedFork = fork;
          break;
        case 'boolean':
          passedFork = fork.condition ? fork : undefined!;
          break;
        case 'string':
          passedFork = runExpr(fork.condition, gameEnvironment) ? fork : undefined!;
          break;
        case 'function':
          passedFork = fork.condition(gameEnvironment) ? fork : undefined!;
          break;
        default:
          passedFork = fork;
          break;
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
    <div className="h-full relative">
      <h2>{event.name}<span>({gameEnvironment.story.curPage}/{ gameEnvironment.story.totalPage})</span></h2>
      <hr className="my-4"/>
      <p>{desc}</p>
      <div className="flex flex-row w-full justify-around absolute bottom-0 mb-8">
      {
        toArray(fork.options).map((option, index) => {
          const enabledBtn = <button className="border border-black rounded-md px-6 py-4" key={option.name + option.id + index} onClick={() => handleChooseOption(option)}>{option.name}</button>;

          const disabledBtn =
            option.blurOnCheckFailed
              ? <button className="border border-black bg-gray-500 text-white rounded-md px-6 py-4 cursor-not-allowed filter blur-sm" key={option.name + option.id + index} >{getRandomString().substr(0, 6)}</button>
              : <button className="border border-black bg-gray-500 text-white rounded-md px-6 py-4 cursor-not-allowed" key={option.name + option.id + index} >{option.name}</button>;

          switch (typeof option.condition) {
            case 'undefined':
              return enabledBtn;
            case 'boolean':
              return option.condition ? enabledBtn : disabledBtn;
            case 'string':
              return runExpr(option.condition, gameEnvironment) ? enabledBtn : disabledBtn;
            case 'function':
              return option.condition(gameEnvironment) ? enabledBtn : disabledBtn;
            default:
              return enabledBtn;
          }
        })
      }
      </div>
    </div>
  )
}