import { BattleActionCalbackParam, BattlePanel } from "@/components/ui/battle-panel";
import { StoryChoosePanel } from "@/components/ui/story-choose-panel";
import { Message } from "@/core/message";
import { GameEvents } from "@data";
import { battleEndEvent } from "@/models/event/battle-end";
import { DataCallback, VoidCallback } from "@/types";
import { BattleAction } from "@/types/battle";
import { GameEnvironment } from "@/types/game";
import { Story } from "@/types/game-event";
import { delay, runAsyncGenerate } from "@/utils";
import { GameEventPanel } from "@/components/ui/event-panel";
import { handleChooseOption } from "../logic";
import { useState } from "react";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { TradePanel } from "@/components/ui/trade-panel";
import { isPanelVisible, showPanel } from "@/utils/game";
import { ItemPrice } from "@/types/Item";
import { leaveShopEvent } from "@/models/event/leave-shop";

type MainPanelParam = {
  gameEnvironment: GameEnvironment;
  applyEnvironment: DataCallback<GameEnvironment>;
};

export const StoryChoosePanelHOC = ({
  gameEnvironment,
  applyEnvironment,
}: MainPanelParam) => {
  if (gameEnvironment.panels[0] !== "STORY_CHOOSE") {
    return null;
  }

  const handleChooseStory = (story: Story) => {
    gameEnvironment.story = story;
    gameEnvironment.event = GameEvents.get(story.pages[0].event);
    gameEnvironment.panels = showPanel(gameEnvironment, "EVENT");

    applyEnvironment(gameEnvironment);
  };

  return (
    <StoryChoosePanel onChooseStory={handleChooseStory}></StoryChoosePanel>
  );
};

type BattleActionMapParam = { gameEnvironment: GameEnvironment } & Partial<Pick<BattleActionCalbackParam, 'ext'>>;
const battleActionMap: {
  [action in BattleAction]: (
    obj: BattleActionMapParam
  ) => AsyncGenerator<BattleActionMapParam, BattleActionMapParam, BattleActionMapParam>;
} = {
  LEAVE_BATTLE: async function* ({ gameEnvironment, ext }) {
    gameEnvironment.battle = {
      isInBattle: false,
      round: 0,
      curRoundOwner: "NONE",
      playerCanDoAction: false,
    };

    return { gameEnvironment, ext }
  },
  ENTER_BATTLE: async function* ({ gameEnvironment, ext }) {
    const { player, enemy } = gameEnvironment;
    gameEnvironment.battle = {
      isInBattle: true,
      round: 1,
      curRoundOwner: "NONE",
      playerCanDoAction: false,
    };

    Message.push("=========================");
    Message.push("进入战斗");
    await delay(620);
    const isPlayerFirst = enemy.status.speed <= player.status.speed;
    Message.push(
      `速度对比：玩家(${player.status.speed}) vs 对方(${enemy.status.speed})。${
        isPlayerFirst ? "玩家" : "对方"
      }先手。`
    );
    await delay(620);

    const roundOwner = isPlayerFirst ? "PLAYER" : "ENEMY";
    gameEnvironment.battle.curRoundOwner = roundOwner;

    return { gameEnvironment, ext }
  },
  ROUND_START: async function* ({ gameEnvironment, ext }) {
    gameEnvironment.battle.round += 1;

    return { gameEnvironment, ext }
  },
  ROUND_END: async function* ({ gameEnvironment, ext }) {
    if (gameEnvironment.battle.curRoundOwner === "ENEMY") {
      gameEnvironment.battle.curRoundOwner = "PLAYER";
    } else if (gameEnvironment.battle.curRoundOwner === "PLAYER") {
      gameEnvironment.battle.curRoundOwner = "ENEMY";
    }

    return { gameEnvironment, ext }
  },
  PLAYER_ROUND_START: async function* ({ gameEnvironment, ext }) {
    const { player, enemy } = gameEnvironment;
    await player.fire("roundStart", { source: player, target: enemy });
    Message.push("玩家回合开始");
    gameEnvironment.battle.playerCanDoAction = true;

    return { gameEnvironment, ext }
  },
  PLAYER_ROUND_END: async function* ({ gameEnvironment, ext }) {
    const { player, enemy } = gameEnvironment;
    await player.fire("roundEnd", { source: player, target: enemy });

    gameEnvironment.battle.playerCanDoAction = false;
    yield { gameEnvironment, ext };
    await delay(1000);

    Message.push("玩家回合结束");

    await delay(1000);

    yield { gameEnvironment, ext } = yield* await battleActionMap.ROUND_END({ gameEnvironment, ext });

    await delay(1000);

    return { gameEnvironment, ext }
  },
  ENEMY_ROUND_START: async function* ({ gameEnvironment, ext }) {
    const { player, enemy } = gameEnvironment;
    await enemy.fire("roundStart", { source: enemy, target: player });
    Message.push("敌方回合开始");

    await delay(1000);
    await enemy.fire("aiRoundStart", { source: enemy, target: player });
    yield { gameEnvironment, ext };

    await delay(1000);

    yield { gameEnvironment, ext } = yield* await battleActionMap.ENEMY_ROUND_END({ gameEnvironment, ext });

    return { gameEnvironment, ext }
  },
  ENEMY_ROUND_END: async function* ({ gameEnvironment, ext }) {
    const { player, enemy } = gameEnvironment;
    await enemy.fire("roundEnd", { source: enemy, target: player });
    Message.push("敌方回合结束");
    await delay(1000);
    yield { gameEnvironment, ext } = yield* await battleActionMap.ROUND_END({ gameEnvironment, ext });

    return { gameEnvironment, ext }
  },

  ATTACK: async function* ({ gameEnvironment, ext }) {
    const { player, enemy } = gameEnvironment;
    await player.attack(enemy);

    yield { gameEnvironment, ext };

    yield { gameEnvironment, ext } = yield* await battleActionMap.PLAYER_ROUND_END({ gameEnvironment, ext });

    return { gameEnvironment, ext };
  },
  SKILL: async function* ({ gameEnvironment, ext }) {
    await gameEnvironment.player.castSkill(ext?.id!, gameEnvironment.player);

    yield { gameEnvironment, ext } = yield* await battleActionMap.PLAYER_ROUND_END({ gameEnvironment, ext });

    return { gameEnvironment, ext };
  }
};

