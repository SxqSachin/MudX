import { useEffect, } from "react";
import { DataCallback, } from "@/types";
import { BattleAction } from "@/types/battle";
import { IUnit } from "@/types/Unit";
import { ProgressBar } from "../widget/progress-bar";
import { noop } from "@/utils";
import { i18n } from "@/i18n";

export type BattleActionCalbackParam = { action: BattleAction; ext: { id: string } };
type BattlePanelParam = {
  player: IUnit;
  enemy: IUnit;

  calcBtnState: (btnKey: string) => boolean;

  onAction: DataCallback<BattleActionCalbackParam>;
};
export function BattlePanel({player, enemy, onAction, calcBtnState}: BattlePanelParam) {

  const handleAction = (action: BattleAction, id: string) => {
    onAction({ action, ext: { id } });
  }

  const btnList = [{ action: "ATTACK" as BattleAction, label: "btn_attack", id: 'attack' }];

  Object.keys(player.skills).forEach(key => {
    btnList.push({action: "SKILL", id: key, label: player.skills[key].data.name})
  })

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

            const onClick = isBtnEnable ? () => handleAction(btn.action, btn.id) : noop;
            const btnClass = `btn ${isBtnEnable ? "" : 'btn--disabled cursor-not-allowed'}`;

            return <button key={btn.action + btn.id} className={btnClass} onClick={onClick}>{i18n(btn.label, btn.label)}</button>
          })
        }
      </div>
    </div>
  )
}