import { BattlePanel } from "@/components/ui/battle-panel";
import { StoryChoosePanel } from "@/components/ui/story-choose-panel";
import { Message } from "@/core/message";
import { GameEvents } from "@data";
import { battleEndEvent, } from "@/models/event/battle-end";
import { DataCallback, VoidCallback } from "@/types";
import { BattleAction } from "@/types/battle";
import { GameEnvironment } from "@/types/game";
import { Story } from "@/types/game-event";
import { delay } from "@/utils";
import { GameEventPanel } from "@/components/ui/event-panel";
import { handleChooseOption } from "../logic";

type MainPanelParam = {
  gameEnvironment: GameEnvironment;
  applyEnvironment: DataCallback<GameEnvironment>;
};

export const StoryChoosePanelHOC = ({gameEnvironment, applyEnvironment}: MainPanelParam) => {
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
}

export const BattlePanelHOC = ({gameEnvironment, applyEnvironment}: MainPanelParam) => {
  const { player, enemy, panels } = gameEnvironment;
  if (!panels.has('BATTLE')) {
    return null;
  }

  if (!(player && enemy)) {
    return null;
  }

  const battleActionMap: { [action in BattleAction]: VoidCallback } = {
    ATTACK: () => {
      player.attack(enemy);
    },
    ENTER_BATTLE: async () => {
      Message.push("=========================")
      Message.push("进入战斗");
      await delay(620);
      const isPlayerFirst = enemy.status.speed <= player.status.speed;
      Message.push(`速度对比：玩家(${player.status.speed}) vs 对方(${enemy.status.speed})。${isPlayerFirst?"玩家":"对方"}先手。`);
      await delay(620);
      if (!isPlayerFirst) {
        enemy.attack(player);
      }

      applyEnvironment(gameEnvironment);
    },
  }

  const handleBattleAction = async (action: BattleAction) => {
    const { player, enemy } = gameEnvironment;
    if (!enemy) {
      return;
    }

    await battleActionMap[action]();

    if (enemy.status.curHP <= 0) {
      gameEnvironment.event = battleEndEvent({ enemy }, gameEnvironment);
      await delay(600);
      gameEnvironment.panels.add("EVENT").delete("BATTLE");
    }

    applyEnvironment(gameEnvironment);
  }

  return <BattlePanel player={player} enemy={enemy} onAction={handleBattleAction}></BattlePanel>
}

export const GameEventPanelHOC = ({ gameEnvironment, applyEnvironment }: MainPanelParam) => {
  const { panels } = gameEnvironment;

  if (!panels.has("EVENT")) {
    return null;
  }

  return <GameEventPanel event={gameEnvironment.event} onChooseOption={option => applyEnvironment(handleChooseOption(gameEnvironment)(option))}></GameEventPanel>
}