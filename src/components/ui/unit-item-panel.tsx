import { DataCallback } from "../../types";
import { ItemAction } from "../../types/action";
import { IItem } from "../../types/Item";
import { IUnit } from "../../types/Unit";

type UnitItemPanelParam = {
  unit: IUnit;
  onItemAction: (action: ItemAction, item: IItem) => void;
};
export function UnitItemPanel({ unit }: UnitItemPanelParam) {
  return (
    <div className="w-full h-full flex flex-col">
      {Object.keys(unit.items).map((key) => {
        const itemList = unit.items[key];

        return itemList.map((item) => {
          if (item.data.isEquipable) {
            return (
              <div className="" key={item.data.xid ?? key}>
                <span>
                  {" "}
                  {item.data.name} {item.data.isEquipped ? "(装备中)" : ""}{" "}
                </span>
                <span className="float-right"> {item.data.durability} </span>
              </div>
            );
          }
          return (
            <div className="" key={item.data.xid ?? key}>
              <span> {item.data.name} </span>
              <span className="float-right"> 1 </span>
            </div>
          );
        });
      })}
    </div>
  );
}
