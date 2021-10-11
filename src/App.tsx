import { useEffect, useMemo, useState } from "react";
import { useRecoilState, } from "recoil";
import { BattlePanel } from "./components/ui/battle-panel";
import { DebugPanel } from "./components/ui/debug-panel";
import { GameEventPanel } from "./components/ui/event-panel";
import { UnitInfoPanel } from "./components/ui/unit-info-panel";

import './data';

import { GameEvents, Items } from "./data";
import { Unit } from "./models/Unit";
import { EnemyCharacterAtom, GameEnvironmentAtom, PlayerCharacterAtom } from "./store";
import { ItemAction } from "./types/action";
import { BattleAction } from "./types/battle";
import { GameEnvironment } from "./types/game";
import { GameEvent, GameEventOption } from "./types/game-event";
import { IItem } from "./types/Item";
import { toArray } from "./utils";
import { Dice } from "./utils/random";

function App() {
  const [event, setEvent] = useState({} as GameEvent);
  const [, setTest] = useState(1);
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
    player.increaseStatus('phyAtk', 3);

    const sword = Items.get('sword');
    const sword2 = Items.get('sword');
    player.addItem(sword).equipItem(sword);
    player.addItem(sword2).equipItem(sword2);

    const enemy = Unit.create('enemy');
    setEnemy(enemy);

    gameEnvironment.player = player;
    gameEnvironment.enemy = enemy;

    applyEnvironment(gameEnvironment);
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
    applyEnvironment(gameEnv);

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

  const applyEnvironment = (env: GameEnvironment) => {
    setPlayerCharacter(env.player);
    env.enemy && setEnemy(env.enemy);
    setGameEnvironment(gameEnvironment);
    forceUpdate();
  }

  const onItemAction = (action: ItemAction, item: IItem) => {
    switch (action) {
      case 'EQUIP':
        playerCharacter.equipItem(item);
        gameEnvironment.player = playerCharacter;
        applyEnvironment(gameEnvironment);
        break;
      case 'UNEQUIP':
        playerCharacter.unequipItem(item);
        gameEnvironment.player = playerCharacter;
        applyEnvironment(gameEnvironment);
        break;
    }
  }

  if (!playerCharacter) {
    return <></>;
  }

  return (
    <div className="App w-screen h-screen flex flex-col p-8">
      <div className="flex flex-row w-full h-2/3">
        <div className="w-3/4 mr-2 border rounded-md p-4">
          <GameEventPanel event={event} onChooseOption={onChooseOption}></GameEventPanel>
          {
            BattlePanelMemo
          }
          <DebugPanel onEnvironmentChange={applyEnvironment}></DebugPanel>
        </div>
        <div className="w-1/4 ml-2 flex flex-col border rounded-md p-4">
          <UnitInfoPanel unit={playerCharacter} onItemAction={onItemAction}></UnitInfoPanel>
        </div>
      </div>
      <div className="border mt-4 rounded-md h-1/3">
      </div>
    </div>
  );
}

export default App;
