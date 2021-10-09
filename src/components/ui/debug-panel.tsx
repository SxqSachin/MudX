import { useRecoilValue, } from "recoil";
import { GameEnvironmentAtom } from "../../store";
import { DataCallback, } from "../../types";
import { GameEnvironment } from "../../types/game";


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