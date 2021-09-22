import { useEffect, useState } from "react";
import { GameEventPanel } from "./components/ui/event-panel";

import './data';

import { GameEvents } from "./data";
import { GameEvent } from "./types/game-event";

function App() {
  const [event, setEvent] = useState({} as GameEvent);
  useEffect(() => {
    setEvent(GameEvents.get('test-game-event'));
  }, []);

  return (
    <div className="App">
      <GameEventPanel event={event}></GameEventPanel>
    </div>
  );
}

export default App;