export const BattlePanelHOC = ({
  gameEnvironment,
  applyEnvironment,
}: MainPanelParam) => {
  const { player, enemy, panels, battle } = gameEnvironment;

  useEffect(() => {
    (async () => {
      if (isPanelVisible(gameEnvironment, "BATTLE")) {
        await runAsyncGenerate(battleActionMap.ENTER_BATTLE, { gameEnvironment }, obj => {
          gameEnvironment = obj.gameEnvironment;
          applyEnvironment(gameEnvironment);
        })
        // battleActionMap.ENTER_BATTLE(gameEnvironment);
      } else {
        await runAsyncGenerate(battleActionMap.LEAVE_BATTLE, { gameEnvironment }, obj => {
          gameEnvironment = obj.gameEnvironment;
          applyEnvironment(gameEnvironment);
        })
      }
    })();
  }, [panels[0]]);

  useEffect(() => {
    (async () => {
      console.log(gameEnvironment.battle.curRoundOwner);
      switch (gameEnvironment.battle.curRoundOwner) {
        case "PLAYER":
          gameEnvironment.battle.curRoundOwner = "PLAYER";
          applyEnvironment(gameEnvironment);

          await runAsyncGenerate(battleActionMap.ROUND_START, { gameEnvironment }, obj => {
            gameEnvironment = obj.gameEnvironment;
            applyEnvironment(gameEnvironment);
          })
          await runAsyncGenerate(battleActionMap.PLAYER_ROUND_START, { gameEnvironment }, obj => {
            gameEnvironment = obj.gameEnvironment;
            applyEnvironment(gameEnvironment);
          })

          break;
        case "ENEMY":
          gameEnvironment.battle.curRoundOwner = "ENEMY";
          applyEnvironment(gameEnvironment);

          await runAsyncGenerate(battleActionMap.ROUND_START, { gameEnvironment }, obj => {
            gameEnvironment = obj.gameEnvironment;
            applyEnvironment(gameEnvironment);
          })
          await runAsyncGenerate(battleActionMap.ENEMY_ROUND_START, { gameEnvironment }, obj => {
            gameEnvironment = obj.gameEnvironment;
            applyEnvironment(gameEnvironment);
          })

          break;
        case "NONE":
        default:
          break;
      }
    })();
  }, [gameEnvironment.battle.curRoundOwner]);

  const handleBattleAction = async ({ action, ext }: BattleActionCalbackParam) => {
    const { player, enemy } = gameEnvironment;
    if (!enemy) {
      return;
    }

    await runAsyncGenerate(battleActionMap[action], { gameEnvironment, ext }, obj => {
      gameEnvironment = obj.gameEnvironment;
      applyEnvironment(gameEnvironment);
    })

    if (enemy.status.curHP <= 0) {
      gameEnvironment.event = battleEndEvent({ enemy }, gameEnvironment);
      await delay(600);
      gameEnvironment.panels.shift();
      gameEnvironment.panels.unshift("EVENT");
    }

    applyEnvironment(gameEnvironment);
  };

  const calcBtnState = (action: string) => {
    return gameEnvironment.battle.playerCanDoAction;
  };

  if (panels[0] != "BATTLE") {
    return null;
  }

  return (
    <BattlePanel
      calcBtnState={calcBtnState}
      player={player}
      enemy={enemy}
      onAction={handleBattleAction}
    ></BattlePanel>
  );
};

