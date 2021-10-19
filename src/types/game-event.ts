import { GameAction, } from "./action";
import { ConditionExpr } from "./condition";
import { GameEnvironment } from "./game";
import { IUnit } from "./Unit";

export type GameMap = string;
export enum GameMapType {
  ANY = "GAME_MAP_ANY",
};

export type GameEventID = string;
export type GameEvent = {
  id: GameEventID;

  name: string;

  ext?: any;

  forks: GameEventFork | GameEventFork[];
}

export type GameEventFork = {
  appearInMap?: GameMap | GameMap[] | GameMapType | GameMapType[];

  condition?: ConditionExpr | boolean | ((env: GameEnvironment) => boolean);
  description: string | (() => string);

  onEnter?: GameAction | GameAction[];
  onLeave?: GameAction | GameAction[];

  options: GameEventOption | GameEventOption[];
};

export enum GameEventNextType {
  GAME_EVENT_END = "EVENT_END",
  ENTER_BATTLE = "ENTER_BATTLE",
  PUSH_STORY = "PUSH_STORY",
  STORY_END = "STORY_END",
  START_NEW_STORY = "START_NEW_STORY",
}

export type GameEventOptionID = string;
export type GameEventOption = {
  id?: GameEventOptionID;

  name: string;

  note?: string;

  condition?: ConditionExpr | boolean | ((env: GameEnvironment) => boolean);
  blurOnCheckFailed?: boolean;

  onChoose?: GameAction | GameAction[];

  next: GameEventNextType | GameEventID | ((environment: GameEnvironment) => GameEventID | GameEvent);

  enemyID?: string;
}

// 一组事件的合计
export type StoryEvent = {
  page: number;
  event: GameEventID | GameEvent;
};
export interface Story {
  id: string;

  title: string;
  description: string;

  totalPage: number;
  curPage: number;

  map: GameMap | GameMapType;

  pages: StoryEvent[];
}

export type StoryGenerator = {
  id: string;
  generator: (env: GameEnvironment) => Story;
}