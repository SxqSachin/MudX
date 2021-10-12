import { GameAction, SelfAction } from "./action";
import { ConditionExpr } from "./condition";
import { GameEnvironment } from "./game";
import { IUnit } from "./Unit";

export type GameEventID = string;
export type GameEvent = {
  id: GameEventID;

  name: string;

  ext?: any;

  forks: GameEventFork | GameEventFork[];
}

export type GameEventFork = {
  condition?: ConditionExpr | boolean | ((env: GameEnvironment) => boolean);
  description: string | (() => string);

  onEnter?: GameAction | GameAction[];
  onLeave?: GameAction | GameAction[];

  options: GameEventOption | GameEventOption[];
};

export enum GameEventNextType {
  GAME_EVENT_END = "EVENT_END",
  PUSH_STORY = "PUSH_STORY",
  START_NEW_STORY = "START_NEW_STORY",
}

export type GameEventOptionID = string;
export type GameEventOption = {
  id?: GameEventOptionID;

  name: string;

  note?: string;

  condition?: ConditionExpr | boolean | ((env: GameEnvironment) => boolean);

  onChoose?: GameAction | GameAction[];

  next: GameEventNextType | GameEventID | ((environment: GameEnvironment) => GameEventID | GameEvent);
}

// 一组事件的合计
export type StoryEvent = {
  page: number;
  event: GameEvent;
};
export type Story = {
  title: string;
  description: string;

  totalPage: number;
  curPage: number;

  pages: StoryEvent[];
}