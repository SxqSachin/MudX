import { IUnit, } from "@/types/Unit";
import { ISkill } from "@/types/Skill";
import { useState } from "react";
import { isEmpty } from "@/utils";
import { SkillDetailPopup } from "./skill-detail";

type UnitSkillPanelParam = {
  unit: IUnit;
  onCastSkill: (unit: IUnit, skill: ISkill, ext?: any) => void;
};
export function UnitSkillPanel({ unit, onCastSkill }: UnitSkillPanelParam) {
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
          onSkillAction={() => {
            clearCurFocusItem();
            onCastSkill(unit, curFocusSkill);
          }}
        ></SkillDetailPopup>
      )}
    </>
  );
}
