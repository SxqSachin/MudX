import { IUnit, } from "@/types/Unit";
import { ISkill } from "@/types/Skill";
import { useState } from "react";
import { calcFunctionalVal, isEmpty } from "@/utils";
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
          const skill = unit.skills[key];
          return (
            <li
              className="mb-1 cursor-pointer"
              onClick={() => setCurFocusSkill(skill)}
              key={skill.data.id}
              title={calcFunctionalVal(skill.data.description, unit)}
            >
              <span> {skill.data.name} </span>
              <span className="float-right"></span>
            </li>
          );
        })}
      </ul>
      {!isEmpty(curFocusSkill) && (
        <SkillDetailPopup
          unit={unit}
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
