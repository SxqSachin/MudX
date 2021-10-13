import { useEffect, } from "react";
import { GameEvents } from "../../data";
import { DataCallback, } from "../../types";
import { BattleAction } from "../../types/battle";
import { Story } from "../../types/game-event";

type StoryChoosePanelParam = {
  onChooseStory: DataCallback<Story>,
}
export function StoryChoosePanel({onChooseStory}: StoryChoosePanelParam) {
  useEffect(() => {
  }, []);

  const handleChooseStory = () => {
    const newStory: Story = GameEvents.createStory('test', 'cc', 10);

    onChooseStory(newStory);
  }

  return (
    <div className="w-full">
      <div>
        <h2>选择一个剧本</h2>
      </div>
      <div>
        <button className="btn" onClick={handleChooseStory}>草原</button>
      </div>
    </div>
  )
}