import { useEffect, useState } from "react";
import { GameEventPanel } from "./components/ui/event-panel";

import './data';

import { GameEvents } from "./data";
import { GameEvent, GameEventOption } from "./types/game-event";
import { IUnit } from "./types/Unit";
import { Dice } from "./utils/random";

function App() {
  const [event, setEvent] = useState({} as GameEvent);
  const [test, setTest] = useState(1);

  useEffect(() => {
    setEvent(GameEvents.get('test-game-event'));
  }, []);

  const onChooseOption = (option: GameEventOption) => {
    if (typeof option.next === 'string') {
      setEvent(GameEvents.get(option.next));
      console.log('1');
    } else {
      const res = option.next({} as IUnit);

      if (typeof res === 'string') {
        setEvent(GameEvents.get(res));
        console.log('2');
      } else {
        setEvent(res);
        console.log('3');
      }
    }

    setTest(Dice.d100);
    console.log(option);
  }

  return (
    <div className="App">
      <GameEventPanel event={event} onChooseOption={onChooseOption}></GameEventPanel>
      <div>{test}</div>
    </div>
  );
}

export default App;
