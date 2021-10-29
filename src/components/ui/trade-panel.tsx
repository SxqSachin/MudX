import { ItemAction } from "@/types/action";
import { IItem, PriceList } from "@/types/Item";
import { IUnit } from "@/types/Unit";
import { Items } from "@data/items";
import { Popup, PopupParam } from "../widget/popup";

type TradePanelParam = {
  shopper: IUnit;
  shopkeeper?: IUnit;
  priceList?: PriceList;
};

function ItemTradePanel({ unit, priceList }: { unit?: IUnit, priceList?: PriceList }) {
  if (!unit) {
    return <></>
  }
  console.log(unit.items);
  return (
    <>
      {Object.keys(unit.items).map((itemID) => {
        return (
          <div key={itemID}>
            <span>{Items.get(itemID).data.name}</span>{" "}
            <span className="float-right">{unit.items[itemID].length}</span>
          </div>
        );
      })}
    </>
  );
}

export function TradePanel({
  shopper,
  shopkeeper,
  priceList,
}: TradePanelParam) {
  console.log(shopkeeper, shopkeeper)
  return (
    <div>
      <div className="inline-block w-1/2">
        <div>
          <ItemTradePanel unit={shopper} priceList={priceList}></ItemTradePanel>
        </div>
      </div>
      <div className="inline-block w-1/2">
        <div>
          <ItemTradePanel unit={shopkeeper} priceList={priceList}></ItemTradePanel>
        </div>
      </div>
    </div>
  );
}
