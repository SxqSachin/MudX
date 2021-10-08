import { useState } from "react";
import { ItemAction } from "../../types/action";
import { IItem } from "../../types/Item";
import { IUnit } from "../../types/Unit";
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
    <div className="w-full h-full">
      <div className="flex flex-col h-full">
        { curPanel === 'STATUS' && <UnitStatusPanel unit={unit}></UnitStatusPanel> }
        { curPanel === 'ITEM' && <UnitItemPanel unit={unit} onItemAction={onItemAction}></UnitItemPanel> }
        { curPanel === 'EQUIPMENT' && <UnitEquipmentPanel unit={unit} onItemAction={onItemAction}></UnitEquipmentPanel> }
      </div>
      <div className="flex flex-row justify-between border-top h-8">
        <button onClick={() => onPanelChange('STATUS')}>Status</button>
        <button onClick={() => onPanelChange('ITEM')}>Item</button>
        <button onClick={() => onPanelChange('EQUIPMENT')}>Equipment</button>
      </div>
    </div>
  )
}