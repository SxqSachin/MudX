import { Component, useState } from "react";
import { ItemAction } from "@/types/action";
import { IItem } from "@/types/Item";
import { IUnit } from "@/types/Unit";
import { UnitEquipmentPanel } from "./unit-equipment-panel";
import { UnitItemPanel } from "./unit-item-panel";
import { UnitStatusPanel } from "./unit-status-panel";
import { UnitStatePanel } from "./unit-state-panel";
import { GiSkills, GiBackpack, GiBattleGear, GiHistogram } from 'react-icons/gi';
import { IconType } from "react-icons/lib";

type UnitInfoPanelParam = {
  unit: IUnit,
  onItemAction: (action: ItemAction, item: IItem) => void;
}
type PanelType = 'STATUS' | 'STATE' | 'ITEM' | 'EQUIPMENT';

const PanelList: {type: PanelType, name: string, icon: IconType}[] = [
  { type: 'STATUS', name: '属性', icon: GiHistogram },
  { type: 'STATE', name: '状态', icon: GiSkills },
  { type: 'ITEM', name: '物品', icon: GiBackpack },
  { type: 'EQUIPMENT', name: '装备', icon: GiBattleGear },
];

export function UnitInfoPanel({unit, onItemAction}: UnitInfoPanelParam) {
  const [curPanel, setCurPanel] = useState<PanelType>('STATUS');

  const onPanelChange = (panel: PanelType) => {
    setCurPanel(panel);
  }

  return (
    <div className="w-full h-full relative">
      <div className="h-full flex flex-col overflow-auto" style={{height: "calc(100% - 3rem)"}}>
        { curPanel === 'STATUS' && <UnitStatusPanel unit={unit}></UnitStatusPanel> }
        { curPanel === 'STATE' && <UnitStatePanel unit={unit}></UnitStatePanel> }
        { curPanel === 'ITEM' && <UnitItemPanel unit={unit} onItemAction={onItemAction}></UnitItemPanel> }
        { curPanel === 'EQUIPMENT' && <UnitEquipmentPanel unit={unit} onItemAction={onItemAction}></UnitEquipmentPanel> }
      </div>
      <div className="absolute bottom-0 w-full flex flex-row justify-between border-t p-4 pb-0 h-18">
        {
          PanelList.map(panelInfo => {
            const { type, name } = panelInfo;
            return (
              <button onClick={() => onPanelChange(type)} title={name}>
                <panelInfo.icon className={"text-2xl " + (curPanel === type ? "text-blue-600" : "text-gray-600")}></panelInfo.icon>
              </button>
            );
          })
        }
      </div>
    </div>
  )
}