import { useEffect, useState } from "react";
import { runExpr } from "../../core/expr";
import { DataCallback, VoidCallback } from "../../types";
import { BattleAction } from "../../types/battle";
import { GameEvent, GameEventFork, GameEventOption } from "../../types/game-event";
import { IUnit } from "../../types/Unit";
import { isString, toArray } from "../../utils";
import { ProgressBar } from "../widget/progress-bar";

type BattlePanelParam = {
  player: IUnit,
  enemy: IUnit,

  onAction: DataCallback<BattleAction>,
}
export function BattlePanel({player, enemy, onAction}: BattlePanelParam) {
  useEffect(() => {
  }, []);

  const handleAction = (action: BattleAction) => {
    onAction(action);
  }

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
        <button onClick={() => handleAction("ATTACK")}>Attack</button>
      </div>


    </div>
  )
}