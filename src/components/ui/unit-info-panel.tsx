import { useState } from "react";
import { ItemAction } from "@/types/action";
import { IItem } from "@/types/Item";
import { IUnit } from "@/types/Unit";
import { UnitEquipmentPanel } from "./unit-equipment-panel";
import { UnitItemPanel } from "./unit-item-panel";
import { UnitStatusPanel } from "./unit-status-panel";

type UnitInfoPanelParam = {
  unit: IUnit,
  onItemAction: (action: ItemAction, item: IItem) => void;
}
type PanelType = 'STATUS' | 'ITEM' | 'EQUIPMENT';
export function UnitInfoPanel({unit, onItemAction}: UnitInfoPanelParam) {
  const [curPanel, setCurPanel] = useState<PanelType>('STATUS');

  const onPanelChange = (panel: PanelType) => {
    setCurPanel(panel);
  }

  return (
    <div className="w-full h-full relative">
      <div className="h-full flex flex-col overflow-auto" style={{height: "calc(100% - 3rem)"}}>
        { curPanel === 'STATUS' && <UnitStatusPanel unit={unit}></UnitStatusPanel> }
        { curPanel === 'ITEM' && <UnitItemPanel unit={unit} onItemAction={onItemAction}></UnitItemPanel> }
        { curPanel === 'EQUIPMENT' && <UnitEquipmentPanel unit={unit} onItemAction={onItemAction}></UnitEquipmentPanel> }
      </div>
      <div className="absolute bottom-0 w-full flex flex-row justify-between border-t p-4 pb-0 h-18">
        <button onClick={() => onPanelChange('STATUS')}>Status</button>
        <button onClick={() => onPanelChange('ITEM')}>Item</button>
        <button onClick={() => onPanelChange('EQUIPMENT')}>Equipment</button>
      </div>
    </div>
  )
}