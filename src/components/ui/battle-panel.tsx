import { useEffect, } from "react";
import { DataCallback, } from "@/types";
import { BattleAction } from "@/types/battle";
import { IUnit } from "@/types/Unit";
import { ProgressBar } from "../widget/progress-bar";
import { noop } from "@/utils";
import { i18n } from "@/i18n";

type BattlePanelParam = {
  player: IUnit,
  enemy: IUnit,

  calcBtnState: (btnKey: string) => boolean;

  onAction: DataCallback<BattleAction>,
}
export function BattlePanel({player, enemy, onAction, calcBtnState}: BattlePanelParam) {

  const handleAction = (action: BattleAction) => {
    onAction(action);
  }

  const btnList = [{ action: "ATTACK", label: "btn_attack" }];

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between">
        <div className="w-28">
          <div>{player.name}</div>
          <ProgressBar max={player.status.maxHP} cur={player.status.curHP}></ProgressBar>
        </div>
        <div className="w-28">
          <div>{enemy.name}</div>
          <ProgressBar max={enemy.status.maxHP} cur={enemy.status.curHP} direction="right"></ProgressBar>
        </div>
      </div>
      <div className="">
        {
          btnList.map(btn => {
            const isBtnEnable = calcBtnState(btn.action);

            const onClick = isBtnEnable ? () => handleAction("ATTACK") : noop;
            const btnClass = `btn ${isBtnEnable ? "" : 'btn--disabled cursor-not-allowed'}`;

            return <button key={btn.action} className={btnClass} onClick={onClick}>{i18n(btn.label)}</button>
          })
        }
      </div>
    </div>
  )
}