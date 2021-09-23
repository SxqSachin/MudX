import { useEffect, useState } from "react";
import { runExpr } from "../../core/expr";
import { DataCallback } from "../../types";
import { GameEvent, GameEventFork, GameEventOption } from "../../types/game-event";
import { IUnit } from "../../types/Unit";
import { isString, toArray } from "../../utils";
import { ProgressBar } from "../widget/progress-bar";

type BattlePanelParam = {
  player: IUnit,
  enemy: IUnit,
}
export function BattlePanel({player, enemy}: BattlePanelParam) {
  useEffect(() => {
  }, []);

  return (
    <div className="flex flex-row w-full justify-between">
      <div className="w-28">
        <div>{player.name}</div>
        <ProgressBar max={player.status.maxHP} cur={player.status.curHP}></ProgressBar>
      </div>
      <div className="w-28">
        <div>{enemy.name}</div>
        <ProgressBar max={enemy.status.maxHP} cur={enemy.status.curHP} direction="right"></ProgressBar>
      </div>


    </div>
  )
}