import { BattlePanel } from "@/components/ui/battle-panel";
import { StoryChoosePanel } from "@/components/ui/story-choose-panel";
import { Message } from "@/core/message";
import { GameEvents } from "@data";
import { battleEndEvent, } from "@/models/event/battle-end";
import { DataCallback, VoidCallback } from "@/types";
import { BattleAction } from "@/types/battle";
import { GameEnvironment } from "@/types/game";
import { Story } from "@/types/game-event";
import { delay } from "@/utils";
import { GameEventPanel } from "@/components/ui/event-panel";
import { handleChooseOption } from "../logic";
import { useState } from "react";
import { useEffect } from "react";

type MainPanelParam = {
  gameEnvironment: GameEnvironment;
  applyEnvironment: DataCallback<GameEnvironment>;
};

export const StoryChoosePanelHOC = ({gameEnvironment, applyEnvironment}: MainPanelParam) => {
  if (!gameEnvironment.panels.has('STORY_CHOOSE')) {
      return null;
    }

    const handleChooseStory = (story: Story) => {
      gameEnvironment.story = story;
      gameEnvironment.event = GameEvents.get(story.pages[0].event);
      gameEnvironment.panels.add('EVENT').delete('STORY_CHOOSE');

      applyEnvironment(gameEnvironment);
    };

    return <StoryChoosePanel onChooseStory={handleChooseStory}></StoryChoosePanel>
}

export const BattlePanelHOC = ({gameEnvironment, applyEnvironment}: MainPanelParam) => {
  const { player, enemy, panels } = gameEnvironment;

  const [lastRoundType, setLastRoundType] = useState<"PLAYER" | "ENEMY" | "">("");
  const [curRoundType, setCurRoundType] = useState<"PLAYER" | "ENEMY" | "">("");
  const [curRoundNum, setCurRoundNum] = useState(0);

  useEffect(() => {
    if (!lastRoundType) {
      return;
    }
    (async () => {
      battleActionMap['ROUND_END']();

      if (lastRoundType === 'PLAYER') {
        battleActionMap['ENEMY_ROUND_END']();
      } else if (lastRoundType === 'ENEMY') {
        battleActionMap['PLAYER_ROUND_END']();
      }

      await delay(1000);

      battleActionMap['ROUND_START']();
      if (lastRoundType === 'PLAYER') {
        battleActionMap['PLAYER_ROUND_START']();
      } else if (lastRoundType === 'ENEMY') {
        battleActionMap['ENEMY_ROUND_START']();
      }
    })();
  }, [lastRoundType]);

  if (!enemy) {
    return null;
  }
  const battleActionMap: { [action in BattleAction]: VoidCallback } = {
    ATTACK: async () => {
      player.attack(enemy);

      await delay(1000);
      setLastRoundType("ENEMY");
    },
    ENTER_BATTLE: async () => {
      Message.push("=========================")
      Message.push("进入战斗");
      await delay(620);
      const isPlayerFirst = enemy.status.speed <= player.status.speed;
      Message.push(`速度对比：玩家(${player.status.speed}) vs 对方(${enemy.status.speed})。${isPlayerFirst?"玩家":"对方"}先手。`);
      await delay(620);

      if (!isPlayerFirst) {
        setLastRoundType("ENEMY");
      } else {
        setLastRoundType("PLAYER");
      }

      applyEnvironment(gameEnvironment);
    },
    ROUND_START: async () => {
      setCurRoundNum(curRoundNum + 1);
      if (!gameEnvironment.battle) {
        gameEnvironment.battle = {
          isInBattle: true,
          round: 1
        }
      } else {
        gameEnvironment.battle.round += 1;
      }
    },
    ROUND_END: async () => {
    },
    PLAYER_ROUND_START: async () => {
      await player.fire("roundStart", {source: player, target: enemy})
      Message.push("玩家回合开始");
    },
    PLAYER_ROUND_END: async () => {
      await player.fire("roundEnd", {source: player, target: enemy})
      Message.push("玩家回合结束");
    },
    ENEMY_ROUND_START: async () => {
      await enemy.fire("roundStart", {source: enemy, target: player})
      Message.push("敌方回合开始");

      await enemy.fire("aiRoundStart", {source: enemy, target: player})

      await delay(1000);
      setLastRoundType("PLAYER");
    },
    ENEMY_ROUND_END: async () => {
      await enemy.fire("roundEnd", {source: enemy, target: player})
      Message.push("敌方回合结束");
    },
  }

  const handleBattleAction = async (action: BattleAction) => {
    const { player, enemy } = gameEnvironment;
    if (!enemy) {
      return;
    }

    await battleActionMap[action]?.();

    if (enemy.status.curHP <= 0) {
      gameEnvironment.event = battleEndEvent({ enemy }, gameEnvironment);
      await delay(600);
      gameEnvironment.panels.add("EVENT").delete("BATTLE");
    }

    applyEnvironment(gameEnvironment);
  }

  if (!panels.has('BATTLE')) {
    return null;
  }

  return <BattlePanel player={player} enemy={enemy} onAction={handleBattleAction}></BattlePanel>
}

export const GameEventPanelHOC = ({ gameEnvironment, applyEnvironment }: MainPanelParam) => {
  const { panels } = gameEnvironment;

  if (!panels.has("EVENT")) {
    return null;
  }

  return <GameEventPanel event={gameEnvironment.event} onChooseOption={option => applyEnvironment(handleChooseOption(gameEnvironment)(option))}></GameEventPanel>
}