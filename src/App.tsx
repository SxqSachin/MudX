import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { BattlePanel } from "./components/ui/battle-panel";
import { GameEventPanel } from "./components/ui/event-panel";

import './data';

import { GameEvents } from "./data";
import { Unit } from "./models/Unit";
import { EnemyCharacterAtom, PlayerCharacterAtom } from "./store";
import { BattleAction } from "./types/battle";
import { GameEvent, GameEventOption } from "./types/game-event";
import { IUnit } from "./types/Unit";
import { Dice } from "./utils/random";

function App() {
  const [event, setEvent] = useState({} as GameEvent);
  const [test, setTest] = useState(1);
  const [playerCharacter, setPlayerCharacter] = useRecoilState(PlayerCharacterAtom);
  const [enemy, setEnemy] = useRecoilState(EnemyCharacterAtom);
  const [, setForceUpdate] = useState([]);

  useEffect(() => {
    setEvent(GameEvents.get('test-center'));

    const player = Unit.create('player');
    player.dealDamage(player, 5);
    player.increaseStatus('phyAtk', 3);
    setPlayerCharacter(player);

    const enemy = Unit.create('enemy');
    setEnemy(enemy);
  }, []);

  const onChooseOption = (option: GameEventOption) => {
    if (typeof option.next === 'string') {
      setEvent(GameEvents.get(option.next));
    } else {
      const res = option.next({} as IUnit);

      if (typeof res === 'string') {
        setEvent(GameEvents.get(res));
      } else {
        setEvent(res);
      }
    }

    setTest(Dice.d100);
    console.log(option);
  }

  const forceUpdate = () => {
    setForceUpdate([]);
  }

  const handleBattleAction = (action: BattleAction) => {
    if (action === 'ATTACK') {
      playerCharacter.attack(enemy);
      forceUpdate();

      console.log(enemy.status.curHP);
    }
  }

  return (
    <div className="App">
      <GameEventPanel event={event} onChooseOption={onChooseOption}></GameEventPanel>
      {
        (playerCharacter && enemy) && <BattlePanel player={playerCharacter} enemy={enemy} onAction={handleBattleAction}></BattlePanel>
      }
    </div>
  );
}

export default App;
