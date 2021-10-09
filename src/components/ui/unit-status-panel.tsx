import { i18n } from "../../i18n";
import { IUnit, UnitStatusType } from "../../types/Unit";

type UnitStatusPanelParam = {
  unit: IUnit;
};
export function UnitStatusPanel({ unit }: UnitStatusPanelParam) {
  return (
    <>
      <ul className="w-full h-full flex flex-col relative">
        {Object.keys(unit.status).map((key) => {
          return (
            <li className="mb-8" key={key}>
              <span> {i18n(key)} </span>
              <span className="float-right">
                {unit.status[key as UnitStatusType]}
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}
