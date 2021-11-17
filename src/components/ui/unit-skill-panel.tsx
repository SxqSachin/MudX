import { IUnit, } from "@/types/Unit";
import { ISkill } from "@/types/Skill";
import { useState } from "react";
import { isEmpty } from "@/utils";
import { SkillDetailPopup } from "./skill-detail";
import { KVPair } from "@/types";
import { PlayerAction, PlayerActionCallback, SkillAction } from "@/types/action";

type UnitSkillPanelParam = {
  unit: IUnit;
  onSkillAction: PlayerActionCallback
  getTargets: () => KVPair<IUnit>[]
};
export function UnitSkillPanel({ unit, onSkillAction, getTargets }: UnitSkillPanelParam) {
  const [curFocusSkill, setCurFocusSkill] = useState<ISkill>(null!);

  const clearCurFocusItem = () => {
    setCurFocusSkill({} as any as ISkill);
  }

  return (
    <>
      <ul className="w-full h-full flex flex-col relative">
        {Object.keys(unit.skills).map((key) => {
          return (
            <li
              className="mb-1 cursor-pointer"
              onClick={() => setCurFocusSkill(unit.skills[key])}
              key={unit.skills[key].data.id}
            >
              <span> {unit.skills[key].data.name} </span>
              <span className="float-right"></span>
            </li>
          );
        })}
      </ul>
      {!isEmpty(curFocusSkill) && (
        <SkillDetailPopup
          skill={curFocusSkill}
          onClose={clearCurFocusItem}
          onSkillAction={(action, data) => {
            clearCurFocusItem();
            onSkillAction(action, data);
          }}
          getTargets={getTargets}
        ></SkillDetailPopup>
      )}
    </>
  );
}
