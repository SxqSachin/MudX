import { useEffect, useState } from "react";
import { useRecoilState, } from "recoil";
import { DebugPanel } from "../../components/ui/debug-panel";
import { GameEventPanel } from "../../components/ui/event-panel";
import { UnitInfoPanel } from "../../components/ui/unit-info-panel";

import '../../data';

import { GameEvents, } from "../../data";
import { Unit } from "../../models/Unit";
import { GameEnvironmentAtom, } from "../../store";
import { GameEnvironment, } from "../../types/game";
import { StoryUtils } from "../../utils/story";
import { BattlePanelHOC, StoryChoosePanelHOC } from "./hoc";
import { handleChooseOption, handleItemAction } from "./logic";

function App() {
  const [, setForceUpdate] = useState([]);
  const [gameEnvironment, setGameEnvironment] = useRecoilState(GameEnvironmentAtom);

  const forceUpdate = () => {
    setForceUpdate([]);
  }

  const applyEnvironment = (env: GameEnvironment) => {
    setGameEnvironment(gameEnvironment);
    forceUpdate();

    // @ts-ignore
    global.env = env;
  }

  useEffect(() => {

    gameEnvironment.story = StoryUtils.createStory({
      title: "新故事",
      description: "这是一个新故事",
      pageNum: 3,
    });
    gameEnvironment.event = GameEvents.get(gameEnvironment.story.pages[0].event);
    gameEnvironment.panels.add('EVENT');

    const player = Unit.create('player');
    const enemy = Unit.create('enemy');

    gameEnvironment.player = player;
    gameEnvironment.enemy = enemy;

    applyEnvironment(gameEnvironment);
    forceUpdate();
  }, []);

  if (!gameEnvironment.player) {
    return <></>;
  }

  return (
    <div className="App w-screen h-screen flex flex-col p-8">
      <div className="flex flex-row w-full h-2/3">
        <div className="w-3/4 mr-2 border rounded-md p-4 relative">
          {gameEnvironment.panels.has('EVENT') && <GameEventPanel event={gameEnvironment.event} onChooseOption={option => applyEnvironment(handleChooseOption(gameEnvironment)(option))}></GameEventPanel>}
          <StoryChoosePanelHOC applyEnvironment={applyEnvironment} gameEnvironment={gameEnvironment}></StoryChoosePanelHOC>
          <BattlePanelHOC applyEnvironment={applyEnvironment} gameEnvironment={gameEnvironment}></BattlePanelHOC>
          <DebugPanel className="absolute bottom-0 left-0 p-" onEnvironmentChange={applyEnvironment}></DebugPanel>
        </div>
        <div className="w-1/4 ml-2 flex flex-col border rounded-md p-4">
          <UnitInfoPanel unit={gameEnvironment.player} onItemAction={(action, item) => applyEnvironment(handleItemAction(gameEnvironment)(action, item))}></UnitInfoPanel>
        </div>
      </div>
      <div className="border mt-4 rounded-md h-1/3">
      </div>
    </div>
  );
}

export default App;
