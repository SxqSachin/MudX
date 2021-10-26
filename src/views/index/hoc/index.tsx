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
import { useRecoilValue } from "recoil";

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
  const { player, enemy, panels, battle } = gameEnvironment;

  const [lastRoundType, setLastRoundType] = useState<"PLAYER" | "ENEMY" | "">("");
  const [curRoundType, setCurRoundType] = useState<"PLAYER" | "ENEMY" | "">("");
  const [curRoundNum, setCurRoundNum] = useState(0);

  const battleActionMap: { [action in BattleAction]: VoidCallback } = {
    ATTACK: async function() {
      player.attack(enemy);

      await delay(1000);

      await this.PLAYER_ROUND_END();
    },
    LEAVE_BATTLE: async function () {
      gameEnvironment.battle = {
        isInBattle: false,
        round: 0,
        curRoundOwner: 'PLAYER',
      }
    },
    ENTER_BATTLE: async function() {
      gameEnvironment.battle = {
        isInBattle: true,
        round: 1,
        curRoundOwner: 'PLAYER',
      }

      Message.push("=========================")
      Message.push("进入战斗");
      await delay(620);
      const isPlayerFirst = enemy.status.speed <= player.status.speed;
      Message.push(`速度对比：玩家(${player.status.speed}) vs 对方(${enemy.status.speed})。${isPlayerFirst?"玩家":"对方"}先手。`);
      await delay(620);

      const roundOwner = isPlayerFirst ? 'PLAYER' : 'ENEMY';
      gameEnvironment.battle.curRoundOwner = roundOwner;

      setLastRoundType(roundOwner);

      applyEnvironment(gameEnvironment);
    },
    ROUND_START: async function() {
      gameEnvironment.battle.round += 1;

      applyEnvironment(gameEnvironment);
    },
    ROUND_END: async function() {
    },
    PLAYER_ROUND_START: async function() {
      await player.fire("roundStart", {source: player, target: enemy})
      Message.push("玩家回合开始");
    },
    PLAYER_ROUND_END: async function() {
      await player.fire("roundEnd", {source: player, target: enemy})
      Message.push("玩家回合结束");

      await this.ENEMY_ROUND_START();
    },
    ENEMY_ROUND_START: async function() {
      await enemy.fire("roundStart", {source: enemy, target: player})
      Message.push("敌方回合开始");

      await enemy.fire("aiRoundStart", {source: enemy, target: player})

      await delay(1000);
      await this.ENEMY_ROUND_END();
    },
    ENEMY_ROUND_END: async function() {
      await enemy.fire("roundEnd", {source: enemy, target: player})
      Message.push("敌方回合结束");
      await this.PLAYER_ROUND_START();
    },
  }

  useEffect(() => {
    if (panels.has("BATTLE")) {
      battleActionMap.ENTER_BATTLE();
    } else {
      battleActionMap.LEAVE_BATTLE();
    }
  }, [panels.has("BATTLE")])

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