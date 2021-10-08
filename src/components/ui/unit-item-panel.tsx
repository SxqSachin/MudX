import { DataCallback } from "../../types";
import { ItemAction } from "../../types/action";
import { IItem } from "../../types/Item";
import { IUnit } from "../../types/Unit";

type UnitItemPanelParam = {
  unit: IUnit,
  onItemAction: (action: ItemAction, item: IItem) => void;
}
export function UnitItemPanel({unit}: UnitItemPanelParam) {
  return (
    <div className="w-full">
      <div className="flex flex-col">
        {
          Object.keys(unit.items).map(key => {
            const item = unit.items[key];
            return (
              <div className="" key={key}>
                <span> {item[0].data.name} </span>
                <span className="float-right"> {item.length} </span>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}