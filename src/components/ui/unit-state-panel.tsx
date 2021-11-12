import { i18n } from "../../i18n";
import { IUnit, UnitStatusType } from "@/types/Unit";
import { States } from "@data/states";

type UnitStatePanelParam = {
  unit: IUnit;
};
export function UnitStatePanel({ unit }: UnitStatePanelParam) {
  return (
    <>
      <ul className="w-full h-full flex flex-col relative">
        {Object.keys(unit.states).map((key) => {
          if (!unit.states[key].length) {
            return;
          }
          return (
            <li className="mb-1" key={key}>
              <span> {unit.states[key][0].name} </span>
              <span className="float-right">
                {unit.states[key][0].remainTime < 0 ? '永久' : unit.states[key][0].remainTime}
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
