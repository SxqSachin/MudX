import { VoidCallback } from "@/types";
import { ItemAction } from "@/types/action";
import { IItem, ItemID, ItemPrice, PriceList } from "@/types/Item";
import { IUnit } from "@/types/Unit";
import { noop } from "@/utils";
import { Items } from "@data/items";
import { Popup, PopupParam } from "../widget/popup";

type ItemTradePanelParam = {
  role: "shopper" | "shopkeeper";
  shopper: IUnit;
  shopkeeper: IUnit;
  priceList?: PriceList;
  onItemClick: (itemID: ItemID, price: ItemPrice) => void;
};
function ItemTradePanel({ role, shopper, shopkeeper, priceList, onItemClick }: ItemTradePanelParam ) {
  // if (!shopkeeper || !shopper) {
  //   return <></>
  // }
  return (
    <>
      <div>{shopkeeper.data.name}</div>
      <hr className="my-4" />
      {Object.keys(shopkeeper.items).map((itemID) => {
        const salePrice = role === 'shopper' ? priceList?.[itemID]?.enterPrice: priceList?.[itemID]?.salePrice;

        let canAfford = true;
        if (salePrice) {
          if (!shopper.items[salePrice.subject] || shopper.items[salePrice.subject].length < salePrice.amount) {
            canAfford = false;
          }
        }

        const onClick = canAfford ? () => onItemClick(itemID, salePrice ?? ({} as any as ItemPrice)) : noop;

        return (
          <div
            className={"cursor-pointer" + (canAfford ? '' : ' text-gray-300 cursor-not-allowed') }
            key={itemID}
            onClick={onClick}
          >
            <span>{Items.get(itemID).data.name}</span>
            <span className="float-right">{shopkeeper.items[itemID].length}</span>
          </div>
        );
      })}
    </>
  );
}

type TradePanelParam = {
  shopper: IUnit;
  shopkeeper: IUnit;
  priceList?: PriceList;

  onSaleItem: (itemID: string, price: ItemPrice) => void;
  onBuyItem: (itemID: string, price: ItemPrice) => void;
  onExit: VoidCallback;
};
export function TradePanel({
  shopper,
  shopkeeper,
  priceList,
  onSaleItem,
  onBuyItem,
  onExit,
}: TradePanelParam) {
  return (
    <>
      <div>
        <button className="mr-4 inline-block" onClick={onExit}>
          {"<<"}
        </button>
        <h2 className="inline-block">{shopkeeper.name}</h2>
      </div>
      <hr className="my-4" />
      <div className="flex flex-row h-full">
        <div className="inline-block w-1/2 h-full">
          <div className="h-full">
            <ItemTradePanel
              onItemClick={onSaleItem}
              role="shopper"
              shopper={shopkeeper}
              shopkeeper={shopper}
              priceList={priceList}
            ></ItemTradePanel>
          </div>
        </div>
        <div className="w-0.5 bg-gray-300 mx-4"></div>
        <div className="inline-block w-1/2 h-full">
          <div className="h-full">
            <ItemTradePanel
              onItemClick={onBuyItem}
              role="shopkeeper"
              shopper={shopper}
              shopkeeper={shopkeeper}
              priceList={priceList}
            ></ItemTradePanel>
          </div>
        </div>
      </div>
    </>
  );
}
