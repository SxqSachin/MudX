import { i18n } from "../../i18n";
import { IUnit, UnitStatusType } from "@/types/Unit";
import { States } from "@data/states";

type UnitSkillPanelParam = {
  unit: IUnit;
};
export function UnitSkillPanel({ unit }: UnitSkillPanelParam) {
  return (
    <>
      <ul className="w-full h-full flex flex-col relative">
        {Object.keys(unit.skills).map((key) => {
          return (
            <li className="mb-1" key={unit.skills[key].data.id}>
              <span> {unit.skills[key].data.name} </span>
              <span className="float-right">
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
