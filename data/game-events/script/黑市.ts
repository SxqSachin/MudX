import { simpleTextEvent } from "@/models/event/simple-event";
import { createUnit, Unit } from "@/models/Unit";
import { GameEvent, GameEventNextType } from "@/types/game-event";

const e: GameEvent = {
  id: "黑市",
  name: "黑市",

  forks: {
    description: "你在一个隐秘的地方找到了一个黑市交易所。",
    options: [
      {
        name: "进去看看",
        next: GameEventNextType.TRADE,
        trade: {
          priceList: {},
          shopkeeper: null!,
          shopkeeperGenerator: () => {
            const unit = createUnit("黑市商人");

            unit.addItemByID('sword', 1);
            unit.addItemByID('shield', 1);

            return unit;
          },
          onDealDone: () => { },
        }
      },
      {
        name: "无视",
        next: env => simpleTextEvent("黑市", "你继续了旅程。", "继续探索"),
      },
    ],
  },
};

const event = Object.freeze(e);
export { event };