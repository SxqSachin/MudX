import { Message } from "../../core/message";
import { Enemies, GameEvents, } from "@data";
import { endEvent } from "@/models/event/event-end";
import { storyEndEvent } from "@/models/event/story-end";
import { ItemAction } from "@/types/action";
import { GameEnvironment } from "@/types/game";
import { GameEventNextType, GameEventOption } from "@/types/game-event";
import { IItem } from "@/types/Item";
import { toArray } from "@/utils";
import { calcOptionNextEvent, getOptionNextType } from "@/utils/game-event";

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
  let gameEvent = calcOptionNextEvent(option, gameEnv);

  if (optionNextType === GameEventNextType.ENTER_BATTLE) {
    gameEnv.enemy = Enemies.getGenerator(option.enemyID!)(gameEnv);
    gameEnv.panels.add("BATTLE").delete("EVENT");
  } else if (optionNextType === GameEventNextType.PUSH_STORY) {
    if (gameEnv.story.curPage >= gameEnv.story.totalPage) { // 故事读完了
      gameEvent = storyEndEvent();
    } else { // 推进到下一章节
      gameEnv.story.curPage++;
      gameEvent = GameEvents.get(gameEnv.story.pages[gameEnv.story.curPage - 1].event);
    }
  } else if(optionNextType === GameEventNextType.START_NEW_STORY) { // 开始新的故事
    gameEnv.panels.delete("EVENT");
    gameEnv.panels.delete("BATTLE");
    gameEnv.panels.add("STORY_CHOOSE");
  } else if(optionNextType === GameEventNextType.GAME_EVENT_END) { // 当前章节结束
    gameEvent = endEvent();
  } else { // 普通的故事推进
    gameEvent = calcOptionNextEvent(option, gameEnv);
  }

  gameEnv.event = gameEvent;

  return gameEnv;
}

export const handleItemAction = (gameEnvironment: GameEnvironment) => (action: ItemAction, item: IItem): GameEnvironment => {
  const { player } = gameEnvironment;
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