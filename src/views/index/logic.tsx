import { Message } from "../../core/message";
import { Enemies, GameEvents, } from "@data";
import { endEvent } from "@/models/event/event-end";
import { storyEndEvent } from "@/models/event/story-end";
import { ItemAction, PlayerActionCallback, SkillAction } from "@/types/action";
import { GameEnvironment } from "@/types/game";
import { GameEventNextType, GameEventOption } from "@/types/game-event";
import { IItem } from "@/types/Item";
import { toArray } from "@/utils";
import { calcOptionNextEvent, getOptionNextType } from "@/utils/game-event";
import { showPanel } from "@/utils/game";
import { leaveShopEvent } from "@/models/event/leave-shop";
import { ISkill } from "@/types/Skill";
import { IUnit } from "@/types/Unit";

type AllGameEventNextType = GameEventNextType | 'default' | string;
const optionNextEventMap: { [type in AllGameEventNextType]: (param: { option: GameEventOption, gameEnv: GameEnvironment }) => GameEnvironment } = {
  [GameEventNextType.ENTER_BATTLE]: ({ option, gameEnv }) => {
    gameEnv.enemy = Enemies.getGenerator(option.enemyID!)(gameEnv);
    gameEnv.panels = showPanel(gameEnv, "BATTLE");

    return gameEnv;
  },
  [GameEventNextType.PUSH_STORY]: ({ option, gameEnv }) => {
    if (gameEnv.story.curPage >= gameEnv.story.totalPage) { // 故事读完了
      gameEnv.event = storyEndEvent();
    } else { // 推进到下一章节
      gameEnv.story.curPage++;
      gameEnv.event = GameEvents.get(gameEnv.story.pages[gameEnv.story.curPage - 1].event);
    }

    return gameEnv;
  },
  [GameEventNextType.START_NEW_STORY]: ({ option, gameEnv }) => {
    gameEnv.panels = showPanel(gameEnv, "STORY_CHOOSE");

    return gameEnv;
  },
  [GameEventNextType.GAME_EVENT_END]: ({ option, gameEnv }) => {
    gameEnv.event = endEvent();

    return gameEnv;
  },
  [GameEventNextType.TRADE]: ({ option, gameEnv }) => {
    gameEnv.trade = option.trade!;
    gameEnv.panels = showPanel(gameEnv, "TRADE");
    gameEnv.event = leaveShopEvent();

    return gameEnv;
  },
  [GameEventNextType.STORY_END]: ({gameEnv}) => gameEnv,
  [GameEventNextType.EXIT_TRADE]: ({gameEnv}) => gameEnv,
  'default': ({ option, gameEnv }) => {
    gameEnv.event = calcOptionNextEvent(option, gameEnv);

    return gameEnv;
  }
}

export const handleChooseOption = (gameEnvironment: GameEnvironment) => (option: GameEventOption): GameEnvironment => {
  let gameEnv = gameEnvironment;

  toArray(option.onChoose).forEach(cb => {
    if (!cb) {
      return;
    }

    const processedGameEnv = cb(gameEnv);
    if (processedGameEnv) {
      gameEnv = processedGameEnv;
    }
  });

  const optionNextType = getOptionNextType(option, gameEnv);
  if (optionNextEventMap[optionNextType]) {
    gameEnv = optionNextEventMap[optionNextType]({ option, gameEnv });
  } else {
    gameEnv = optionNextEventMap.default({ option, gameEnv });
  }

  return gameEnv;
}

export const handleItemAction = (gameEnvironment: GameEnvironment) => (action: ItemAction, item: IItem, target?: IUnit[]): GameEnvironment => {
  const { player } = gameEnvironment;
  if (!target || !target.length) {
    target = [player];
  }
  switch (action) {
    case 'EQUIP':
      player.equipItem(item);
      gameEnvironment.player = player;
      break;
    case 'UNEQUIP':
      player.unequipItem(item);
      gameEnvironment.player = player;
      break;
  }

  return gameEnvironment;
}

export const handleSkillAction = (gameEnvironment: GameEnvironment) => async (action: SkillAction, skill: ISkill, target?: IUnit[]): Promise<GameEnvironment> => {
  const { player } = gameEnvironment;
  if (!target || !target.length) {
    target = [player];
  }
  switch (action) {
    case 'CAST_SKILL':
      for await (const unit of target) {
        let p = await player.castSkill(skill.data.id, unit);
        gameEnvironment.player = p;
      }
      break;
  }

  return gameEnvironment;
}
