import { useEffect, useMemo, useState } from "react";
import { useRecoilState, } from "recoil";
import { BattlePanel } from "../../components/ui/battle-panel";
import { DebugPanel } from "../../components/ui/debug-panel";
import { GameEventPanel } from "../../components/ui/event-panel";
import { StoryChoosePanel } from "../../components/ui/story-choose-panel";
import { UnitInfoPanel } from "../../components/ui/unit-info-panel";

import '../../data';

import { GameEvents, } from "../../data";
import { endEvent } from "../../models/event/event-end";
import { storyEndEvent } from "../../models/event/story-end";
import { Unit } from "../../models/Unit";
import { GameEnvironmentAtom, } from "../../store";
import { ItemAction } from "../../types/action";
import { BattleAction } from "../../types/battle";
import { GameEnvironment, GamePanelType } from "../../types/game";
import { GameEvent, GameEventNextType, GameEventOption, Story } from "../../types/game-event";
import { IItem } from "../../types/Item";
import { toArray } from "../../utils";
import { calcOptionNextEvent, getOptionNextType, } from "../../utils/game-event";

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
    gameEnvironment.story = GameEvents.createStory('新故事', '这是一个新故事', 3);
    gameEnvironment.event = GameEvents.get(gameEnvironment.story.pages[0].event);
    gameEnvironment.panels.add('EVENT');

    const player = Unit.create('player');
    const enemy = Unit.create('enemy');

    gameEnvironment.player = player;
    gameEnvironment.enemy = enemy;

    applyEnvironment(gameEnvironment);
    forceUpdate();
  }, []);

  const onChooseOption = (option: GameEventOption) => {
    let gameEnv = gameEnvironment;

    toArray(option.onChoose).forEach(cb => {
      if (!cb) {
        return;
      }

      const processedGameEnv = cb(gameEnv);
      if (processedGameEnv) {
        gameEnv = processedGameEnv;
      }
    });

    const optionNextType = getOptionNextType(option, gameEnv);
    let gameEvent = calcOptionNextEvent(option, gameEnv);
    if (optionNextType === GameEventNextType.PUSH_STORY) {
      if (gameEnv.story.curPage >= gameEnv.story.totalPage) { // 故事读完了
        gameEvent = storyEndEvent();
      } else { // 推进到下一章节
        gameEnv.story.curPage++;
        gameEvent = GameEvents.get(gameEnv.story.pages[gameEnv.story.curPage - 1].event);
      }
    } else if(optionNextType === GameEventNextType.START_NEW_STORY) { // 开始新的故事
      gameEnv.panels.delete("EVENT");
      gameEnv.panels.delete("BATTLE");
      gameEnv.panels.add("STORY_CHOOSE");
    } else if(optionNextType === GameEventNextType.GAME_EVENT_END) { // 当前章节结束
      gameEvent = endEvent();
    } else { // 普通的故事推进
      gameEvent = calcOptionNextEvent(option, gameEnv);
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

  const storyChooseMemo = useMemo(() => {
    if (!gameEnvironment.panels.has('STORY_CHOOSE')) {
      return null;
    }

    const handleChooseStory = (story: Story) => {
      gameEnvironment.story = story;
      gameEnvironment.event = GameEvents.get(story.pages[0].event);
      gameEnvironment.panels.add('EVENT').delete('STORY_CHOOSE');

      applyEnvironment(gameEnvironment);
    };

    return <StoryChoosePanel onChooseStory={handleChooseStory}></StoryChoosePanel>
  }, [gameEnvironment.panels.keys()]);

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
          { storyChooseMemo }
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
