import { BattlePanel } from "../../components/ui/battle-panel";
import { StoryChoosePanel } from "../../components/ui/story-choose-panel";
import { GameEvents } from "../../data";
import { DataCallback } from "../../types";
import { BattleAction } from "../../types/battle";
import { GameEnvironment } from "../../types/game";
import { Story } from "../../types/game-event";

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

  const handleBattleAction = (action: BattleAction) => {
    const { player, enemy } = gameEnvironment;
    if (!enemy) {
      return;
    }
    if (action === 'ATTACK') {
      player.attack(enemy);
    }

    applyEnvironment(gameEnvironment);
  }

  return <BattlePanel player={player} enemy={enemy} onAction={handleBattleAction}></BattlePanel>
}