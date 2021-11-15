import { i18n } from "../../i18n";
import { IUnit, UnitStatusType } from "@/types/Unit";
import { States } from "@data/states";
import { ISkill } from "@/types/Skill";
import skill from "@data/skills/script/mental-shield";

type UnitSkillPanelParam = {
  unit: IUnit;
  onCastSkill: (unit: IUnit, skill: ISkill, ext?: any) => void;
};
export function UnitSkillPanel({ unit, onCastSkill }: UnitSkillPanelParam) {
  return (
    <>
      <ul className="w-full h-full flex flex-col relative">
        {Object.keys(unit.skills).map((key) => {
          return (
            <li
              className="mb-1 cursor-pointer"
              onClick={() =>
                onCastSkill(unit, unit.skills[key])
              }
              key={unit.skills[key].data.id}
            >
              <span> {unit.skills[key].data.name} </span>
              <span className="float-right"></span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
