import { StoryChoosePanel } from "@/components/ui/story-choose-panel";
import { GameEvents } from "@data";
import { DataCallback, } from "@/types";
import { GameEnvironment } from "@/types/game";
import { Story } from "@/types/game-event";
import { GameEventPanel } from "@/components/ui/event-panel";
import { handleChooseOption } from "../logic";
import { useEffect } from "react";
import { TradePanel } from "@/components/ui/trade-panel";
import { isPanelVisible, showPanel } from "@/utils/game";
import { ItemPrice } from "@/types/Item";
import { leaveShopEvent } from "@/models/event/leave-shop";

export type MainPanelParam = {
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
