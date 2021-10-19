import { Story, StoryGenerator } from "@/types/game-event";
import { deepClone } from "@/utils";
import scriptStoryAssets from "./script";

const StoryMap: Map<string, Story> = new Map();
const StoryGeneratorMap: Map<string, StoryGenerator> = new Map();

scriptStoryAssets.forEach(generator => {
  // if (asset.story) {
  //   StoryMap.set(asset.story.id, asset.story);
  // }
  StoryGeneratorMap.set(generator.id, generator);
});

const Stories = {
  get: (id: string): Story => {
    return deepClone(StoryMap.get(id) as any as Story);
  },
  getGenerators: (): IterableIterator<StoryGenerator> => {
    return StoryGeneratorMap.values();
  }
}

export {
  Stories
};