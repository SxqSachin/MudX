import { useEffect, useMemo, useState } from "react";
import { useRecoilState, } from "recoil";
import { BattlePanel } from "../../components/ui/battle-panel";
import { DebugPanel } from "../../components/ui/debug-panel";
import { GameEventPanel } from "../../components/ui/event-panel";
import { UnitInfoPanel } from "../../components/ui/unit-info-panel";

import '../../data';

import { GameEvents, Items } from "../../data";
import { Unit } from "../../models/Unit";
import { GameEnvironmentAtom, } from "../../store";
import { ItemAction } from "../../types/action";
import { BattleAction } from "../../types/battle";
import { GameEnvironment } from "../../types/game";
import { GameEvent, GameEventOption } from "../../types/game-event";
import { IItem } from "../../types/Item";
import { toArray } from "../../utils";
import { Dice } from "../../utils/random";

function App() {
  const [isForceUpdate, setForceUpdate] = useState([]);
  const [gameEnvironment, setGameEnvironment] = useRecoilState(GameEnvironmentAtom);

  const forceUpdate = () => {
    setForceUpdate([]);
  }

  useEffect(() => {
    gameEnvironment.panels.add('EVENT');
    gameEnvironment.event = GameEvents.get('test-center');

    const player = Unit.create('player');
    player.increaseStatus('phyAtk', 3);

    const sword = Items.get('sword');
    const sword2 = Items.get('sword');
    player.addItem(sword).equipItem(sword);
    player.addItem(sword2).equipItem(sword2);

    const enemy = Unit.create('enemy');

    gameEnvironment.player = player;
    gameEnvironment.enemy = enemy;

    applyEnvironment(gameEnvironment);
    forceUpdate();
  }, []);

  const onChooseOption = (option: GameEventOption) => {
    let gameEnv = gameEnvironment;
    let gameEvent = gameEnv.event;

    toArray(option.onChoose).forEach(cb => {
      if (!cb) {
        return;
      }

      const processedGameEnv = cb(gameEnv);
      if (processedGameEnv) {
        gameEnv = processedGameEnv;
      }
    });

    if (typeof option.next === 'string') {
      gameEvent = GameEvents.get(option.next);
    } else {
      const res = option.next(gameEnv);

      if (typeof res === 'string') {
        gameEvent = GameEvents.get(res);
      } else {
        gameEvent = res;
      }
    }

    gameEnv.event = gameEvent;

    applyEnvironment(gameEnv);

    forceUpdate();
  }

  const handleBattleAction = (action: BattleAction) => {
    const { player, enemy } = gameEnvironment;
    if (!enemy) {
      return;
    }
    if (action === 'ATTACK') {
      player.attack(enemy);
      forceUpdate();
    }
  }

  const applyEnvironment = (env: GameEnvironment) => {
    setGameEnvironment(gameEnvironment);
    forceUpdate();
  }

  const onItemAction = (action: ItemAction, item: IItem) => {
    const { player } = gameEnvironment;
    switch (action) {
      case 'EQUIP':
        player.equipItem(item);
        gameEnvironment.player = player;
        applyEnvironment(gameEnvironment);
        break;
      case 'UNEQUIP':
        player.unequipItem(item);
        gameEnvironment.player = player;
        applyEnvironment(gameEnvironment);
        break;
    }
  }

  const gameEventPanelMemo = useMemo(() => {
    if (!gameEnvironment.panels.has('EVENT')) {
      return null;
    }

    return <GameEventPanel event={gameEnvironment.event} onChooseOption={onChooseOption}></GameEventPanel>
  }, [gameEnvironment.panels.keys(), gameEnvironment.event]);

  const BattlePanelMemo = (() => {
    const { player, enemy, panels } = gameEnvironment;
    if (!panels.has('BATTLE')) {
      return null;
    }

    if (!(player && enemy)) {
      return null;
    }

    return <BattlePanel player={player} enemy={enemy} onAction={handleBattleAction}></BattlePanel>
  })();

  if (!gameEnvironment.player) {
    return <></>;
  }

  return (
    <div className="App w-screen h-screen flex flex-col p-8">
      <div className="flex flex-row w-full h-2/3">
        <div className="w-3/4 mr-2 border rounded-md p-4 relative">
          { gameEventPanelMemo }
          { BattlePanelMemo }
          <DebugPanel className="absolute bottom-0 left-0 p-" onEnvironmentChange={applyEnvironment}></DebugPanel>
        </div>
        <div className="w-1/4 ml-2 flex flex-col border rounded-md p-4">
          <UnitInfoPanel unit={gameEnvironment.player} onItemAction={onItemAction}></UnitInfoPanel>
        </div>
      </div>
      <div className="border mt-4 rounded-md h-1/3">
      </div>
    </div>
  );
}

export default App;
