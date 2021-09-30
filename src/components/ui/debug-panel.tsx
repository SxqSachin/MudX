import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil";
import { runExpr } from "../../core/expr";
import { GameEnvironmentAtom } from "../../store";
import { DataCallback, VoidCallback } from "../../types";
import { BattleAction } from "../../types/battle";
import { GameEnvironment } from "../../types/game";
import { GameEvent, GameEventFork, GameEventOption } from "../../types/game-event";
import { IUnit } from "../../types/Unit";
import { isString, toArray } from "../../utils";
import { ProgressBar } from "../widget/progress-bar";


type DebugPanelParam = {
  onEnvironmentChange: DataCallback<GameEnvironment>,
}
export function DebugPanel({onEnvironmentChange}: DebugPanelParam) {
  const gameEnvironment = useRecoilValue(GameEnvironmentAtom);

  const increaseHP = (val: number) => {
    gameEnvironment.player.increaseStatus('curHP', val);

    onEnvironmentChange(gameEnvironment);
  }

  return (
    <div className="w-full">
        <button className="btn" onClick={() => increaseHP(1)}>Increase HP</button>
    </div>
  )
}