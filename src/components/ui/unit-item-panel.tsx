import { useState } from "react";
import { ItemAction } from "@/types/action";
import { IItem } from "@/types/Item";
import { IUnit } from "@/types/Unit";
import { isEmpty } from "@/utils";
import { ItemDetailPopup } from "./item-detail";

type UnitItemPanelParam = {
  unit: IUnit;
  onItemAction: (action: ItemAction, unit: IUnit, item: IItem) => void;
};
export function UnitItemPanel({ unit, onItemAction }: UnitItemPanelParam) {
  const [curFocusItem, setCurFocusItem] = useState<IItem>({} as any as IItem);

  const handleItemAction = (action: ItemAction, item: IItem) => {
    onItemAction(action, unit, item);
    clearCurFocusItem();
  }

  const clearCurFocusItem = () => {
    setCurFocusItem({} as any as IItem);
  }

  return (
    <>
      <div className="w-full h-full flex flex-col relative">
        {Object.keys(unit.items).map((key) => {
          const itemList = unit.items[key];

          return itemList.map((item) => {
            if (item.data.isEquipable) {
              return (
                <div className="cursor-pointer" key={item.data.xid ?? key} onClick={() => setCurFocusItem(item)}>
                  <span>
                    {item.data.name} {item.data.isEquipped ? "(装备中)" : ""}
                  </span>
                  <span className="float-right"> {item.data.durability} </span>
                </div>
              );
            }
            return (
              <div className="cursor-pointer" key={item.data.xid ?? key}>
                <span> {item.data.name} </span>
                <span className="float-right"> 1 </span>
              </div>
            );
          });
        })}
      </div>
      {!isEmpty(curFocusItem) && <ItemDetailPopup item={curFocusItem} onClose={clearCurFocusItem} onItemAction={handleItemAction}></ItemDetailPopup>}
    </>
  );
}
