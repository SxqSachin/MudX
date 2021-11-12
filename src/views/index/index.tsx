import { useEffect, useState } from "react";
import { useRecoilState, } from "recoil";
import { DebugPanel } from "../../components/ui/debug-panel";
import { GameEventPanel } from "../../components/ui/event-panel";
import { MessagePanel } from "../../components/ui/msg-panel";
import { UnitInfoPanel } from "../../components/ui/unit-info-panel";
import { Unit } from "@/models/Unit";

import '@data';

import { Enemies, GameEvents, Skills, } from "@data";
import { GameEnvironmentAtom, } from "../../store";
import { GameEnvironment, } from "@/types/game";
import { StoryUtils } from "@/utils/story";
import { BattlePanelHOC, GameEventPanelHOC, StoryChoosePanelHOC, TradePanelHOC } from "./hoc";
import { handleChooseOption, handleItemAction } from "./logic";
import { deepClone } from "@/utils";
import { showPanel } from "@/utils/game";

function App() {
  const [, setForceUpdate] = useState([]);
  const [gameEnvironment, setGameEnvironment] = useRecoilState(GameEnvironmentAtom);

  const forceUpdate = () => {
    setForceUpdate([]);
  }

  const applyEnvironment = (env: GameEnvironment) => {
    setGameEnvironment(env);
    forceUpdate();

    // @ts-ignore
    window.env = env;
  }

  useEffect(() => {

    gameEnvironment.story = StoryUtils.createStory({
      title: "新故事",
      description: "这是一个新故事",
      pageNum: 3,
    });
    gameEnvironment.event = GameEvents.get(gameEnvironment.story.pages[0].event);
    gameEnvironment.panels = showPanel(gameEnvironment, "EVENT");

    const player = Unit.create('player');
    const enemy = Enemies.getGenerator('神庙守护者')(gameEnvironment);

    console.log(Skills.get('mental-shield'));
    player.learnSkill(Skills.get('mental-shield'));

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
        <div className="w-3/4 mr-2 border rounded-md p-4 relative overflow-hidden">
          <GameEventPanelHOC applyEnvironment={applyEnvironment} gameEnvironment={gameEnvironment}></GameEventPanelHOC>
          <StoryChoosePanelHOC applyEnvironment={applyEnvironment} gameEnvironment={gameEnvironment}></StoryChoosePanelHOC>
          <BattlePanelHOC applyEnvironment={applyEnvironment} gameEnvironment={gameEnvironment}></BattlePanelHOC>
          <TradePanelHOC applyEnvironment={applyEnvironment} gameEnvironment={gameEnvironment}></TradePanelHOC>
        </div>
        <div className="w-1/4 ml-2 flex flex-col border rounded-md p-4">
          <UnitInfoPanel unit={gameEnvironment.player} onItemAction={(action, item) => applyEnvironment(handleItemAction(gameEnvironment)(action, item))}></UnitInfoPanel>
        </div>
      </div>
      <div>
        <DebugPanel className="mt-4" onEnvironmentChange={applyEnvironment}></DebugPanel>
      </div>
      <div className="border mt-4 rounded-md h-1/3">
        <MessagePanel></MessagePanel>
      </div>
    </div>
  );
}

export default App;
