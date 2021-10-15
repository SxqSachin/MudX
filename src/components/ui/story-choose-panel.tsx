import { useEffect, } from "react";
import { DataCallback, } from "../../types";
import { Story } from "../../types/game-event";
import { StoryUtils } from "../../utils/story";

type StoryChoosePanelParam = {
  onChooseStory: DataCallback<Story>,
}
export function StoryChoosePanel({onChooseStory}: StoryChoosePanelParam) {
  useEffect(() => {
  }, []);

  const handleChooseStory = () => {
    const newStory: Story = StoryUtils.createStory({
      title: "test",
      description: "cc",
      pageNum: 10,
    });

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