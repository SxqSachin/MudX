import { BattlePanel } from "@/components/ui/battle-panel";
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

const battleActionMap: {
  [action in BattleAction]: (
    gameEnvironment: GameEnvironment,
  ) => AsyncGenerator<GameEnvironment, GameEnvironment, GameEnvironment>;
} = {
  LEAVE_BATTLE: async function*(gameEnvironment) {
    gameEnvironment.battle = {
      isInBattle: false,
      round: 0,
      curRoundOwner: "NONE",
    };

    return gameEnvironment
  },
  ENTER_BATTLE: async function*(gameEnvironment) {
    const { player, enemy } = gameEnvironment;
    gameEnvironment.battle = {
      isInBattle: true,
      round: 1,
      curRoundOwner: "NONE",
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

    return gameEnvironment
  },
  ROUND_START: async function*(gameEnvironment) {
    gameEnvironment.battle.round += 1;

    return gameEnvironment
  },
  ROUND_END: async function*(gameEnvironment) {
    if (gameEnvironment.battle.curRoundOwner === "ENEMY") {
      gameEnvironment.battle.curRoundOwner = "PLAYER";
    } else if (gameEnvironment.battle.curRoundOwner === "PLAYER") {
      gameEnvironment.battle.curRoundOwner = "ENEMY";
    }

    return gameEnvironment
  },
  PLAYER_ROUND_START: async function*(gameEnvironment) {
    const { player, enemy } = gameEnvironment;
    await player.fire("roundStart", { source: player, target: enemy });
    Message.push("玩家回合开始");

    return gameEnvironment
  },
  PLAYER_ROUND_END: async function*(gameEnvironment) {
    const { player, enemy } = gameEnvironment;
    await player.fire("roundEnd", { source: player, target: enemy });

    Message.push("玩家回合结束");

    yield gameEnvironment = yield* await battleActionMap.ROUND_END(gameEnvironment);

    // await delay(1000);


    await delay(1000);

    return gameEnvironment
  },
  ENEMY_ROUND_START: async function*(gameEnvironment) {
    const { player, enemy } = gameEnvironment;
    await enemy.fire("roundStart", { source: enemy, target: player });
    Message.push("敌方回合开始");

    await delay(1000);
    await enemy.fire("aiRoundStart", { source: enemy, target: player });
    yield gameEnvironment;

    await delay(1000);

    yield gameEnvironment = yield* await battleActionMap.ENEMY_ROUND_END(gameEnvironment);

    return gameEnvironment
  },
  ENEMY_ROUND_END: async function*(gameEnvironment) {
    const { player, enemy } = gameEnvironment;
    await enemy.fire("roundEnd", { source: enemy, target: player });
    Message.push("敌方回合结束");
    await delay(1000);
    yield gameEnvironment = yield* await battleActionMap.ROUND_END(gameEnvironment);

    return gameEnvironment
  },

  ATTACK: async function*(gameEnvironment) {
    const { player, enemy } = gameEnvironment;
    await player.attack(enemy);

    yield gameEnvironment;

    yield gameEnvironment = yield* await battleActionMap.PLAYER_ROUND_END(gameEnvironment);

    return gameEnvironment;
  },
};

export const BattlePanelHOC = ({
  gameEnvironment,
  applyEnvironment,
}: MainPanelParam) => {
  const { player, enemy, panels, battle } = gameEnvironment;

  useEffect(() => {
    (async () => {
      if (isPanelVisible(gameEnvironment, "BATTLE")) {
        await runAsyncGenerate(battleActionMap.ENTER_BATTLE, gameEnvironment, env => {
          gameEnvironment = env;
          applyEnvironment(env);
        })
        // battleActionMap.ENTER_BATTLE(gameEnvironment);
      } else {
        await runAsyncGenerate(battleActionMap.LEAVE_BATTLE, gameEnvironment, env => {
          gameEnvironment = env;
          applyEnvironment(env);
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

          await runAsyncGenerate(battleActionMap.ROUND_START, gameEnvironment, env => {
            gameEnvironment = env;
            applyEnvironment(env);
          })
          await runAsyncGenerate(battleActionMap.PLAYER_ROUND_START, gameEnvironment, env => {
            gameEnvironment = env;
            applyEnvironment(env);
          })

          break;
        case "ENEMY":
          gameEnvironment.battle.curRoundOwner = "ENEMY";
          applyEnvironment(gameEnvironment);

          await runAsyncGenerate(battleActionMap.ROUND_START, gameEnvironment, env => {
            gameEnvironment = env;
            applyEnvironment(env);
          })
          await runAsyncGenerate(battleActionMap.ENEMY_ROUND_START, gameEnvironment, env => {
            gameEnvironment = env;
            applyEnvironment(env);
          })

          break;
        case "NONE":
        default:
          break;
      }
    })();
  }, [gameEnvironment.battle.curRoundOwner]);

  const handleBattleAction = async (action: BattleAction) => {
    const { player, enemy } = gameEnvironment;
    if (!enemy) {
      return;
    }

    await runAsyncGenerate(battleActionMap[action], gameEnvironment, env => {
      gameEnvironment = env;
      applyEnvironment(env);
    })

    // let result = await it.next(curGameEnvironment);
    // while (!result.done) {
    //   result = await it.next();
    //   curGameEnvironment = result.value;
    //   applyEnvironment(curGameEnvironment);
    // }

    if (enemy.status.curHP <= 0) {
      gameEnvironment.event = battleEndEvent({ enemy }, gameEnvironment);
      await delay(600);
      gameEnvironment.panels.shift();
      gameEnvironment.panels.unshift("EVENT");
    }

    applyEnvironment(gameEnvironment);
  };

  const calcBtnState = (action: string) => {
    return gameEnvironment.battle.curRoundOwner === "PLAYER";
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
