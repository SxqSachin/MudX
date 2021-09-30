import { useEffect, useMemo, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { BattlePanel } from "./components/ui/battle-panel";
import { DebugPanel } from "./components/ui/debug-panel";
import { GameEventPanel } from "./components/ui/event-panel";
import { UnitStatusPanel } from "./components/ui/unit-status-panel";

import './data';

import { GameEvents } from "./data";
import { Unit } from "./models/Unit";
import { EnemyCharacterAtom, GameEnvironmentAtom, PlayerCharacterAtom } from "./store";
import { BattleAction } from "./types/battle";
import { GameEnvironment } from "./types/game";
import { GameEvent, GameEventOption } from "./types/game-event";
import { IUnit } from "./types/Unit";
import { toArray } from "./utils";
import { Dice } from "./utils/random";

function App() {
  const [event, setEvent] = useState({} as GameEvent);
  const [test, setTest] = useState(1);
  const [playerCharacter, setPlayerCharacter] = useRecoilState(PlayerCharacterAtom);
  const [enemy, setEnemy] = useRecoilState(EnemyCharacterAtom);
  const [isForceUpdate, setForceUpdate] = useState([]);

  const [gameEnvironment, setGameEnvironment] = useRecoilState(GameEnvironmentAtom);

  const forceUpdate = () => {
    setForceUpdate([]);
  }

  useEffect(() => {
    setEvent(GameEvents.get('test-center'));

    const player = Unit.create('player');
    player.dealDamage(player, 5);
    player.increaseStatus('phyAtk', 3);
    setPlayerCharacter(player);

    const enemy = Unit.create('enemy');
    setEnemy(enemy);

    gameEnvironment.player = player;
    gameEnvironment.enemy = enemy;

    setGameEnvironment(gameEnvironment);
    forceUpdate();
  }, []);

  const onChooseOption = (option: GameEventOption) => {
    let gameEnv = gameEnvironment;
    console.log(option);
    toArray(option.onChoose).forEach(cb => {
      if (!cb) {
        return;
      }

      const processedGameEnv = cb(gameEnv);
      if (processedGameEnv) {
        gameEnv = processedGameEnv;
      }
    });
    setGameEnvironment(gameEnv);

    if (typeof option.next === 'string') {
      setEvent(GameEvents.get(option.next));
    } else {
      const res = option.next(gameEnv);

      if (typeof res === 'string') {
        setEvent(GameEvents.get(res));
      } else {
        setEvent(res);
      }
    }

    setTest(Dice.d100);
    forceUpdate();
  }

  const handleBattleAction = (action: BattleAction) => {
    if (action === 'ATTACK') {
      playerCharacter.attack(enemy);
      forceUpdate();
    }
  }

  const BattlePanelMemo = useMemo(() => {
    if (!(playerCharacter && enemy)) {
      return <></>;
    }

    return <BattlePanel player={playerCharacter} enemy={enemy} onAction={handleBattleAction}></BattlePanel>
  }, [isForceUpdate, playerCharacter, enemy]);

  const handleEnvironmentChange = (env: GameEnvironment) => {
    setPlayerCharacter(env.player);
    env.enemy && setEnemy(env.enemy);
    setGameEnvironment(env);
    forceUpdate();
  }

  if (!playerCharacter) {
    return <></>;
  }

  return (
    <div className="App">
      <div className="flex flex-row p-8">
        <div className="w-4/5 mr-4">
          <GameEventPanel event={event} onChooseOption={onChooseOption}></GameEventPanel>
          {
            BattlePanelMemo
          }
          <DebugPanel onEnvironmentChange={handleEnvironmentChange}></DebugPanel>
        </div>
        <div className="w-1/5 ml-4">
          <UnitStatusPanel unit={playerCharacter}></UnitStatusPanel>
        </div>
      </div>
    </div>
  );
}

export default App;
