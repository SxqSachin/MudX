import { useEffect, useState } from "react";
import { runExpr } from "../../core/expr";
import { i18n } from "../../i18n";
import { DataCallback, VoidCallback } from "../../types";
import { BattleAction } from "../../types/battle";
import {
  GameEvent,
  GameEventFork,
  GameEventOption,
} from "../../types/game-event";
import { IUnit, UnitStatusType } from "../../types/Unit";
import { isString, toArray } from "../../utils";
import { ProgressBar } from "../widget/progress-bar";

type UnitStatusPanelParam = {
  unit: IUnit;
};
export function UnitStatusPanel({ unit }: UnitStatusPanelParam) {
  return (
    <div className="w-full h-full flex flex-col">
      {Object.keys(unit.status).map((key) => {
        return (
          <div className="" key={key}>
            <span> {i18n(key)} </span>
            <span className="float-right">
              {" "}
              {unit.status[key as UnitStatusType]}{" "}
            </span>
          </div>
        );
      })}
    </div>
  );
}