export const GameEventPanelHOC = ({
  gameEnvironment,
  applyEnvironment,
}: MainPanelParam) => {
  const { panels } = gameEnvironment;

  if (panels[0] != "EVENT") {
    return null;
  }

  return (
    <GameEventPanel
      event={gameEnvironment.event}
      onNeedRefresh={applyEnvironment}
      onChooseOption={(option) =>
        applyEnvironment(handleChooseOption(gameEnvironment)(option))
      }
    ></GameEventPanel>
  );
};

export const TradePanelHOC = ({
  gameEnvironment,
  applyEnvironment,
}: MainPanelParam) => {
  useEffect(() => {
    if (!gameEnvironment.trade?.shopkeeperGenerator) {
      return;
    }

    gameEnvironment.trade.shopkeeper =
      gameEnvironment.trade.shopkeeperGenerator(gameEnvironment);

    applyEnvironment(gameEnvironment);
  }, [gameEnvironment.trade, gameEnvironment.player]);

  if (!isPanelVisible(gameEnvironment, "TRADE")) {
    return null;
  }

  if (!gameEnvironment.trade?.shopkeeper || !gameEnvironment.player) {
    return <></>;
  }

  const onSaleItem = (itemID: string, price: ItemPrice) => {
    if (!gameEnvironment.trade) {
      return;
    }

    gameEnvironment.player.removeItemByID(itemID, 1);
    gameEnvironment.trade.shopkeeper.addItemByID(itemID, 1);

    gameEnvironment.player.addItemByID(price.subject, price.amount);
    gameEnvironment.trade.shopkeeper.removeItemByID(
      price.subject,
      price.amount
    );

    gameEnvironment.trade.onDealDone(gameEnvironment.trade.shopkeeper);
    applyEnvironment(gameEnvironment);
  };
  const onBuyItem = (itemID: string, price: ItemPrice) => {
    if (!gameEnvironment.trade) {
      return;
    }

    gameEnvironment.player.addItemByID(itemID, 1);
    gameEnvironment.trade.shopkeeper.removeItemByID(itemID, 1);

    gameEnvironment.player.removeItemByID(price.subject, price.amount);
    gameEnvironment.trade.shopkeeper.addItemByID(price.subject, price.amount);

    gameEnvironment.trade.onDealDone(gameEnvironment.trade.shopkeeper);
    applyEnvironment(gameEnvironment);
  };

  const onExit = () => {
    gameEnvironment.trade = undefined;
    gameEnvironment.event = leaveShopEvent();

    gameEnvironment.panels = showPanel(gameEnvironment, "EVENT");

    applyEnvironment(gameEnvironment);
  };

  return (
    <TradePanel
      onExit={onExit}
      onSaleItem={onSaleItem}
      onBuyItem={onBuyItem}
      shopper={gameEnvironment.player}
      shopkeeper={gameEnvironment.trade.shopkeeper}
      priceList={gameEnvironment.trade.priceList}
    ></TradePanel>
  );
};
