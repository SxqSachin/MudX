import { useEffect, useState, } from "react";
import { useRecoilValue } from "recoil";
import { Stories } from "../../data";
import { GameEnvironmentAtom } from "../../store";
import { DataCallback, } from "../../types";
import { Story, StoryGenerator } from "../../types/game-event";

type StoryChoosePanelParam = {
  onChooseStory: DataCallback<Story>,
}
export function StoryChoosePanel({onChooseStory}: StoryChoosePanelParam) {
  const [storyGenerators, setStoryGenerators] = useState([] as StoryGenerator[]);
  const gameEnvironment = useRecoilValue(GameEnvironmentAtom);

  useEffect(() => {
    const generators = [];
    for (let generator of Stories.getGenerators()) {
      generators.push(generator);
    }

    setStoryGenerators(generators);
  }, []);

  const handleChooseStory = (story: Story) => {
    onChooseStory(story);
  }

  return (
    <div className="w-full">
      <div>
        <h2>选择一个剧本</h2>
      </div>
      <div>
        {
          storyGenerators.map(storyGenerator => {
            const story = storyGenerator.generator(gameEnvironment);
            return (
              <button
                key={story.id}
                className="btn"
                onClick={() => handleChooseStory(story)}
              >
                {story.title}
              </button>
            );
          })
        }
      </div>
    </div>
  )
}