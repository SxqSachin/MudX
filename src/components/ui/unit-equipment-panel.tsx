import { useState } from "react";
import { ItemAction, PlayerActionCallback } from "@/types/action";
import { IItem } from "@/types/Item";
import { IUnit } from "@/types/Unit";
import { isEmpty } from "@/utils";
import { ItemDetailPopup } from "./item-detail";

type UnitEquipmentPanelParam = {
  unit: IUnit;
  onItemAction: PlayerActionCallback,
};
export function UnitEquipmentPanel({
  unit,
  onItemAction,
}: UnitEquipmentPanelParam) {
  const [curFocusItem, setCurFocusItem] = useState<IItem>({} as any as IItem);

  const handleItemAction: PlayerActionCallback = (action, data) => {
    onItemAction(action, data);
    clearCurFocusItem();
  }

  const clearCurFocusItem = () => {
    setCurFocusItem({} as any as IItem);
  }

  return (
    <>
      <div className="w-full h-full flex flex-col">
        {Object.keys(unit.items)
          .filter((key) => {
            return unit.items[key][0].data.isEquipable;
          })
          .map((key) => {
            const itemList = unit.items[key];

            return itemList.map((item) => {
              if (!item.data.isEquipable || !item.data.isEquipped) {
                return null;
              }

              return (
                <div className="cursor-pointer" key={item.data.xid ?? key} onClick={() => setCurFocusItem(item)}>
                  <span> {item.data.name} </span>
                  <span className="float-right"> {item.data.durability} </span>
                </div>
              );
            });
          })}
      </div>
      {!isEmpty(curFocusItem) && (
        <ItemDetailPopup
          item={curFocusItem}
          onClose={clearCurFocusItem}
          onItemAction={handleItemAction}
        ></ItemDetailPopup>
      )}
    </>
  );
}
