import { ItemAction } from "../../types/action";
import { IItem } from "../../types/Item";
import { IUnit } from "../../types/Unit";

type UnitEquipmentPanelParam = {
  unit: IUnit,
  onItemAction: (action: ItemAction, item: IItem) => void;
}
export function UnitEquipmentPanel({unit, onItemAction}: UnitEquipmentPanelParam) {
  return (
    <div className="w-full">
      <div className="flex flex-col">
        {
          Object.keys(unit.items).filter(key => {
            return unit.items[key][0].data.isEquipable
          }).map(key => {
            const itemList = unit.items[key];

            return itemList.map(item => {
              if (!item.data.isEquipable || !item.data.isEquipped) {
                return <></>;
              }

              return (
                <div className="" key={item.data.xid} onClick={() => onItemAction('UNEQUIP', item)}>
                  <span> {item.data.name} </span>
                  <span className="float-right"> {item.data.durability} </span>
                </div>
              )
            })
          })
        }
      </div>
    </div>
  )
}