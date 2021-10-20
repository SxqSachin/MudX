import { DataCallback, ReturnCallback } from "@/types";
import { Story, StoryGenerator } from "@/types/game-event";
import { IEnemy } from "@/types/enemy";
import { deepClone } from "@/utils";
import scriptSssets from "./script";
import { EnvObjectGenerator, GameEnvironment } from "@/types/game";

const generatorMap: Map<string, ReturnCallback<IEnemy>> = new Map();

scriptSssets.forEach(generator => {
  // if (asset.story) {
  //   StoryMap.set(asset.story.id, asset.story);
  // }
  generatorMap.set(generator.id, generator.generator);
});

const Enemies = {
  getGenerator: (id: string): EnvObjectGenerator<IEnemy> => {
    return generatorMap.get(id) as any as EnvObjectGenerator<IEnemy>;
  },
}

export {
  Enemies
};