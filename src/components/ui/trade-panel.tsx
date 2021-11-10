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
  const itemNameMap: {[id: string]: string} = {};
  return (
    <>
      <div>{shopkeeper.data.name}</div>
      <hr className="my-4 border-gray-300" />
      <div>
        <div className="mb-2 pb-2 border-b border-gray-200">
          <span className="inline-block w-3/6 text-left">物品名称</span>
          <span className="inline-block w-2/6 text-left">{role==='shopper' ? '出售价' : '购买价'}</span>
          <span className="inline-block w-1/6 text-right">数量</span>
        </div>
        {Object.keys(shopkeeper.items).map((itemID) => {
          const salePrice = role === 'shopper' ? priceList?.[itemID]?.enterPrice: priceList?.[itemID]?.salePrice;

          let canAfford = true;
          if (salePrice) {
            if (!shopper.items[salePrice.subject] || shopper.items[salePrice.subject].length < salePrice.amount) {
              canAfford = false;
            }
          }

          let hasStore = !!shopkeeper.items[itemID].length;

          if (!hasStore) {
            return <></>;
          }

          const onClick = (hasStore && canAfford) ? () => onItemClick(itemID, salePrice ?? ({} as any as ItemPrice)) : noop;
          const itemName = !itemNameMap[itemID]
            ? (() => {
                const name = Items.get(itemID).data.name;
                itemNameMap[itemID] = name;
                return name;
              })()
            : itemNameMap[itemID];

          return (
            <div
              className={"cursor-pointer w-full my-2" + ((canAfford && hasStore) ? '' : ' text-gray-300 cursor-not-allowed') }
              key={itemID}
              onClick={onClick}
            >
              <span className="inline-block w-3/6 text-left">{itemName}</span>
              <span className="inline-block w-2/6 text-left">{salePrice ? `${salePrice.amount}${itemName}` : '免费'}</span>
              <span className="inline-block w-1/6 text-right">{shopkeeper.items[itemID].length}</span>
            </div>
          );
        })}
      </div>
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
      <div className="">
        <h2 className="inline-block">{shopkeeper.name}</h2>
        <button className="float-right inline-block text-red-500" onClick={onExit}>离开</button>
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
