import { DataCallback, ReturnCallback } from "../../types";
import { Story, StoryGenerator } from "../../types/game-event";
import { Enemy } from "../../types/Unit";
import { deepClone } from "../../utils";
import scriptSssets from "./script";

const generatorMap: Map<string, ReturnCallback<Enemy>> = new Map();

scriptSssets.forEach(generator => {
  // if (asset.story) {
  //   StoryMap.set(asset.story.id, asset.story);
  // }
  generatorMap.set(generator.id, generator.generator);
});

const Enemies = {
  get: (id: string): ReturnCallback<Enemy> => {
    return generatorMap.get(id) as any as ReturnCallback<Enemy>;
  },
}

export {
  Enemies
};